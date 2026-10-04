# الغازي في التاريخ — README المرجعي للمشروع

> **إلى أي مساعد ذكاء اصطناعي يقرأ هذا الملف:** هذا هو المرجع الأساسي للمشروع (القرارات + الحالة + خطة الـ Backend). اقرأه كاملًا قبل أي شيء. لو اختلف هذا الملف مع الكود الفعلي، **الكود الفعلي هو الأصح**، وبلّغ المستخدم بالاختلاف بدل ما تفترض. لا تكتب أي كود قبل ما تقرأ الملفات الحالية المرتبطة بالمهمة. **تصميم الـ Backend المعتمد موجود في القسم 16 (حرفيًا)**.

آخر تحديث لهذا الملف: 3 أكتوبر 2026. (يحل محل نسخة 29 سبتمبر 2026 القديمة.)

ملفات مرجعية مصاحبة (في جذر المشروع): `STUDY_MAP.md` (خريطة مذاكرة الملفات بالترتيب)، `BACKEND_PLAN.md` (نسخة مستقلة من القسم 16)، `BACKEND_BUILD_PROMPT.md` (البرومت اللي بيُسلَّم للـ AI اللي هينفذ الـ Backend).

---

## 1. فكرة المشروع

**«الغازي في التاريخ»** منصة تعليمية متخصصة في التاريخ والدراسات الاجتماعية (مصر). صاحب المنصة مدرس واحد يُسمّى في المشروع **«المستر» / Master**.

**الطالب يقدر:**

- ينشئ حسابه ويختار صفه الدراسي.
- يشترك في الكورسات.
- يفتح الدروس ويشاهد الفيديوهات والمواد.
- يدخل الامتحانات (**مرة واحدة فقط لكل امتحان**) ويشوف النتائج.
- يشتري الكتب والمذكرات.
- يتواصل من Chat داخل الموقع (والمستر يتابع من Telegram).

**المستر يدير كل ده من Master Dashboard:** الطلاب، الكورسات والدروس، الامتحانات والأسئلة، النتائج والتصحيح، الاشتراكات، طلبات شراء الكتب، الكتب، صلاحيات الدروس الخاصة، وإعدادات الحساب والدفع.

**أهم مبدأ للـ Master Dashboard:** لوحة **تشغيلية** يومية، واضحة، Premium وProfessional. مش منصة تحليلات (BI).

---

## 2. الحالة الحالية (مهم جدًا)

| الجزء | الحالة |
|---|---|
| الموقع العام (Home / Login / Signup / Courses / CourseDetails / Books / Subscription / BookPurchase) | موجود |
| Student Dashboard كامل (Home, Courses, Lesson, Exams, Exam, Result, Books, Profile, Support) | موجود |
| **Master Dashboard (الـ 10 صفحات)** | **مبني بالكامل على Mock Data**: الرئيسية، الطلاب، الكورسات، الامتحانات، النتائج، الاشتراكات، طلبات الكتب، الكتب، صلاحيات الدروس، الإعدادات (مع صفحات النماذج والتفاصيل) |
| بنية الكود | 3 طبقات: `data` (Mock) ← `services` (المنطق، async) ← الصفحات (عرض فقط). كل صفحة مستر لها `master<Page>Service` |
| `npm run build` | ينجح. وأخطاء الـ lint الموجودة 6 ملفات قديمة (Chat, ChatMessage, CourseDetails, ExamTimer, DashboardResults, LessonPage) |
| Backend / Supabase | **لا يوجد بعد.** كل الداتا Mock. خطته الكاملة في القسم 16 |
| Auth حقيقي / حماية Routes | **لا يوجد** (`getCurrentStudent()` بترجع أول طالب Mock، والـ Login والـ Signup بيتحققوا من المدخلات فقط) |
| الصور | مؤقتة في الذاكرة (تضيع مع الـ refresh) لحد ما نربط Cloudinary |
| الشات | Mock حاليًا. **خارج نطاق Supabase**: هيتربط بـ Firebase لاحقًا كخدمة منفصلة |

**قواعد الكود اللي المشروع ماشي عليها (لازم تتحافظ عليها في أي إضافة):**

1. الصفحات والمكونات **لا تستورد من `src/data`** (الاستثناء الوحيد: `utils/gradeUtils.jsx` لأن الصفوف ثابتة). كل شيء عبر `src/services`.
2. دوال الـ services كلها `async`، وبترجع **نسخ** (`{...item}` أو `[...items]`) مش المصفوفة الأصلية، ومقارنة الـ IDs بـ `String(a) === String(b)`.
3. قوائم المستر ترجع `{ rows, pagination: { page, pageSize, pageCount, total }, ...خيارات الفلاتر }` والفلترة والتقسيم داخل الـ service.
4. كل نصوص الحالات العربية من `src/constants/statusLabels.js` عبر `getLabel()`.
5. تعريف «الاشتراك النشط» في مكان واحد: `isEnrollmentActive` في `enrollmentService.jsx`.
6. الصفحات بتحمّل بـ `hooks/useAsyncData` (loading أول مرة + error + إلغاء عند الخروج).
7. العمليات متعددة الخطوات (قبول طلب، تصحيح، حذف متسلسل) موجودة كدالة واحدة في service، وفيها تعليق «ملاحظة Supabase»: بتتحول لـ RPC/CASCADE وقت الربط والصفحات ما تتغيرش.
8. لوحة المستر: الهيرو بالصورة في **الرئيسية فقط**، وباقي الصفحات شريط علوي رفيع باسم الصفحة (`MasterTopbar` بيقرا اسم المستر ورابط Telegram من إعداداته).

---

## 3. التقنيات (من `package.json` الفعلي)

| المكتبة | الإصدار |
|---|---|
| `@fontsource/cairo` | `^5.3.0` |
| `@fortawesome/fontawesome-svg-core` | `^7.3.1` |
| `@fortawesome/free-brands-svg-icons` | `^7.3.1` |
| `@fortawesome/free-solid-svg-icons` | `^7.3.1` |
| `@fortawesome/react-fontawesome` | `^3.5.0` |
| `@tailwindcss/vite` | `^4.3.3` |
| `react` | `^19.2.8` |
| `react-dom` | `^19.2.8` |
| `react-router-dom` | `^7.18.3` |
| `swiper` | `^14.2.0` |
| `tailwindcss` | `^4.3.3` |
| `uuid` | `^14.0.2` |
| `vite` | `^8.3.0` |
| `@babel/core` | `^7.29.7` |
| `@eslint/js` | `^10.0.1` |
| `@rolldown/plugin-babel` | `^0.2.3` |
| `@types/react` | `^19.2.18` |
| `@types/react-dom` | `^19.2.4` |
| `@vitejs/plugin-react` | `^6.1.0` |
| `babel-plugin-react-compiler` | `^1.0.0` |
| `eslint` | `^10.9.0` |
| `eslint-plugin-react-hooks` | `^7.1.1` |
| `eslint-plugin-react-refresh` | `^0.5.4` |
| `globals` | `^17.11.0` |

**الأوامر:**

```bash
npm run dev   # vite
npm run build   # vite build
npm run lint   # eslint .
npm run preview   # vite preview
```

ملاحظات: Tailwind v4 (إعداد الألوان في `src/index.css` داخل `@theme`). مكتبة `@supabase/supabase-js` و`browser-image-compression` **لسه مش متثبتة** وهتتضاف وقت الربط.

---

## 4. الهوية البصرية

- **الاتجاه:** Premium تاريخي، داكن (Dark Navy) مع ذهبي (Gold). عربي RTL بالكامل.
- **الخط:** Cairo (400 / 600 / 700 / 800).
- **الألوان (معرّفة في `src/index.css` داخل `@theme`):**

| المتغير | القيمة |
|---|---|
| `midnight` | `#0a1628` |
| `charcoal` | `#132238` |
| `navy` | `#1a2d4a` |
| `gold` | `#d4af37` |
| `gold-light` | `#e5c158` |
| `warm-white` | `#f5f0e8` |
| `muted-gray` | `#a8a29e` |
| `border-navy` | `#2a4a6b` |
| `success` | `#10b981` |
| `danger` | `#ef4444` |

- كل صفحة/Layout بتبدأ بـ `dir="rtl"` وخلفية `bg-midnight text-white`.
- **Master:** نفس الهوية العامة (ألوان، خطوط، Spacing، Buttons، Cards) مع طابع Admin أكثر تنظيمًا. **مش** نظام بصري منفصل. الأنماط المشتركة (أزرار، حقول، كروت) في `Components/DashboardMaster/Shared/masterStyles.js`.

---

---

## 5. شجرة الملفات (الحالية فعليًا)

التفصيل الكامل بالترتيب التعليمي موجود في `STUDY_MAP.md`.

