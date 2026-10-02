# خطة الـ Backend لمنصة «الغازي في التاريخ»

مبنية على قراءة الكود الفعلي (الـ services والداتا وصفحات الطالب والمستر)، ومقارنتها بصورة «قواعد الأمان». الكود هو المرجع لما يختلف عن الصورة.

## 1) تعارض الصورة مع الكود (والقرار)

| في الصورة | في الكود | القرار |
|---|---|---|
| جدول Activation Codes للدفع (`is_used`) | نظام **طلبات**: الطالب يحوّل فودافون كاش ويكتب رقم العملية، والمستر يقبل أو يرفض | **الكود هو الصحيح.** مفيش جدول Activation Codes. بدله جدولا طلبات (اشتراك + كتب) |
| Cloudinary للصور | حقل `image` نص رابط | **موافق.** + ضغط الصورة في المتصفح قبل الرفع |
| Google Drive للملازم | حقل `materialUrl` | **موافق** |
| YouTube Unlisted محمي | حقل `videoUrl` | **موافق** مع حماية من السيرفر (قسم 8) |
| تحقق الاشتراك في الـ State فقط | — | **مش كفاية.** التحقق لازم يتم في السيرفر (RLS + دوال) |

## 2) كل خدمة بتخزن إيه

| الخدمة | تخزن إيه | ملاحظة |
|---|---|---|
| **Supabase** (Postgres + Auth + Edge Functions) | كل النصوص والحسابات والامتحانات والدرجات والطلبات والروابط | مفيش صور ولا ملفات فيه |
| **Cloudinary** | صور الكورسات وأغلفة الكتب | في الجدول بس الرابط + `public_id` |
| **Google Drive** | ملازم PDF | في الجدول بس الرابط |
| **YouTube Unlisted** | الفيديوهات | في الجدول بس الرابط |

## 3) الجداول (21 جدول)

كل الأسعار `numeric`، والتواريخ `timestamptz`، والمفاتيح الأساسية `uuid` (إلا الجداول المرجعية الصغيرة).

### أ) مرجعية وإعدادات
1. **grades**: `id text PK`, `label`, `stage`, `sort_order`. (6 صفوف ثابتة)
2. **profiles**: `id uuid PK → auth.users ON DELETE CASCADE`, `role` ('student'|'admin') default 'student', `name`, `email` unique, `phone` unique, `guardian_phone`, `grade_id → grades`, `governorate`, `created_at`.
3. **app_settings**: `key text PK`, `value jsonb`. المفاتيح: `telegram_url`, `master_display_name`.
4. **payment_methods**: `id text PK`, `name`, `account_number`, `support_whatsapp`, `is_active`.

### ب) المحتوى
5. **courses**: `id`, `slug` unique, `title`, `description`, `grade_id`, `duration_label`, `image_url`, `image_public_id`, `published` default false, `created_at`.
6. **course_plans**: `id`, `course_id → courses CASCADE`, `plan_key` ('monthly'|'term'), `name`, `price`, `currency` default 'EGP'. فريد على (course_id, plan_key).
7. **units**: `id`, `course_id CASCADE`, `title`, `position`.
8. **lessons**: `id`, `unit_id CASCADE`, `title`, `duration_label`, `description`, `position`.
9. **lesson_media** (محمي): `lesson_id PK → lessons CASCADE`, `video_url`, `material_url`, `material_title`.

### ج) الامتحانات
10. **exams**: `id`, `course_id CASCADE`, `unit_id → units SET NULL`, `title`, `duration_minutes`, `starts_at`, `ends_at`, `published`, `created_at`.
11. **questions**: `id`, `exam_id CASCADE`, `position`, `type` ('multiple-choice'|'true-false'|'essay'), `body`, `options jsonb`, `score`.
12. **question_answers** (للمستر فقط): `question_id PK → questions CASCADE`, `correct_answer jsonb`.
13. **exam_attempts**: `id`, `exam_id CASCADE`, `student_id → profiles CASCADE`, `auto_score`, `auto_total`, `score`, `total`, `essay_total`, `correct_count`, `incorrect_count`, `status` ('graded'|'needs_review'), `submitted_at`, `graded_at`. **فريد على (exam_id, student_id)** = مرة واحدة فقط.
14. **attempt_answers**: `attempt_id CASCADE`, `question_id CASCADE`, `answer jsonb`, `awarded_score` (null للمقالي قبل التصحيح). PK على الاتنين.