```text

src/
  App.css                            ملف فاضي (0 بايت) ومش مستخدم. ممكن تمسحه أو تسيبه.
  App.jsx                            خريطة كل الصفحات (Routes): العامة، لوحة الطالب، لوحة المستر. أي صفحة جديدة بتتسجل هنا.
  index.css                          الألوان (Midnight/Gold...) وخط Cairo وإعدادات Tailwind العامة. مصدر الهوية البصرية.
  main.jsx                           نقطة بداية التطبيق: بيركّب React في الصفحة ويلف App بـ StrictMode وBrowserRouter.

src/Components/
  AboutPlatform.jsx                  قسم «عن المنصة»: مميزات المنصة في بطاقات (فهم الأحداث، الاستعداد للامتحانات...).
  Chat.jsx                           نافذة المحادثة (مساعد دراسي): جلب وإرسال رسائل.
  CourseDetails.jsx                  صفحة تفاصيل الكورس (/courses/:id): الوحدات والدروس وخطط الاشتراك، وبتفحص اشتراك الطالب.
  Courses.jsx                        قسم أحدث الكورسات: بيجيب الكورسات المنشورة ويعرضها كبطاقات تودي لصفحة التفاصيل.
  ExamResult.jsx                     صفحة نتيجة الامتحان بعد التسليم (/exam-result/:id).
  Footer.jsx                         تذييل الموقع: وصف المنصة وروابط التواصل والتنقل.
  HeroSection.jsx                    قسم الهيرو: العنوان الكبير «تعلّم التاريخ بأسلوب مختلف» وصورة المستر وأزرار البداية.
  Login.jsx                          نموذج تسجيل الدخول (تحقق من المدخلات). لسه مش بيعمل دخول فعلي: ينتظر الربط.
  Navbar.jsx                         الشريط العلوي للموقع: الشعار والروابط وزرارين تسجيل الدخول وإنشاء حساب.
  ScrollToTop.jsx                    بيرجّع الصفحة لأعلى كل ما تتنقل بين صفحتين.
  Signup.jsx                         نموذج إنشاء حساب (تحقق من المدخلات). لسه مش بيحفظ طالب فعليًا: ينتظر الربط.
  StudentOpinions.jsx                قسم آراء الطلاب (نصوص ثابتة في الملف).

src/Components/Books/
  BookCard.jsx                       بطاقة كتاب عامة: صورة وسعر وزر شراء (أو «غير متاح للشراء» لو المستر أوقفه).
  BooksSection.jsx                   قسم الكتب في الرئيسية: بيجيب الكتب ويعرض بطاقات BookCard.

src/Components/Chat/
  ChatMessage.jsx                    فقاعة رسالة واحدة.

src/Components/DashboardMaster/
  MasterLayout.jsx                   هيكل لوحة المستر: السايدبار الثابت + الشريط العلوي + مكان الصفحات.
  MasterSidebar.jsx                  القائمة الجانبية (10 أقسام) وزر الهمبرجر على الموبايل وتسجيل الخروج.
  MasterTopbar.jsx                   الرئيسية: Hero بصورة. باقي الصفحات: شريط رفيع باسم الصفحة. الاسم وTelegram من إعدادات المستر.

src/Components/DashboardMaster/Shared/
  MasterConfirmModal.jsx             نافذة تأكيد (للحذف والعمليات الخطرة).
  MasterEmptyState.jsx               رسالة «لا توجد بيانات».
  MasterField.jsx                    حقل نموذج موحّد (نص/قائمة/نص طويل) مع رسالة خطأ.
  MasterImageField.jsx               رفع صورة مؤقت (يتبدل بـ Cloudinary).
  MasterModal.jsx                    نافذة عامة للنماذج والتفاصيل.
  MasterNotice.jsx                   شريط نجاح/خطأ.
  MasterPageHeader.jsx               عنوان الصفحة + زر رجوع/إضافة.
  MasterPagination.jsx               التقسيم على صفحات (بتاخد itemLabel: طالب/كورس...).
  MasterSearchFilters.jsx            شريط البحث والفلاتر.
  MasterStatCard.jsx                 كارت رقم/إحصائية.
  MasterStatusBadge.jsx              بادج الحالة الملون.
  MasterTabs.jsx                     تبويبات (في صفحة الاشتراكات).
  masterStyles.js                    كلاسات الأزرار والحقول والكروت المشتركة (الهوية في مكان واحد).

src/Components/DashboardStudent/
  DashboardBookCard.jsx              بطاقة كتاب لطالب: شراء/قيد المراجعة/تم الشراء/مرفوض/غير متاح.
  DashboardExamCard.jsx              بطاقة امتحان في قائمة الطالب.
  DashboardLayout.jsx                هيكل لوحة الطالب: السايدبار + مكان الصفحات.
  DashboardResultCard.jsx            بطاقة نتيجة.
  DashboardSidebar.jsx               قائمة لوحة الطالب الجانبية.
  EmptyState.jsx                     رسالة «لا يوجد محتوى» للطالب.
  ExamQuestionCard.jsx               عرض سؤال واحد بكل أنواعه (اختيار، صح/خطأ، مقالي).
  ExamQuestionNavigator.jsx          أرقام الأسئلة للتنقل السريع.
  ExamTimer.jsx                      مؤقت الامتحان.

src/Components/Lesson/
  LessonContentList.jsx              قائمة وحدات ودروس الكورس بجانب الدرس.
  LessonMaterials.jsx                زر تحميل الملزمة (بيحوّل رابط Google Drive لرابط تنزيل).
  LessonVideo.jsx                    مشغّل فيديو YouTube: بيستخرج الـ Video ID ويعرضه في iframe.

src/Page/
  BookPurchase.jsx                   صفحة شراء كتاب: بيانات الدفع ورقم التحويل وإرسال الطلب.
  Books.jsx                          صفحة كل الكتب (/books) مع فلتر الصف. (بتستورد grades من data مباشرة: تتحول لـ getGrades.)
  Home.jsx                           الصفحة الرئيسية: بترص الأقسام بالترتيب (Navbar ← Hero ← عن المنصة ← الكورسات ← الكتب ← الآراء ← Footer).
  Subscription.jsx                   صفحة الاشتراك في كورس بخطة معينة: بيانات الدفع وإرسال طلب الاشتراك.

src/Page/DashboardMaster/
  MasterBookForm.jsx                 إضافة/تعديل كتاب.
  MasterBookRequests.jsx             طلبات شراء الكتب: مراجعة وقبول ورفض وحذف.
  MasterBooks.jsx                    كروت الكتب: متاح/غير متاح، معاينة، حذف.
  MasterCourseContent.jsx            إدارة وحدات ودروس كورس (ترتيب ↑↓، فيديو، ملزمة).
  MasterCourseForm.jsx               إضافة/تعديل كورس (البيانات والأسعار والصورة).
  MasterCourses.jsx                  كروت الكورسات: نشر/إخفاء/حذف مع ملخص بالسجلات.
  MasterExamForm.jsx                 إضافة/تعديل امتحان (الكورس والوحدة والوقت).
  MasterExamManage.jsx               إدارة أسئلة الامتحان + استيراد JSON بمعاينة.
  MasterExams.jsx                    قائمة الامتحانات وإحصائياتها (حالة الوقت تتحسب تلقائيًا).
  MasterHome.jsx                     رئيسية المستر: إحصائيات، أشياء تحتاج إجراء، آخر النتائج والنشاطات.
  MasterLessonAccess.jsx             منح وسحب صلاحيات دروس فردية.
  MasterPlaceholder.jsx              صفحة «قيد التجهيز» لأي رابط ملوش صفحة.
  MasterResultDetails.jsx            تفاصيل نتيجة وتصحيح الأسئلة المقالية.
  MasterResults.jsx                  قائمة النتائج: فلاتر، تصدير CSV، حذف.
  MasterSettings.jsx                 الحساب، كلمة المرور، بيانات الدفع، المساحة المستخدمة، حذف المحادثات.
  MasterStudentDetails.jsx           تفاصيل طالب: بياناته واشتراكاته ونتائجه وطلباته، وتعديل/حذف.
  MasterStudents.jsx                 قائمة الطلاب: بحث وفلاتر وتقسيم وإحصائيات.
  MasterSubscriptions.jsx            تبويبان: الاشتراكات (تمديد/إنهاء) وطلبات الاشتراك (قبول/رفض/حذف).

src/Page/DashboardStudent/
  DashboardBooks.jsx                 كتب الطالب وحالة شراء كل كتاب.
  DashboardCourses.jsx               كورسات الطالب المشترك فيها.
  DashboardExams.jsx                 قائمة امتحانات الطالب وحالتها (متاح/منتهي/تم الحل).
  DashboardHome.jsx                  رئيسية الطالب: ملخص كورساته وامتحاناته ونتائجه.
  DashboardProfile.jsx               الملف الشخصي للطالب.
  DashboardResults.jsx               كل نتائج الطالب.
  DashboardSupport.jsx               صفحة الدعم (بتعرض مكوّن المحادثة).
  ExamInterface.jsx                  شاشة حل الامتحان: المؤقت والتنقل والتسليم (مرة واحدة) وتسجيل النتيجة.
  LessonPage.jsx                     صفحة الدرس: الفيديو والملزمة وقائمة المحتوى (فيها روابط demo مؤقتة).

src/constants/
  statusLabels.js                    كل نصوص الحالات العربية (مقبول، نشط، منتهي...) في مكان واحد.

src/data/
  bookPurchaseRequests.jsx           طلبات شراء الكتب (الحالة قيد المراجعة/مقبول/مرفوض).
  bookPurchases.jsx                  سجل ملكية الكتب: مين اشترى إيه (منفصل عن الطلبات).
  books.jsx                          الكتب: العنوان والسعر والصورة وتوفر الشراء.
  chatMessages.jsx                   رسائل تجريبية للمحادثة.
  courses.jsx                        الكورسات التجريبية: العنوان والصف والصورة وخطط الاشتراك (شهري/ترم) وحقل النشر.
  enrollments.jsx                    اشتراكات الطلاب في الكورسات: الخطة وتاريخ البداية والنهاية والحالة.
  exams.jsx                          الامتحانات: الكورس والوحدة والمدة ووقت البداية والنهاية وحالة النشر.
  grades.jsx                         الصفوف الدراسية الستة (إعدادي وثانوي).
  lessonAccess.jsx                   صلاحيات الدروس الفردية الممنوحة لطلاب.
  lessons.jsx                        الوحدات ودروس كل وحدة (مصفوفة وحدات، وكل وحدة فيها مصفوفة دروس).
  masterProfile.jsx                  بيانات المستر (الاسم، رابط Telegram...). الـ Topbar بتقرا منها.
  paymentMethods.jsx                 وسائل الدفع (فودافون كاش: الرقم وواتساب الدعم).
  questions.jsx                      أسئلة الامتحانات (اختيار، صح/خطأ، مقالي) وإجاباتها الصحيحة.
  results.jsx                        نتائج الطلاب: الدرجة، الإجابات، درجات المقالي، وحالة التصحيح.
  storageUsage.jsx                   أرقام استهلاك المساحة التجريبية وحدود الخطط المجانية.
  students.jsx                       طلاب تجريبيون (الاسم، الصف، الهاتف، ولي الأمر...).
  subscriptionRequests.jsx           طلبات الاشتراك (رقم الطلب، رقم التحويل، الحالة).

src/hooks/
  useAsyncData.js                    hook للتحميل: loading أول مرة، error، وإلغاء عند الخروج. بتستخدمه صفحات المستر.

src/services/
  bookPurchaseService.jsx            طلبات شراء الكتب: إنشاء (مع منع غير المتاح/المملوك)، قبول (بيسجل الملكية)، رفض، حذف.
  bookPurchasesService.jsx           سجل ملكية الكتب (حذف الطلب ما بيلغيها).
  bookService.jsx                    الكتب: جلب وإنشاء وتعديل وحذف، وisBookAvailable.
  chatService.jsx                    رسائل المحادثة: جلب، إرسال، حذف الكل.
  courseService.jsx                  الكورسات: للطالب المنشور بس، وللمستر كل الكورسات + إنشاء/تعديل/حذف.
  enrollmentService.jsx              الاشتراكات: isEnrollmentActive (التعريف الوحيد للاشتراك النشط)، إنشاء، تمديد، إنهاء.
  examService.jsx                    الامتحانات: للطالب المنشور بس، وللمستر كل العمليات.
  gradeService.jsx                   getGrades: بترجع الصفوف.
  lessonAccessService.jsx            صلاحيات الدروس: منح، جلب، سحب.
  lessonService.jsx                  الوحدات والدروس: عرض للطالب + إنشاء/تعديل/حذف/ترتيب للمستر.
  masterBookRequestsService.jsx      منطق طلبات الكتب.
  masterBooksService.jsx             منطق الكتب والحذف المتسلسل.
  masterCoursesService.jsx           منطق صفحات الكورسات والمحتوى والحذف المتسلسل.
  masterDashboardService.jsx         بتجمع وتحسب ملخص الرئيسية.
  masterExamsService.jsx             منطق الامتحانات والأسئلة واستيراد/فحص JSON.
  masterLessonAccessService.jsx      منطق الصلاحيات مع منع التكرار.
  masterProfileService.jsx           بيانات المستر: قراءة وتحديث.
  masterResultsService.jsx           منطق النتائج والتصحيح (الدرجة النهائية = تلقائي + مقالي) والتصدير.
  masterSettingsService.jsx          منطق الإعدادات والتحقق من المدخلات.
  masterStorageService.jsx           أرقام المساحة (تجريبية) بنفس شكل الربط النهائي.
  masterStudentsService.jsx          منطق صفحتي الطلاب (قائمة وتفاصيل وحذف متسلسل).
  masterSubscriptionsService.jsx     منطق الاشتراكات والطلبات.
  paymentMethodService.jsx           وسائل الدفع: جلب النشطة وتعديل بيانات الحساب.
  questionService.jsx                الأسئلة: جلب، إضافة، تعديل، حذف، ترتيب.
  resultService.jsx                  النتائج: تسجيل تسليم الامتحان (مرة واحدة فقط)، جلب، حذف، تحديث.
  studentService.jsx                 getCurrentStudent (حاليًا أول طالب)، وجلب/تعديل/حذف الطلاب.
  subscriptionService.jsx            طلبات الاشتراك: إنشاء، قبول (بيفعّل الاشتراك)، رفض، حذف.

src/utils/
  downloadTextFile.js                تنزيل ملف نصي من المتصفح (تصدير CSV للنتائج).
  formatters.js                      تنسيق التاريخ والوقت والسعر والحجم (MB/GB) وتحويل التاريخ لقيمة input.
  gradeUtils.jsx                     دالة getGradeLabel: بتحوّل كود الصف (first-preparatory) لاسمه بالعربي.
  paginate.js                        paginate: تقسيم قائمة لصفحات، وmatchesSearch: بحث نصي. بيستخدمهم كل service قائمة.
  readImageFile.js                   قراءة صورة من الجهاز مؤقتًا. هتتبدل برفع Cloudinary وقت الربط.
```

الصور في `src/assets/` (Background, Books, Logo, Master). والملفات العامة في `public/`.

---

## 6. الـ Routes (من `App.jsx` الفعلي)

```text
/                                          -> Home
/signup                                    -> Signup
/login                                     -> Login
/courses/:courseId                         -> CourseDetails
/books                                     -> Books
/books/:bookId/purchase                    -> BookPurchase
/exam-result/:examId                       -> ExamResult
/dashboard-student/exams/:examId           -> ExamInterface
/courses/:courseId/lessons/:lessonId       -> LessonPage
/subscription/:courseId/:planId            -> Subscription
/dashboard-master                          -> MasterLayout
(index)                                    -> MasterHome
students                                   -> MasterStudents
students/:studentId                        -> MasterStudentDetails
courses                                    -> MasterCourses
courses/new                                -> MasterCourseForm
courses/:courseId                          -> MasterCourseContent
courses/:courseId/edit                     -> MasterCourseForm
exams                                      -> MasterExams
exams/new                                  -> MasterExamForm
exams/:examId                              -> MasterExamManage
exams/:examId/edit                         -> MasterExamForm
results                                    -> MasterResults
results/:resultId                          -> MasterResultDetails
subscriptions                              -> MasterSubscriptions
book-requests                              -> MasterBookRequests
books                                      -> MasterBooks
books/new                                  -> MasterBookForm
books/:bookId/edit                         -> MasterBookForm
lesson-access                              -> MasterLessonAccess
settings                                   -> MasterSettings
*                                          -> MasterPlaceholder
/dashboard-student                         -> DashboardLayout
(index)                                    -> DashboardHome
courses                                    -> DashboardCourses
books                                      -> DashboardBooks
exams                                      -> DashboardExams
results                                    -> DashboardResults
profile                                    -> DashboardProfile
support                                    -> DashboardSupport
```

- لوحة المستر كلها Nested داخل `/dashboard-master` (`MasterLayout`)، وآخر Route فيها `path="*"` بيعرض `MasterPlaceholder`.
- أي صفحة مستر جديدة تتسجل **فوق** سطر الـ placeholder.
- لا يوجد حماية Routes حاليًا (ده شغل الـ Backend).

---

## 7. طبقة البيانات (Mock Data + Services)

### ملفات الداتا (`src/data`)

- `bookPurchaseRequests.jsx`: طلبات شراء الكتب (الحالة قيد المراجعة/مقبول/مرفوض).
- `bookPurchases.jsx`: سجل ملكية الكتب: مين اشترى إيه (منفصل عن الطلبات).
- `books.jsx`: الكتب: العنوان والسعر والصورة وتوفر الشراء.
- `chatMessages.jsx`: رسائل تجريبية للمحادثة.
- `courses.jsx`: الكورسات التجريبية: العنوان والصف والصورة وخطط الاشتراك (شهري/ترم) وحقل النشر.
- `enrollments.jsx`: اشتراكات الطلاب في الكورسات: الخطة وتاريخ البداية والنهاية والحالة.
- `exams.jsx`: الامتحانات: الكورس والوحدة والمدة ووقت البداية والنهاية وحالة النشر.
- `grades.jsx`: الصفوف الدراسية الستة (إعدادي وثانوي).
- `lessonAccess.jsx`: صلاحيات الدروس الفردية الممنوحة لطلاب.
- `lessons.jsx`: الوحدات ودروس كل وحدة (مصفوفة وحدات، وكل وحدة فيها مصفوفة دروس).
- `masterProfile.jsx`: بيانات المستر (الاسم، رابط Telegram...). الـ Topbar بتقرا منها.
- `paymentMethods.jsx`: وسائل الدفع (فودافون كاش: الرقم وواتساب الدعم).
- `questions.jsx`: أسئلة الامتحانات (اختيار، صح/خطأ، مقالي) وإجاباتها الصحيحة.
- `results.jsx`: نتائج الطلاب: الدرجة، الإجابات، درجات المقالي، وحالة التصحيح.
- `storageUsage.jsx`: أرقام استهلاك المساحة التجريبية وحدود الخطط المجانية.
- `students.jsx`: طلاب تجريبيون (الاسم، الصف، الهاتف، ولي الأمر...).
- `subscriptionRequests.jsx`: طلبات الاشتراك (رقم الطلب، رقم التحويل، الحالة).

### أنواع الأسئلة الفعلية (لا تخترع أنواع جديدة)

```js
// اختيار من متعدد
{ type: "multiple-choice", question, options: [..4 خيارات..], correctAnswer: 1 /* index */, score, order }
// صح/خطأ
{ type: "true-false", question, correctAnswer: true /* boolean */, score, order }
// مقالي (بدون correctAnswer، يحتاج تصحيح يدوي)
{ type: "essay", question, score, order }
```


### شكل النتيجة (`results.jsx`)

```text
{ id, studentId, examId,
  autoScore, autoTotal,      // درجة الأسئلة التلقائية
  score, total,              // الدرجة المعروضة (تتحدث بعد تصحيح المقالي: تلقائي + مقالي)
  essayCount, essayTotal, essayScores: { [questionId]: number },
  correctAnswers, incorrectAnswers, answers,
  status: "graded" | "needs_review", submittedAt }
```

الامتحان مرة واحدة فقط: `submitExamAttempt` بترفض التسليم الثاني.

### الـ Services (الدوال المصدّرة فعليًا)