### د) الاشتراكات والصلاحيات
15. **enrollments**: `id`, `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `status` ('active'|'ended'), `starts_at`, `ends_at`, `ended_at`, `source_request_id → subscription_requests SET NULL`. اشتراك نشط واحد فقط لكل (طالب، كورس) بـ partial unique index. و«منتهي» بيتحسب من `ends_at` مش بيتخزن.
16. **subscription_requests**: `id`, `reference_number` unique (default `MK-` + عشوائي)، `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `amount`, `transaction_id` unique, `payment_method_id`, `status` ('pending'|'approved'|'rejected') default pending, `created_at`, `reviewed_at`. طلب pending واحد لكل (طالب، كورس).
17. **lesson_access**: `id`, `student_id CASCADE`, `course_id CASCADE`, `lesson_id CASCADE`, `created_at`. فريد على (student_id, lesson_id). السحب = حذف الصف.

### هـ) الكتب
18. **books**: `id`, `title`, `description`, `grade_id`, `category`, `price`, `image_url`, `image_public_id`, `availability` ('available'|'unavailable'), `created_at`.
19. **book_purchase_requests**: زي طلبات الاشتراك، بـ `book_id` و`reference_number` بادئته `BK-`.
20. **book_purchases** (سجل الملكية): `id`, `student_id CASCADE`, `book_id CASCADE`, `request_id → book_purchase_requests SET NULL`, `purchased_at`. فريد على (student_id, book_id). **حذف الطلب ما بيمسحش الملكية.**

### و) المحادثة
21. **chat_messages**: `id`, `conversation_id` (= student_id)، `sender_role` ('student'|'teacher')، `type`, `body`, `created_at`. (شكلها مرتبط بسؤال مفتوح، قسم 12).

**ملاحظات:**
- رقم عملية التحويل (`transaction_id`) لازم يبقى فريد **عبر الجدولين** (اشتراك وكتب)، فيتعمل trigger يفحص الجدول التاني.
- مفيش جدول للنشاطات: آخر النشاطات في رئيسية المستر بتتحسب من النتائج والطلبات.
- شلت `access_type` و`lesson_id` من طلبات الاشتراك: القرار إن مفيش اشتراك مدفوع بالحصة (الدرس الفردي بصلاحية من المستر).

## 4) الحذف المتسلسل (ON DELETE CASCADE)

- حذف **كورس** ← وحداته ودروسه (والـ media) وامتحاناته وأسئلته وإجاباتها ومحاولاته وإجابات الطلاب واشتراكاته وطلباته وصلاحياته.
- حذف **امتحان** ← أسئلته ومحاولاته.
- حذف **كتاب** ← طلباته وسجل ملكيته.
- حذف **طالب** ← مسح حسابه في Auth (Edge Function بصلاحية service role) ← يمسح الـ profile ← يمسح كل بياناته.
- حذف **وحدة** ← دروسها. والامتحانات المرتبطة بيها `unit_id` يبقى null («مراجعة عامة»).
- حذف **طلب مقبول** ← لا يمس `enrollments` ولا `book_purchases`.
- أزرار «حذف الكل» في لوحة المستر ← دوال RPC للمستر فقط.

## 5) الصلاحيات (RLS)

الكل مفعّل عليه RLS. دالة مساعدة `is_admin()` (security definer) تفحص `profiles.role`.

| الجدول | الزائر | الطالب | المستر |
|---|---|---|---|
| grades، app_settings (العام)، payment_methods (النشطة) | قراءة | قراءة | كامل |
| courses (المنشور)، course_plans، units، lessons، books | قراءة | قراءة | كامل |
| lesson_media | لا | عبر دالة فقط | كامل |
| exams | لا | المنشور في كورساته | كامل |
| questions | لا | عبر دالة فقط (بدون إجابات) | كامل |
| question_answers | لا | **لا** | كامل |
| exam_attempts، attempt_answers | لا | تقرأ بتاعتها فقط | كامل |
| enrollments، lesson_access، book_purchases | لا | بتاعتها (قراءة) | كامل |
| subscription_requests، book_purchase_requests | لا | تنشئ وتقرأ بتاعتها | كامل |
| chat_messages | لا | محادثتها | قراءة وكتابة |
| profiles | لا | بياناتها (من غير تغيير `role`) | كامل |

أمان إضافي: `profiles.role` ما ينفعش الطالب يعدله (trigger أو column privileges).

## 6) الدوال على السيرفر (RPC) و Edge Functions