- **bookPurchaseService.jsx**: `getPendingBookPurchaseRequest`، `getBookPurchaseRequestsByStudentId`، `createBookPurchaseRequest`، `getBookPurchaseRequests`، `getBookPurchaseRequestById`، `approveBookPurchaseRequest`، `rejectBookPurchaseRequest`، `deleteBookPurchaseRequestsByStudentId`، `deleteBookPurchaseRequest`، `deleteAllBookPurchaseRequests`، `deleteBookPurchaseRequestsByBookId`
- **bookPurchasesService.jsx**: `getBookPurchases`، `getPurchasedBookIdsByStudentId`، `hasBookPurchase`، `createBookPurchase`، `deleteBookPurchasesByStudentId`، `deleteBookPurchasesByBookId`
- **bookService.jsx**: `isBookAvailable`، `getBooks`، `getBookById`، `getBooksByStudentGrade`، `createBook`، `updateBook`، `deleteBook`، `deleteAllBooks`
- **chatService.jsx**: `getMessages`، `sendMessage`، `deleteAllMessages`
- **courseService.jsx**: `getCourses`، `getCourseById`، `getAllCourses`، `getAnyCourseById`، `createCourse`، `updateCourse`، `deleteCourse`، `deleteAllCourses`
- **enrollmentService.jsx**: `getEnrollments`، `getEnrollmentsByStudentId`، `isEnrollmentActive`، `isStudentEnrolled`، `createEnrollment`، `deleteEnrollmentsByStudentId`، `getEnrollmentState`، `getEnrollmentById`، `updateEnrollment`، `deleteEnrollmentsByCourseId`
- **examService.jsx**: `getExamsByCourseId`، `getExamById`، `getExams`، `getAnyExamById`، `createExam`، `updateExam`، `deleteExam`، `deleteExamsByCourseId`، `deleteAllExams`، `detachExamsFromUnit`
- **gradeService.jsx**: `getGrades`
- **lessonAccessService.jsx**: `getLessonAccessByStudentId`، `getLessonAccessByStudentAndCourseId`، `hasLessonAccess`، `grantLessonAccess`، `deleteLessonAccessByStudentId`، `getAllLessonAccess`، `getLessonAccessById`، `revokeLessonAccess`، `deleteLessonAccessByCourseId`، `deleteLessonAccessByLessonIds`
- **lessonService.jsx**: `getUnitsByCourseId`، `getAllUnitsByCourseId`، `getAllUnits`، `getUnitById`، `createUnit`، `updateUnit`، `deleteUnit`، `deleteUnitsByCourseId`، `moveUnit`، `createLesson`، `updateLesson`، `deleteLesson`، `moveLesson`، `getAllLessons`
- **masterBookRequestsService.jsx**: `getMasterBookRequestsSummary`، `getMasterBookRequestsPage`، `getMasterBookRequestDetails`، `approveMasterBookRequest`، `rejectMasterBookRequest`، `deleteMasterBookRequest`، `deleteAllMasterBookRequests`
- **masterBooksService.jsx**: `getMasterBooksSummary`، `getMasterBooksPage`، `getMasterBookPreview`، `getMasterBookForm`، `saveMasterBook`، `setMasterBookAvailability`، `getMasterBookDeleteSummary`، `getMasterBooksDeleteAllSummary`، `deleteMasterBook`، `deleteAllMasterBooks`
- **masterCoursesService.jsx**: `getMasterCoursesPage`، `getMasterCourseForm`، `saveMasterCourse`، `setMasterCoursePublished`، `getMasterCourseContent`، `saveMasterUnit`، `moveMasterUnit`، `getMasterUnitDeleteSummary`، `deleteMasterUnit`، `saveMasterLesson`، `moveMasterLesson`، `deleteMasterLesson`، `getMasterCourseDeleteSummary`، `getMasterCoursesDeleteAllSummary`، `deleteMasterCourse`، `deleteAllMasterCourses`
- **masterDashboardService.jsx**: `getMasterDashboardSummary`
- **masterExamsService.jsx**: `getExamTimeStatus`، `getMasterExamsSummary`، `getMasterExamsPage`، `getMasterExamForm`، `saveMasterExam`، `setMasterExamPublished`، `getMasterExamDetails`، `getMasterExamQuestionsPage`، `getEmptyQuestionForm`، `getMasterQuestionForm`، `saveMasterQuestion`، `moveMasterQuestion`، `deleteMasterQuestion`، `deleteAllMasterExamQuestions`، `previewMasterQuestionsImport`، `importMasterQuestions`، `getMasterExamDeleteSummary`، `getMasterExamsDeleteAllSummary`، `deleteMasterExam`، `deleteAllMasterExams`
- **masterLessonAccessService.jsx**: `getMasterLessonAccessSummary`، `getMasterLessonAccessPage`، `getMasterLessonAccessOptions`، `grantMasterLessonAccess`، `revokeMasterLessonAccess`
- **masterProfileService.jsx**: `getMasterProfile`، `updateMasterProfile`
- **masterResultsService.jsx**: `getMasterResultsSummary`، `getMasterResultsPage`، `exportMasterResultsCsv`، `getMasterResultDetails`، `saveMasterResultGrades`، `deleteMasterResult`، `deleteAllMasterResults`
- **masterSettingsService.jsx**: `getMasterSettings`، `saveMasterProfile`، `changeMasterPassword`، `saveMasterPaymentMethod`، `getMasterChatSummary`، `deleteAllMasterChatMessages`
- **masterStorageService.jsx**: `getMasterStorageUsage`
- **masterStudentsService.jsx**: `getMasterStudentGradeOptions`، `getMasterStudentsSummary`، `getMasterStudentsPage`، `getMasterStudentDetails`، `updateMasterStudent`، `deleteMasterStudent`، `deleteAllMasterStudents`
- **masterSubscriptionsService.jsx**: `getMasterSubscriptionsSummary`، `getMasterEnrollmentsPage`، `extendMasterEnrollment`، `endMasterEnrollment`، `getMasterSubscriptionRequestsPage`، `getMasterSubscriptionRequestDetails`، `approveMasterSubscriptionRequest`، `rejectMasterSubscriptionRequest`، `deleteMasterSubscriptionRequest`، `deleteAllMasterSubscriptionRequests`
- **paymentMethodService.jsx**: `getActivePaymentMethods`، `getPaymentMethodById`، `getAllPaymentMethods`، `updatePaymentMethod`
- **questionService.jsx**: `getQuestionsByExamId`، `getAllQuestions`، `getQuestionById`، `createQuestion`، `createQuestions`، `updateQuestion`، `deleteQuestion`، `moveQuestion`، `deleteQuestionsByExamId`
- **resultService.jsx**: `getResults`، `getResultsByStudentId`، `getResultByExamId`، `getResultById`، `hasSubmittedExam`، `submitExamAttempt`، `updateResult`، `deleteResult`، `deleteAllResults`، `deleteResultsByExamIds`، `deleteResultsByStudentId`
- **studentService.jsx**: `getCurrentStudent`، `getStudents`، `getStudentById`، `updateStudent`، `deleteStudent`، `deleteAllStudents`
- **subscriptionService.jsx**: `getSubscriptionRequestsByStudentId`، `getPendingSubscriptionRequest`، `createSubscriptionRequest`، `getSubscriptionRequests`، `getSubscriptionRequestById`، `approveSubscriptionRequest`، `rejectSubscriptionRequest`، `deleteSubscriptionRequestsByStudentId`، `deleteSubscriptionRequest`، `deleteAllSubscriptionRequests`، `deleteSubscriptionRequestsByCourseId`

---

## 8. نظام الصفوف الدراسية

مصدره الوحيد `src/data/grades.jsx`:

```js
const grades = [
  { id: "first-preparatory",  label: "أولى إعدادي",  stage: "المرحلة الإعدادية" },
  { id: "second-preparatory", label: "ثانية إعدادي", stage: "المرحلة الإعدادية" },
  { id: "third-preparatory",  label: "ثالثة إعدادي", stage: "المرحلة الإعدادية" },
  { id: "first-secondary",    label: "أولى ثانوي",   stage: "المرحلة الثانوية" },
  { id: "second-secondary",   label: "ثانية ثانوي",  stage: "المرحلة الثانوية" },
  { id: "third-secondary",    label: "ثالثة ثانوي",  stage: "المرحلة الثانوية" },
];
export default grades;
```

- الـ **logic يعتمد على الـ IDs** دائمًا، والـ **Label للعرض فقط**. ممنوع استخدام الأسماء العربية في أي منطق.
- `stage` موجود كـ Metadata في تعريف الصفوف فقط، **ولا يُخزَّن** داخل الطالب أو الكتاب أو الكورس.
- العرض: `getGradeLabel(gradeId)` من `src/utils/gradeUtils.jsx`.
- Signup بيعرض الصفوف ديناميكيًا من `grades` ويخزن الـ Grade ID.

**ربط الكورسات بالصفوف:**

| الكورس | الصف |
|---|---|
| `social-studies-preparatory` | `second-preparatory` |
| `history-secondary` | `third-secondary` |
| `history-different-way` | `second-secondary` |

---

---

## 9. قواعد نظام الطالب (موجودة وبتأثر على Master)

### الاشتراك في الكورس

`غير مشترك` ← «اشترك في الكورس» | `قيد المراجعة` ← «الاشتراك قيد المراجعة» | `مقبول` ← «متابعة الكورس»

### شراء الكتاب

`لا يوجد طلب` ← «شراء الكتاب» | `قيد المراجعة` ← «الطلب قيد المراجعة» | `مقبول` ← «تم شراء الكتاب» | `مرفوض` ← «إعادة طلب الشراء» | `غير متاح` ← «غير متاح للشراء حاليًا».
**الرفض رجع** (بدون سبب)، انظر القسم 12.

### الدفع

- المستر واحد. طريقة الدفع الحالية **Vodafone Cash** فقط. **لا Payment Gateway.**
- الطالب يحوّل، ثم يدخل **رقم العملية (`transactionId`)** ويرسل الطلب. المستر يراجع **ويقبل أو يرفض** (الرفض بدون سبب، والطالب يقدر يقدّم طلب جديد).
- **لا رفع صورة إثبات دفع** (اتشالت). المراجعة بتعتمد على: طريقة الدفع + رقم التحويل + المبلغ + تاريخ الطلب.
- طرق الدفع بتتعدّل من **Settings** (مش صفحة مستقلة في الـ Sidebar).

### صلاحيات الدروس (Lesson Access)

- الفكرة الأصلية «اشتراك بالحصة» اترفضت (معقدة). البديل: **صلاحية خاصة لدرس** يمنحها المستر.
- الطالب يفتح الدرس لو: عنده اشتراك نشط في الكورس، **أو** عنده صلاحية خاصة للدرس.
- **مش شرط** يكون مشترك في الكورس لكي ياخد صلاحية درس.
- الصلاحية = `طالب + كورس + درس`. المستر يقدر يمنح درسًا واحدًا أو عدة دروس في العملية الواحدة.
- بدون مدة، بدون سعر، بدون Payment لكل درس، **ممنوع Duplicate**.
- **سحب الصلاحية:** لو الطالب غير مشترك ← يفقد الوصول. لو مشترك ← يفضل يفتح الدرس لأن اشتراكه بيسمح.

### معرّفات الكتب والطلبات

| الشيء | المعرّف | مثال |
|---|---|---|
| الكتاب | ID من السيرفر | `BOOK-1025` |
| طلب شراء الكتاب | Request Number من السيرفر | `BK-2051` |
| التحويل | `transactionId` اللي كتبه الطالب | — |

مفيش Reference داخلي ثالث. (في الـ Mock حاليًا الكتب `book-1…6`، وطلبات الكتب بادئتها `BK-` وطلبات الاشتراك `MK-`.)