**RPC (Postgres):**
- `get_exam_questions(exam_id)`: بترجع الأسئلة **بدون إجابات صحيحة**، بشرط: الطالب مشترك، الامتحان منشور وفي وقته، ولم يسلّم قبل كده.
- `submit_exam(exam_id, answers)`: بتصحح الأسئلة التلقائية على السيرفر، وبتسجل المحاولة (مرة واحدة)، وحالتها `needs_review` لو فيه مقالي.
- `grade_essays(attempt_id, scores)`: للمستر. تحدّث الدرجات لكل سؤال، وتعيد حساب الدرجة النهائية (تلقائي + مقالي)، وتقفل الحالة `graded` لما كل المقالي يتصحح.
- `get_lesson_media(lesson_id)`: بترجع الفيديو والملزمة لو الطالب مشترك أو عنده صلاحية للدرس.
- `create_subscription_request(...)` و`create_book_request(...)`: **المبلغ بيتحسب من السيرفر** (من `course_plans` أو `books.price`)، مش من المتصفح.
- `approve_subscription_request(id)`: (للمستر) تنشئ الاشتراك من تاريخ اليوم (شهري +1 شهر، ترم +4 أشهر حسب الثابت الحالي)، وتحدّث الطلب في عملية واحدة. و`reject_...`.
- `approve_book_request(id)`: تسجّل الملكية وتحدّث الطلب. و`reject_...`.
- `extend_enrollment(id, days)` و`end_enrollment(id)` و`grant_lesson_access(student_id, course_id, lesson_ids[])`.
- دوال ملخصات لوحة المستر (`master_dashboard_summary` وغيرها) أو views بدل تحميل الجداول كلها.
- `delete_all_*`: دوال للمستر فقط.

**Edge Functions:**
- `resolve-login`: لو الطالب كتب رقم تليفون، نجيب إيميله ونسجّل به.
- `delete-student`: بصلاحية service role لمسح حساب Auth.
- `cloudinary-sign`: (للمستر) توقيع رفع الصور.
- `cloudinary-delete`: (للمستر) مسح صورة قديمة.
- `storage-usage`: (للمستر) أرقام المساحة (قسم 9).

## 7) الصور: ضغط + رفع

1. المستر يختار صورة ← فحص النوع والحجم الأقصى.
2. **ضغط في المتصفح قبل الرفع** بمكتبة `browser-image-compression`: أقصى بُعد 1600px، صيغة WebP، الهدف ≤ 300KB تقريبًا، ومعالجة في Web Worker.
3. معاينة فورية.
4. وقت «حفظ»: طلب توقيع من `cloudinary-sign` ← رفع لـ Cloudinary في فولدر `alghazi/courses` أو `alghazi/books`.
5. الجدول بيحفظ `image_url` (الـ secure_url) + `image_public_id`.
6. لو الصورة اتغيرت أو الكورس/الكتاب اتحذف ← `cloudinary-delete` بالـ `public_id`، عشان الصور القديمة ما تاكلش المساحة.
7. وقت العرض: روابط بتحويلات `f_auto,q_auto` وعرض مناسب للكارت.

**ليه رفع موقّع بدل unsigned preset؟** الـ unsigned preset اسمه بيبقى ظاهر في الـ frontend، وأي حد يقدر يرفع على حسابك ويخلص المساحة المجانية. والمستر هو الوحيد اللي بيرفع، فالتوقيع من دالة للمستر أنسب.

مفاتيح الـ frontend العامة بس: `VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY` و`VITE_CLOUDINARY_CLOUD_NAME`. الـ API secret وservice role **يتخزنوا في أسرار Edge Functions** ومش في الكود أبدًا.

## 8) الفيديو والملزمة (الحماية بصراحة)

- جدول `lesson_media` ما حدش يقراه إلا المستر، والطالب بياخد الروابط من `get_lesson_media` **بعد فحص اشتراكه**. فالزائر وغير المشترك عمره ما بيستلم الرابط في أي Network request.
- **حد الحماية:** الطالب المشترك يقدر يشوف الـ Video ID في الـ Network ويشاركه. YouTube Unlisted ورابط Drive «أي شخص لديه الرابط» مفيهم منع تقني لده. الحماية الفعلية هي منع غير المشترك.

## 9) عداد المساحة (الإعدادات)