### الكتب

- **لا سنة دراسية (`academicYear`) للكتب.** لو كتاب قديم انتهى، المستر يخليه «غير متاح للشراء» ويضيف كتابًا جديدًا.
- حالة الكتاب: **متاح للشراء / غير متاح للشراء** (`availability`). لو غير متاح، الطالب **لا يقدر يعمل طلب جديد**، لكن اللي اشتراه قبل كده **يفضل عنده**. الملكية في `bookPurchases.jsx` (منفصلة عن الطلبات)، فحذف الطلب المقبول ما بيلغيش الشراء.
- الكتاب: `ID، اسم، وصف، grade، price، cover، availability`. لا مخزون، لا شحن، لا كوبونات، لا سلة.

---

### الامتحانات

- الامتحان **مرة واحدة فقط** لكل طالب (`hasSubmittedExam` + رفض التسليم الثاني). لو الطالب فتح امتحان سلّمه يتحول لصفحة النتيجة.
- الكورس والامتحان لهم حالة نشر: غير المنشور **مخفي عن الطالب** (`getCourses` / `getExamsByCourseId` بترجّع المنشور فقط، وللمستر `getAllCourses` / `getExams`).


---

## 10. Master Dashboard: القرارات العامة

### حالة التنفيذ

```text
1. تصور كل صفحات Master        ← انتهى
2. وظيفة كل صفحة بالتفصيل      ← انتهى
3. Layout + Sidebar + Topbar + Shared Components  ← اتبنوا
4. الصفحات العشر على Mock Data  ← اتبنوا
5. الربط بـ Backend            ← الخطوة الجاية (القسم 16)
```

### الـ Layout

- Sidebar ثابت على Desktop، وHamburger على الشاشات الصغيرة.
- Topbar بسيط. **لا يوجد Footer** في Master.
- Layout مستقل عن `DashboardLayout` الخاص بالطالب (الطالب فيه Navbar + Footer + Chat، وMaster لا).
- Hero تاريخي **في Home فقط**. صفحات الجداول الثقيلة بدون Hero.
- زر **Telegram** في الـ Topbar/Home.
- مفيش Charts/Analytics إلا لو لها قيمة تشغيلية واضحة.

### Sidebar Master النهائي (بالترتيب)

```text
الرئيسية
الطلاب
الكورسات والمحتوى
الامتحانات والأسئلة
النتائج
الاشتراكات وطلبات الاشتراك
طلبات شراء الكتب
الكتب والمذكرات
صلاحيات الدروس
الإعدادات
----------------
تسجيل الخروج
```

لا يوجد Teacher Chat. الطالب يكلم المستر من Chat الموقع، والمستر يتابع من **Telegram**.

### Shared Components (بدون مبالغة في الـ abstraction)

Page Header، Search، Filters، Stat Cards، Tables، Cards، Pagination، Empty States، Buttons، Status Badges، **ConfirmModal**. نشارك فقط اللي يستاهل.

### ConfirmModal

Component **واحد** مشترك لكل عمليات الحذف/التأكيد. بياخد: عنوان، رسالة، نوع العملية، أزرار تأكيد/إلغاء. الرسالة تختلف حسب المحذوف.

### قاعدة الحذف

كل صفحة مهمة تدعم حسب الحاجة **حذف عنصر واحد** و**حذف الكل**، مع Confirmation قوي والرسالة توضّح **ماذا سيُحذف وماذا لن يُحذف**.

---

---

## 11. صفحات Master بالتفصيل

### 11.1 الرئيسية (Home)

```text
Hero تاريخي: «مرحبًا بك يا مستر — لوحة التحكم الرئيسية لمنصة الغازي في التاريخ»
   [ تواصل مع الطلاب على Telegram ]

4 Stat Cards: عدد الطلاب | عدد الكورسات | الاشتراكات النشطة | تحتاج مراجعة

الأشياء التي تحتاج إجراء:
   طلبات الاشتراك الجديدة → مراجعة
   طلبات شراء الكتب     → مراجعة
   امتحانات تحتاج تصحيحًا → بدء التصحيح

آخر 3 نتائج
اختصارات سريعة: إضافة كورس | إضافة امتحان | إضافة كتاب | عرض الطلاب
آخر النشاطات: آخر 5 فقط
```

لا يوجد: Charts، Analytics، جداول كاملة، قوائم طلاب كاملة، Chat Center، أزرار حذف، Footer.

### 11.2 الطلاب

- العنوان: «الطلاب — إدارة الطلاب وبياناتهم واشتراكاتهم».
- 3 Info Cards: إجمالي الطلاب | الطلاب المشتركين | طلبات جديدة.
- بحث: الاسم / البريد / الهاتف. فلاتر: الصف الدراسي، حالة الاشتراك.
- جدول: الطالب، الصف، رقم الهاتف، الكورسات، حالة الاشتراك، إجراءات (عرض التفاصيل، حذف).
- Pagination: 20 طالب في الصفحة.
- **صفحة تفاصيل الطالب (كاملة):** الاسم، email، phone، parent phone، grade، governorate، الكورسات، حالات الاشتراك، النتائج، الطلبات، صلاحيات الدروس، تعديل الطالب، رجوع.
- الحذف: طالب محدد + حذف كل الطلاب، مع تحذير للبيانات المرتبطة.

### 11.3 الكورسات والمحتوى

- العنوان: «الكورسات والمحتوى — إدارة الكورسات والدروس والمواد التعليمية». زر «+ إضافة كورس».
- بحث «ابحث عن كورس…». فلاتر: الصف الدراسي، حالة الكورس (**منشور / غير منشور**).
- Card الكورس: صورة، الاسم، الصف، عدد الدروس، عدد الامتحانات، عدد الطلاب المشتركين، الحالة، أزرار (إدارة المحتوى، تعديل، حذف).
- **داخل إدارة الكورس:** تعديل بيانات الكورس، إضافة امتحان (ينقل لصفحة الامتحانات مع الكورس محدد)، العودة، Units وLessons (إضافة/تعديل/حذف)، ترتيب Units وLessons بـ ↑↓، مواد الدروس، حذف محدد وحذف الكل.
- لا يوجد: Drag & Drop، Analytics، Video watch tracking، student performance، Comments.
- عند التنفيذ اقرأ الحالي من `courses.jsx` و`lessons.jsx`.

### 11.4 الامتحانات والأسئلة

- العنوان: «الامتحانات والأسئلة — إدارة الامتحانات والأسئلة ومواعيدها ودرجاتها». زر «+ إضافة امتحان».
- Stats: إجمالي الامتحانات، المنشورة، المنتهية، تحتاج تصحيحًا.
- بحث باسم الامتحان. فلاتر: الكورس، الصف، حالة النشر (**منشور / غير منشور**).
- **«قادم» ليس حالة يختارها المستر.** حالة الوقت **تُحسب تلقائيًا** من `startsAt` و`endsAt`: `لم يبدأ / متاح الآن / منتهي`.
- Card الامتحان: الاسم، الكورس، الصف، عدد الأسئلة، الدرجة النهائية، المدة، البداية، النهاية، الحالة، (إدارة الامتحان، تعديل، حذف). Pagination + حذف الكل.
- **داخل إدارة الامتحان:** بيانات الامتحان، الأسئلة (جدول: #، نص السؤال، النوع، الدرجة، إجراءات ↑ ↓ تعديل حذف)، «إضافة سؤال»، «استيراد JSON»، **10 أسئلة لكل صفحة** مع Pagination (عشان مفيش Scroll طويل لـ 50 سؤال).
- **إضافة سؤال:** يدويًا أو استيراد JSON. يدعم الأنواع الحالية فقط: `multiple-choice / true-false / essay`.
- **استيراد JSON:** رفع ملف أو لصق JSON ← Preview ← Validation ← Import. الأسئلة الخاطئة **لا تُستورد**، ويظهر خطأ واضح (مثال: «يوجد خطأ في السؤال رقم 8: الإجابة الصحيحة غير محددة»).
- لا يوجد: Copy Exam، Charts، Exam Analytics، Chat، Complex Exam Settings.

### 11.5 النتائج

- العنوان: «النتائج — متابعة نتائج الطلاب وتصحيحها». زر «تصدير النتائج».
- Stats: إجمالي النتائج، تحتاج تصحيحًا، مكتملة التصحيح، نتائج اليوم.
- بحث باسم الطالب أو الامتحان. فلاتر: الطالب، الكورس، الامتحان، الصف، حالة التصحيح (**تحتاج تصحيحًا / مكتملة التصحيح**).
- جدول: #، الطالب، الامتحان، الكورس، الدرجة، التاريخ، حالة التصحيح، إجراء (عرض النتيجة / بدء التصحيح).
- **تفاصيل النتيجة:** بيانات الطالب، الصف، الامتحان، الكورس، التاريخ، الدرجة، النسبة، حالة التصحيح، إجابات الطالب بجانب الإجابة الصحيحة، Pagination للأسئلة، **Manual Grading** للمقالي، «حفظ الدرجة» مع **تحديث تلقائي للدرجة الكلية والنسبة**.
- الحذف: نتيجة واحدة أو الكل. **لا يُحذف** الطالب ولا الامتحان ولا الأسئلة.
- لا يوجد: Charts، Ranking، Best/Worst student، Advanced analytics، Student comparison، Chat.

### 11.6 الاشتراكات وطلبات الاشتراك

- صفحة واحدة بـ **تبويبين:** «الاشتراكات» و«طلبات الاشتراك».
- Stats (3 كروت): الاشتراكات النشطة، المنتهية، تحتاج مراجعة.
- بحث: اسم الطالب، رقم الطلب، رقم العملية. فلاتر: الصف، الكورس، حالة الطلب.
- حالات الطلب: **قيد المراجعة / مقبول / مرفوض**. الرفض بدون سبب، والطالب يقدر يقدّم طلبًا جديدًا.
- **طلبات الاشتراك:** رقم الطلب، الطالب، الكورس، المبلغ، التاريخ، رقم العملية، الحالة. تفاصيل الطلب: بيانات الطالب، بيانات الاشتراك (الكورس، الخطة، المبلغ، تاريخ الطلب، رقم العملية، طريقة الدفع)، وزرّا **«قبول الطلب»** و**«رفض الطلب»**.
- **عند القبول → يتفعّل الاشتراك تلقائيًا.** لا توجد خطوة ثانية يدوية.
- **الاشتراكات:** الطالب، الكورس، الخطة، البداية، النهاية، الحالة. الإجراءات: عرض، **تمديد الاشتراك**، **إنهاء الاشتراك**.
- التمديد: أداة للمستر للتمديد المباشر/الاستثنائي (مثال: 30 يوم). أما الدفع لشهر جديد فيتم بـ **طلب اشتراك جديد**.
- **لا يوجد:** تعديل حر للاشتراك، ولا حذف اشتراك كإجراء عادي (الاشتراك يُنهى ولا يُحذف).
- حذف: طلب واحد / كل الطلبات.

### 11.7 طلبات شراء الكتب

- العنوان: «طلبات شراء الكتب — مراجعة طلبات شراء الكتب الخاصة بالطلاب».
- Stats: إجمالي الطلبات، تحتاج مراجعة، الطلبات المقبولة.
- **البحث (3 عناصر فقط):** اسم الطالب، رقم الطلب، رقم التحويل. فلاتر: الصف، الكتاب، حالة الطلب (**قيد المراجعة / مقبول / مرفوض**).
- جدول: رقم الطلب، الطالب، الكتاب، رقم التحويل، المبلغ، تاريخ الطلب، إجراء.
- تفاصيل الطلب: بيانات الطالب، بيانات الكتاب، بيانات الدفع (طريقة الدفع، رقم التحويل، المبلغ، التاريخ)، الحالة، زرّا **«قبول الطلب»** و**«رفض الطلب»**.
- **عند القبول → الكتاب يتسجل كمشترى للطالب** (جدول ملكية منفصل `bookPurchases`).
- حذف: طلب واحد / الكل. **حذف الطلب المقبول لا يلغي حق الطالب في الكتاب.**
- لا يوجد: سبب رفض، إثبات دفع كصورة.

### 11.8 الكتب والمذكرات

- العنوان: «الكتب والمذكرات — إدارة الكتب والمذكرات المتاحة للطلاب».
- الأزرار: «+ إضافة كتاب» و«طلبات شراء الكتب».
- Stats: إجمالي الكتب، متاحة للشراء، غير متاحة للشراء.
- بحث: اسم الكتاب أو رقمه. فلاتر: الصف، حالة الكتاب.
- Card: صورة الغلاف، الاسم، الرقم، الصف، السعر، **عدد المشترين**، الحالة، (إدارة الكتاب، عرض الكتاب، تعديل، حذف).
- عرض طلبات شراء الكتاب ده، وعدد المشترين.
- **Preview** للكتاب كما يظهر للطالب: مجرد Modal، مش صفحة جديدة.

### 11.9 صلاحيات الدروس

- العنوان: «صلاحيات الدروس — إدارة صلاحيات الطلاب للوصول إلى دروس محددة».
- Stats: إجمالي الصلاحيات، الطلاب أصحاب صلاحيات خاصة.
- بحث: اسم الطالب، اسم الدرس. فلاتر: الكورس، الصف.
- جدول: الطالب، الكورس، الدرس، تاريخ المنح، الإجراءات (عرض، سحب).
- **إضافة صلاحية:** اختر الطالب ← الكورس ← درسًا أو عدة دروس. النظام يمنع Duplicate.
- تُبنى فوق `lessonAccess.jsx` و`lessonAccessService.jsx` الموجودين، بدون اختراع نظام جديد.

### 11.10 الإعدادات

- العنوان: «الإعدادات — إدارة الحساب والدفع والبيانات».
- **حساب المستر:** الاسم، البريد، الهاتف، [تعديل البيانات]، [تغيير كلمة المرور]. (اتحذف: آخر تسجيل دخول.)
- **بيانات Vodafone Cash فقط:** رقم التحويل، رقم الدعم، [تعديل بيانات الدفع]. مفيش «إضافة طريقة دفع».
- **Telegram:** قسم بسيط «وسيلة التواصل مع الطلاب» + [فتح Telegram]. مش Chat Center.
- **Data Management:** «حذف جميع المحادثات» مع Warning قوي. **يُحذف:** المحادثات، الرسائل، المرفقات. **لا يُحذف:** الطلاب، الكورسات، الامتحانات، النتائج، الاشتراكات، الكتب.
- اتحذف نهائيًا: Dark/Light switch، Multi-language، Teacher management، Roles system، Analytics، Payment gateway معقد، Complex school settings.

---

### 11.11 الصفحات والمسارات المنفذة فعليًا

| الصفحة | المسارات |
|---|---|
| الكورسات | `/courses` (كروت) · `/courses/new` · `/courses/:id` (إدارة الوحدات والدروس) · `/courses/:id/edit` |
| الامتحانات | `/exams` · `/exams/new` · `/exams/:id` (الأسئلة + استيراد JSON) · `/exams/:id/edit` |
| النتائج | `/results` (يقبل `?examId=` و`?status=needs_review`) · `/results/:id` (التصحيح) |
| الاشتراكات | `/subscriptions` (تبويبان) |
| طلبات الكتب | `/book-requests` |
| الكتب | `/books` · `/books/new` · `/books/:id/edit` |
| صلاحيات الدروس | `/lesson-access` |
| الإعدادات | `/settings` |

(كلها تحت `/dashboard-master`.)

**ملاحظات تنفيذ:**

- **بند «التصحيح المطلوب» (القديم «3 محاولات»):** اتحسم: معناه **عدد الطلاب اللي سلّموا الامتحان ومحتاجين تصحيح من المستر**، بيظهر على كارت الامتحان ويفتح النتائج مفلترة. والامتحان مرة واحدة فقط.
- **تصحيح المقالي:** الدرجة النهائية = الأسئلة التلقائية + المقالي، ودرجة كل سؤال مقالي محفوظة منفصلة (`essayScores`).
- **حذف كورس:** يعرض ملخصًا بالأعداد (وحدات، دروس، امتحانات، أسئلة، نتائج، اشتراكات منها نشط، طلبات، صلاحيات) ويحذف المرتبط به. **الطلاب ما بيتحذفوش.**
- **الإعدادات:** عداد المساحة (Supabase / Cloudinary / Drive) أرقام **تجريبية** حاليًا وعليها بادج «بيانات تجريبية». وتغيير كلمة المرور تجريبي (تحقق من المدخلات فقط).
- **الصور في Mock:** رفع الصورة بيتحول لـ data URL مؤقت.

---

## 12. قرارات نهائية وأفكار مُلغاة (لا تقترحها مرة ثانية)

| الفكرة | القرار |
|---|---|
| Analytics / Charts / Ranking / Success Rate / Revenue / Course analytics | **ملغي.** المستر يريد Dashboard تشغيلية مش BI |
| Teacher Chat / Message Center / Chat Inbox في لوحة المستر | **ملغي.** التواصل عبر Telegram |
| Multi-Teacher / Roles / Permission matrix | **ملغي.** Master واحد فقط (الدور admin/student في الـ Backend بس) |
| **رفض طلب الاشتراك أو طلب الكتاب** | **رجع (قرار 3 أكتوبر 2026):** حالات الطلب: قيد المراجعة / مقبول / مرفوض. **بدون سبب رفض.** والطالب يقدر يقدّم طلب جديد بعد الرفض |
| سبب الرفض | **ملغي** (رفض وخلاص) |
| Academic Year للكتب | **ملغي** |
| صورة إثبات الدفع | **ملغي** (رقم التحويل + المبلغ يكفي) |
| Reference إضافي ثالث | **ملغي** |
| Copy Exam | **ملغي** |
| حالة امتحان «قادم» يدوية | **ملغي** (تُحسب تلقائيًا من التواريخ) |
| Drag & Drop للـ Units / Lessons / Questions | **ملغي**، البديل أزرار ↑ ↓ |
| تعديل حر للاشتراك | **ملغي**، البديل: إنهاء + تمديد |
| E-commerce كامل (Cart, Inventory, Shipping, Coupons…) | **ملغي** |
| اشتراك بالحصة (Per-Lesson Subscription) | **ملغي**، البديل: صلاحية درس خاصة |
| مدة على صلاحية الدرس | **ملغي** (تستمر حتى السحب) |
| Payment Gateway / إضافة طرق دفع من الـ Dashboard | **ملغي** |
| **نظام Activation Codes للدفع** | **ملغي.** اتبدل بنظام الطلبات (Vodafone Cash + رقم عملية + قبول/رفض المستر) |
| Dark/Light switch / Multi-language | **ملغي** |
| إعادة الامتحان | **ممنوع.** مرة واحدة فقط لكل طالب |
| الشات في Supabase | **ملغي.** الشات هيتربط بـ Firebase لاحقًا. ما يتنفذش له جداول أو سياسات في Supabase |
| تخزين الصور في Supabase | **ملغي.** الصور على Cloudinary (+ ضغط في المتصفح)، والملازم على Google Drive، والفيديو YouTube Unlisted |

---

## 13. التنظيف والتغييرات اللي اتعملت (وإيه اللي لسه)

**اتعمل:**

- `rejected`: رجع كحالة رسمية (بدون سبب). واجهة الطالب فيها «إعادة طلب الشراء» وده **مقصود**.
- بادئة طلبات الكتب `BK-` بدل `MK-`.
- `availability` للكتب اتطبقت في واجهة الطالب وفي لوحة المستر.
- حقول الـ Mock الناقصة اتضافت: `published` للكورس والامتحان، `availability` للكتاب، `planId/startsAt/endsAt/sourceRequestId` للاشتراك، `answers/essayScores/status/autoScore` للنتيجة، `videoUrl/materialUrl` للدرس.
- ملكية الكتب في `bookPurchases` منفصلة عن الطلبات.
- روابط الفيديو والملزمة التجريبية انتقلت من `LessonPage` لبيانات الدرس.

**لسه (يتعمل وقت الربط بالـ Backend):**

1. شيل فرع `accessType: "lesson"` من `subscriptionService.jsx` (اشتراك الحصة ملغي).
2. `Login` و`Signup` لسه مش بيعملوا دخول/إنشاء حساب فعلي (ينتظروا `authService`).
3. تصحيح الامتحان لسه في المتصفح (`ExamInterface`)، والإجابات الصحيحة بتوصل للطالب: يتحول لـ RPC (القسم 16).
4. `ExamInterface`/`ExamResult` بيستخدموا `sessionStorage` لحفظ المحاولة: يتشال.
5. حماية `/dashboard-master` وكل المسارات.
6. `src/App.css` ملف فاضي ومش مستخدم (ممكن يتمسح).
7. أخطاء الـ lint القديمة في 6 ملفات (قبل مشروع المستر).

---

## 14. طريقة العمل مع المستخدم (مهم)

- **اللغة:** عربي بأسلوب مصري بسيط ومباشر. الشرح عملي بدون مصطلحات معقدة. الكود والـ comments بالإنجليزية أو زي ما المشروع ماشي.
- **Feature by Feature / Page by Page.** لا تقفز بين الملفات ولا تضيف حاجات من غير حاجة.
- **اتفق على شكل ووظيفة الصفحة أولًا، وبعدها اكتب الكود.**
- **اقرأ الملفات الحالية قبل أي كود مرتبط بـ data.** ممنوع الاعتماد على نسخة قديمة من الذاكرة أو على أمثلة مكتوبة في هذا الـ README.
- ما تفترضش شكل الـ data. لو محتاج حقل جديد قول ده للمستخدم.
- لو محتاج توضيح، **اسأل** بدل ما تفترض.
- ما تبدأش كتابة أي كود قبل ما تلخص فهمك وتاخد تأكيد.
- عند تسليم كود: اذكر اسم الملف ومساره بالضبط، وإن كان ملف جديد أو تعديل، واكتب الملف **كامل** جاهز للاستبدال.
- لا تقل «اتحقق» إلا لو `npm run build` و`npm run lint` اتشغّلوا فعلًا.
- **ممنوع** أي مفتاح سري في الكود أو في الشات.

---

## 15. الخطوة الجاية

```text
الواجهة (Frontend) كاملة على Mock Data  ←  مكتملة
الربط بـ Supabase + Cloudinary           ←  الخطوة الجاية: نفّذ القسم 16 مرحلة مرحلة
```

التنفيذ بيتم بالبرومت `BACKEND_BUILD_PROMPT.md` على مشروع Supabase **تجريبي (dev)**، ومرحلة مرحلة مع موافقة المستخدم بعد كل واحدة.

---

## 16. خطة الـ Backend (Supabase + Cloudinary) — التصميم المعتمد

> منقولة حرفيًا من `BACKEND_PLAN.md`. هي المرجع لتصميم الـ Backend.

مبنية على قراءة الكود الفعلي (الـ services والداتا وصفحات الطالب والمستر)، ومقارنتها بصورة «قواعد الأمان». الكود هو المرجع لما يختلف عن الصورة.

### 16.1 تعارض الصورة مع الكود (والقرار)

| في الصورة | في الكود | القرار |
|---|---|---|
| جدول Activation Codes للدفع (`is_used`) | نظام **طلبات**: الطالب يحوّل فودافون كاش ويكتب رقم العملية، والمستر يقبل أو يرفض | **الكود هو الصحيح.** مفيش جدول Activation Codes. بدله جدولا طلبات (اشتراك + كتب) |
| Cloudinary للصور | حقل `image` نص رابط | **موافق.** + ضغط الصورة في المتصفح قبل الرفع |
| Google Drive للملازم | حقل `materialUrl` | **موافق** |
| YouTube Unlisted محمي | حقل `videoUrl` | **موافق** مع حماية من السيرفر (قسم 8) |
| تحقق الاشتراك في الـ State فقط | — | **مش كفاية.** التحقق لازم يتم في السيرفر (RLS + دوال) |

### 16.2 كل خدمة بتخزن إيه

| الخدمة | تخزن إيه | ملاحظة |
|---|---|---|
| **Supabase** (Postgres + Auth + Edge Functions) | كل النصوص والحسابات والامتحانات والدرجات والطلبات والروابط | مفيش صور ولا ملفات فيه |
| **Firebase** (لاحقًا، منفصل) | الشات فقط | خارج نطاق هذه الخطة |
| **Cloudinary** | صور الكورسات وأغلفة الكتب | في الجدول بس الرابط + `public_id` |
| **Google Drive** | ملازم PDF | في الجدول بس الرابط |
| **YouTube Unlisted** | الفيديوهات | في الجدول بس الرابط |

### 16.3 الجداول (20 جدول)

كل الأسعار `numeric`، والتواريخ `timestamptz`، والمفاتيح الأساسية `uuid` (إلا الجداول المرجعية الصغيرة).

#### أ) مرجعية وإعدادات
1. **grades**: `id text PK`, `label`, `stage`, `sort_order`. (6 صفوف ثابتة)
2. **profiles**: `id uuid PK → auth.users ON DELETE CASCADE`, `role` ('student'|'admin') default 'student', `name`, `email` unique, `phone` unique, `guardian_phone`, `grade_id → grades`, `governorate`, `created_at`.
3. **app_settings**: `key text PK`, `value jsonb`. المفاتيح: `telegram_url`, `master_display_name`.
4. **payment_methods**: `id text PK`, `name`, `account_number`, `support_whatsapp`, `is_active`.

#### ب) المحتوى
5. **courses**: `id`, `slug` unique, `title`, `description`, `grade_id`, `duration_label`, `image_url`, `image_public_id`, `published` default false, `created_at`.
6. **course_plans**: `id`, `course_id → courses CASCADE`, `plan_key` ('monthly'|'term'), `name`, `price`, `currency` default 'EGP'. فريد على (course_id, plan_key).
7. **units**: `id`, `course_id CASCADE`, `title`, `position`.
8. **lessons**: `id`, `unit_id CASCADE`, `title`, `duration_label`, `description`, `position`.
9. **lesson_media** (محمي): `lesson_id PK → lessons CASCADE`, `video_url`, `material_url`, `material_title`.

#### ج) الامتحانات
10. **exams**: `id`, `course_id CASCADE`, `unit_id → units SET NULL`, `title`, `duration_minutes`, `starts_at`, `ends_at`, `published`, `created_at`.
11. **questions**: `id`, `exam_id CASCADE`, `position`, `type` ('multiple-choice'|'true-false'|'essay'), `body`, `options jsonb`, `score`.
12. **question_answers** (للمستر فقط): `question_id PK → questions CASCADE`, `correct_answer jsonb`.
13. **exam_attempts**: `id`, `exam_id CASCADE`, `student_id → profiles CASCADE`, `auto_score`, `auto_total`, `score`, `total`, `essay_total`, `correct_count`, `incorrect_count`, `status` ('graded'|'needs_review'), `submitted_at`, `graded_at`. **فريد على (exam_id, student_id)** = مرة واحدة فقط.
14. **attempt_answers**: `attempt_id CASCADE`, `question_id CASCADE`, `answer jsonb`, `awarded_score` (null للمقالي قبل التصحيح). PK على الاتنين.

#### د) الاشتراكات والصلاحيات
15. **enrollments**: `id`, `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `status` ('active'|'ended'), `starts_at`, `ends_at`, `ended_at`, `source_request_id → subscription_requests SET NULL`. اشتراك نشط واحد فقط لكل (طالب، كورس) بـ partial unique index. و«منتهي» بيتحسب من `ends_at` مش بيتخزن.
16. **subscription_requests**: `id`, `reference_number` unique (default `MK-` + عشوائي)، `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `amount`, `transaction_id` unique, `payment_method_id`, `status` ('pending'|'approved'|'rejected') default pending, `created_at`, `reviewed_at`. طلب pending واحد لكل (طالب، كورس).
17. **lesson_access**: `id`, `student_id CASCADE`, `course_id CASCADE`, `lesson_id CASCADE`, `created_at`. فريد على (student_id, lesson_id). السحب = حذف الصف.

#### هـ) الكتب
18. **books**: `id`, `title`, `description`, `grade_id`, `category`, `price`, `image_url`, `image_public_id`, `availability` ('available'|'unavailable'), `created_at`.
19. **book_purchase_requests**: زي طلبات الاشتراك، بـ `book_id` و`reference_number` بادئته `BK-`.
20. **book_purchases** (سجل الملكية): `id`, `student_id CASCADE`, `book_id CASCADE`, `request_id → book_purchase_requests SET NULL`, `purchased_at`. فريد على (student_id, book_id). **حذف الطلب ما بيمسحش الملكية.**

#### و) المحادثة: خارج النطاق
الشات **مش جزء من Supabase**. هيتربط بخدمة منفصلة (Firebase) لاحقًا. فمفيش جدول ولا RLS ولا دوال للشات هنا، و`chatService.jsx` وأي شيء متعلق بالمحادثات **يفضل على الـ Mock ولا يتلمس**. (زر «حذف كل المحادثات» في الإعدادات بيفضل متوصل بـ `chatService` وقت ربط الشات.)

**ملاحظات:**
- رقم عملية التحويل (`transaction_id`) لازم يبقى فريد **عبر الجدولين** (اشتراك وكتب)، فيتعمل trigger يفحص الجدول التاني.
- مفيش جدول للنشاطات: آخر النشاطات في رئيسية المستر بتتحسب من النتائج والطلبات.
- شلت `access_type` و`lesson_id` من طلبات الاشتراك: القرار إن مفيش اشتراك مدفوع بالحصة (الدرس الفردي بصلاحية من المستر).

### 16.4 الحذف المتسلسل (ON DELETE CASCADE)

- حذف **كورس** ← وحداته ودروسه (والـ media) وامتحاناته وأسئلته وإجاباتها ومحاولاته وإجابات الطلاب واشتراكاته وطلباته وصلاحياته.
- حذف **امتحان** ← أسئلته ومحاولاته.
- حذف **كتاب** ← طلباته وسجل ملكيته.
- حذف **طالب** ← مسح حسابه في Auth (Edge Function بصلاحية service role) ← يمسح الـ profile ← يمسح كل بياناته.
- حذف **وحدة** ← دروسها. والامتحانات المرتبطة بيها `unit_id` يبقى null («مراجعة عامة»).
- حذف **طلب مقبول** ← لا يمس `enrollments` ولا `book_purchases`.
- أزرار «حذف الكل» في لوحة المستر ← دوال RPC للمستر فقط.

### 16.5 الصلاحيات (RLS)

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
| profiles | لا | بياناتها (من غير تغيير `role`) | كامل |

أمان إضافي: `profiles.role` ما ينفعش الطالب يعدله (trigger أو column privileges).

### 16.6 الدوال على السيرفر (RPC) و Edge Functions

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

### 16.7 الصور: ضغط + رفع

1. المستر يختار صورة ← فحص النوع والحجم الأقصى.
2. **ضغط في المتصفح قبل الرفع** بمكتبة `browser-image-compression`: أقصى بُعد 1600px، صيغة WebP، الهدف ≤ 300KB تقريبًا، ومعالجة في Web Worker.
3. معاينة فورية.
4. وقت «حفظ»: طلب توقيع من `cloudinary-sign` ← رفع لـ Cloudinary في فولدر `alghazi/courses` أو `alghazi/books`.
5. الجدول بيحفظ `image_url` (الـ secure_url) + `image_public_id`.
6. لو الصورة اتغيرت أو الكورس/الكتاب اتحذف ← `cloudinary-delete` بالـ `public_id`، عشان الصور القديمة ما تاكلش المساحة.
7. وقت العرض: روابط بتحويلات `f_auto,q_auto` وعرض مناسب للكارت.

**ليه رفع موقّع بدل unsigned preset؟** الـ unsigned preset اسمه بيبقى ظاهر في الـ frontend، وأي حد يقدر يرفع على حسابك ويخلص المساحة المجانية. والمستر هو الوحيد اللي بيرفع، فالتوقيع من دالة للمستر أنسب.

مفاتيح الـ frontend العامة بس: `VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY` و`VITE_CLOUDINARY_CLOUD_NAME`. الـ API secret وservice role **يتخزنوا في أسرار Edge Functions** ومش في الكود أبدًا.

### 16.8 الفيديو والملزمة (الحماية بصراحة)

- جدول `lesson_media` ما حدش يقراه إلا المستر، والطالب بياخد الروابط من `get_lesson_media` **بعد فحص اشتراكه**. فالزائر وغير المشترك عمره ما بيستلم الرابط في أي Network request.
- **حد الحماية:** الطالب المشترك يقدر يشوف الـ Video ID في الـ Network ويشاركه. YouTube Unlisted ورابط Drive «أي شخص لديه الرابط» مفيهم منع تقني لده. الحماية الفعلية هي منع غير المشترك.

### 16.9 عداد المساحة (الإعدادات)

الأرقام الحقيقية لازم تيجي من Edge Function اسمها `storage-usage` (للمستر فقط)، وتتخزن مؤقتًا حوالي ساعة. الصفحة بتعرض: المستخدم + الحد + المتبقي + نسبة، وشريط يتلون (أخضر ← دهبي عند 80% ← أحمر عند 90%).

- **Supabase:** حجم قاعدة البيانات بـ SQL (`pg_database_size`) عن طريق دالة.
- **Cloudinary:** Admin API للاستهلاك (يحتاج الـ secret، فالدالة بس).
- **Google Drive:** Drive API `about.get` بحقل `storageQuota` (فيه `limit` و`usage` و`usageInDrive`). **لازم OAuth** باسم حساب Google اللي عليه الملازم، بصلاحية قراءة بيانات وصفية فقط (`drive.metadata.readonly` هو الأقل صلاحية، وراجع الـ scope الحالي في توثيق Google). الخطوة الوحيدة اللي بتحتاج إنسان: الموافقة مرة واحدة في المتصفح، واللي بتطلّع `refresh token` بيتحط في أسرار الدالة. تنبيهات:
  - مساحة حساب Google المجاني (15GB مثلًا) **مشتركة** بين Drive وGmail وPhotos. `usage` بيحسب الكل، و`usageInDrive` بيحسب Drive فقط. اعرض الاتنين أو الأنسب لك.
  - لو الحساب مساحته غير محدودة (بعض حسابات Workspace) بيتأخر أو يغيب حقل `limit`، فالواجهة لازم تتعامل مع غيابه.
  - لو التطبيق في وضع Testing على شاشة موافقة Google، الـ refresh token ممكن ينتهي بعد 7 أيام تقريبًا. الحل: نقل التطبيق لـ In production (تظهر تحذير «تطبيق غير موثّق» للمالك فقط وده عادي)، وراجع الشروط الحالية.
  - Service Account **ما ينفعش** هنا: بيرجّع مساحته هو، مش مساحة حسابك.
- **YouTube:** مفيش حد مساحة نعرضه.

الحدود (500MB وغيرها) بتتغير وبتتراجع من صفحات الأسعار الرسمية وتتحط في ثابت واحد. و`masterStorageService` فيه الشكل النهائي جاهز، وبتتبدل جواه فقط.

---

### 16.10 خريطة الربط بالكود

**الصفحات والتصميم: صفر تعديل.** اللي بيتغير:

| الجزء | الشغل |
|---|---|
| 16 service أساسية (`courseService`...) (ما عدا `chatService`: خارج النطاق) | تتحول من الداتا المحلية لـ Supabase. **نفس أسماء الدوال والمدخلات والمخرجات.** |
| 12 service للمستر | فلترة وتقسيم وإحصائيات بـ queries و`range` و`count` ودوال RPC. المدخلات والمخرجات ثابتة. |
| `studentService.getCurrentStudent` | تقرأ من جلسة Auth |
| `subscriptionService` و`bookPurchaseService` | إنشاء الطلب عبر RPC (المبلغ من السيرفر)، وشيل فرع `accessType = "lesson"` |
| `ExamInterface` و`ExamResult` و`questionService` | الأسئلة من `get_exam_questions`، والتسليم من `submit_exam`، والنتيجة من الـ attempt، وشيل `sessionStorage` |
| `Login` و`Signup` | يتوصلوا بـ `authService` |
| `utils/readImageFile.js` + `MasterImageField` | ضغط + رفع Cloudinary |
| `masterStorageService` | استدعاء `storage-usage` |

**ملفات جديدة:** `lib/supabaseClient.js`، `mappers/` (تحويل snake_case لـ camelCase بنفس الأسماء الحالية)، `services/authService.jsx`، `context/AuthContext.jsx`، حماية للمسارات (`ProtectedRoute` و`AdminRoute`)، `services/mediaService.jsx`.

### 16.11 ترتيب التنفيذ (الموقع يفضل شغال في كل خطوة)

1. **الأساس:** مشروع Supabase، الجداول، RLS، الدوال، بيانات أولية (الصفوف، وسيلة الدفع، الإعدادات).
2. **القراءة العامة:** الصفوف والكورسات والخطط والدروس والكتب ووسائل الدفع.
3. **الحسابات:** التسجيل (trigger ينشئ الـ profile)، الدخول (+ بالتليفون)، `getCurrentStudent`، حماية المسارات.
4. **رحلة الطالب:** الاشتراكات، الدروس (الميديا بالدالة)، الامتحانات (جلب + تسليم)، النتائج، طلبات الاشتراك والكتب، ملكية الكتب.
5. **لوحة المستر:** الخدمات واحدة واحدة (الطلاب، الكورسات، الامتحانات، النتائج، الاشتراكات، الكتب، الصلاحيات، الإعدادات)، مع دوال القبول والتصحيح.
6. **الصور:** ضغط ورفع Cloudinary وحذف القديم.
7. **المساحة والتصليب:** `storage-usage`، اختبار RLS لكل دور، مراجعة الأسرار.

### 16.12 أسئلة مفتوحة (ومعاها الافتراض)

1. **الشات:** خارج نطاق Supabase (Firebase لاحقًا). لا يتلمس في هذه الخطة.
2. **الدخول بالتليفون:** Supabase بيسجّل بالإيميل والباسورد بسهولة. الافتراض: نسجّل بالإيميل، ولو كتب تليفون نحوّله لإيميله بـ `resolve-login`.
3. **تأكيد الإيميل:** الافتراض: مش مطلوب في البداية.
4. **حساب المستر:** بيتعمل مرة واحدة يدويًا، ويتحط له `role = 'admin'` بـ SQL.
5. **البيانات الأولية (seed):** الصفوف الستة ووسيلة الدفع والإعدادات (إجباري). والمحتوى التجريبي (كورسات، وحدات، دروس، امتحانات، أسئلة، كتب) في ملف منفصل اختياري. **بدون طلاب وهميين** لأن أي طالب لازم له حساب دخول حقيقي.

### 16.13 المفاتيح والأسرار (أسماء ثابتة)

| النوع | الأسماء | تتحط فين |
|---|---|---|
| عام (يظهر في المتصفح) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME` | `.env.local` |
| أدوات محلية (جهاز المطوّر) | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` | `.env.admin` (غير مرفوع على Git) |
| أسرار Edge Functions | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | ملف `.env.secrets` (غير مرفوع على Git) ثم `supabase secrets set --env-file .env.secrets` |

- مفتاح `service_role` ما يتحطش في أي كود أو سكريبت: Edge Functions بتاخده تلقائيًا من Supabase.
- أسرار الدوال **ما يتحطش فيها أي اسم بيبدأ بـ `SUPABASE_`** (Supabase بيرفضه)، عشان كده `SUPABASE_*` في `.env.admin` لوحده و`CLOUDINARY_*`/`GOOGLE_*` في `.env.secrets`.
- `.env` و`.env.admin` و`.env.secrets` في `.gitignore`، ويتعمل `.env.example` بالأسماء فقط.
- فحص الملفات محليًا من غير ما تتبعت لحد: `node check-env.mjs` (السكريبت في جذر المشروع، ما بيطبعش أي قيمة كاملة).
- بعد انتهاء الشغل: تغيير توكن Supabase وباسورد قاعدة البيانات وأسرار Cloudinary وGoogle.
- **خطوات ما ينفعش الـ AI يعملها (إنسان):** إنشاء الحسابات والمشاريع، توليد المفاتيح، موافقة Google في المتصفح، إعدادات Auth على Supabase (Site URL وتعطيل تأكيد الإيميل)، تسجيل حساب المستر ثم تعيين `role='admin'` بـ SQL، رفع الملازم والفيديوهات، التجربة الفعلية على الموبايل، تدوير المفاتيح.

---

*نهاية الملف.*