الأرقام الحقيقية لازم تيجي من `storage-usage` (للمستر فقط) وتتخزن مؤقتًا حوالي ساعة:
- **Supabase:** حجم قاعدة البيانات بـ SQL (`pg_database_size`) عن طريق دالة.
- **Cloudinary:** Admin API للاستهلاك (يحتاج الـ secret، فالدالة بس).
- **Google Drive:** ممكن لكن بيحتاج ربط حساب Google (OAuth) مرة واحدة. أصعب واحدة، فتتأجل لآخر مرحلة.
- **YouTube:** مفيش حد مساحة نعرضه.

الحدود (500MB وغيره) بتتغير. تتراجع من صفحات الأسعار الرسمية وتتحط في ثابت واحد. و`masterStorageService` فيه الشكل النهائي جاهز، وبتتبدل جواه فقط.

## 10) خريطة الربط بالكود

**الصفحات والتصميم: صفر تعديل.** اللي بيتغير:

| الجزء | الشغل |
|---|---|
| 17 service أساسية (`courseService`...) | تتحول من الداتا المحلية لـ Supabase. **نفس أسماء الدوال والمدخلات والمخرجات.** |
| 12 service للمستر | فلترة وتقسيم وإحصائيات بـ queries و`range` و`count` ودوال RPC. المدخلات والمخرجات ثابتة. |
| `studentService.getCurrentStudent` | تقرأ من جلسة Auth |
| `subscriptionService` و`bookPurchaseService` | إنشاء الطلب عبر RPC (المبلغ من السيرفر)، وشيل فرع `accessType = "lesson"` |
| `ExamInterface` و`ExamResult` و`questionService` | الأسئلة من `get_exam_questions`، والتسليم من `submit_exam`، والنتيجة من الـ attempt، وشيل `sessionStorage` |
| `Login` و`Signup` | يتوصلوا بـ `authService` |
| `utils/readImageFile.js` + `MasterImageField` | ضغط + رفع Cloudinary |
| `masterStorageService` | استدعاء `storage-usage` |

**ملفات جديدة:** `lib/supabaseClient.js`، `mappers/` (تحويل snake_case لـ camelCase بنفس الأسماء الحالية)، `services/authService.jsx`، `context/AuthContext.jsx`، حماية للمسارات (`ProtectedRoute` و`AdminRoute`)، `services/mediaService.jsx`.

## 11) ترتيب التنفيذ (الموقع يفضل شغال في كل خطوة)

1. **الأساس:** مشروع Supabase، الجداول، RLS، الدوال، بيانات أولية (الصفوف، وسيلة الدفع، الإعدادات).
2. **القراءة العامة:** الصفوف والكورسات والخطط والدروس والكتب ووسائل الدفع.
3. **الحسابات:** التسجيل (trigger ينشئ الـ profile)، الدخول (+ بالتليفون)، `getCurrentStudent`، حماية المسارات.
4. **رحلة الطالب:** الاشتراكات، الدروس (الميديا بالدالة)، الامتحانات (جلب + تسليم)، النتائج، طلبات الاشتراك والكتب، ملكية الكتب.
5. **لوحة المستر:** الخدمات واحدة واحدة (الطلاب، الكورسات، الامتحانات، النتائج، الاشتراكات، الكتب، الصلاحيات، الإعدادات)، مع دوال القبول والتصحيح.
6. **الصور:** ضغط ورفع Cloudinary وحذف القديم.
7. **المساحة والتصليب:** `storage-usage`، اختبار RLS لكل دور، مراجعة الأسرار.

## 12) أسئلة مفتوحة (ومعاها الافتراض)

1. **الشات (`chat_messages`):** في الكود الرسائل بين «student» و«teacher» والرسالة الأولى «أنا مساعدك الدراسي». هل مين بيرد: المستر بنفسه؟ ولا مساعد ذكي (AI)؟ **الافتراض:** رسائل عادية بين الطالب والمستر. لو AI، الـ backend بيتغير (Edge Function تكلم الـ AI، وحد استخدام).
2. **الدخول بالتليفون:** Supabase بيسجّل بالإيميل والباسورد بسهولة. الافتراض: نسجّل بالإيميل، ولو كتب تليفون نحوّله لإيميله بـ `resolve-login`.
3. **تأكيد الإيميل:** الافتراض: مش مطلوب في البداية.
4. **حساب المستر:** بيتعمل مرة واحدة يدويًا، ويتحط له `role = 'admin'` بـ SQL.
5. **البيانات التجريبية:** الافتراض: ننقل بس الصفوف ووسيلة الدفع والإعدادات. المحتوى التجريبي (كورسات، طلاب وهميين) اختياري.
