# الغازي في التاريخ — README المرجعي للمشروع

> **إلى أي مساعد ذكاء اصطناعي يقرأ هذا الملف:** هذا هو المرجع الأساسي والوحيد للمشروع. اقرأه كاملًا قبل أي شيء. لو اختلف هذا الملف مع الكود الفعلي، **الكود الفعلي هو الأصح**، وبلّغ المستخدم بالاختلاف بدل ما تفترض. لا تكتب أي كود قبل ما تقرأ الملفات الحالية المرتبطة بالميزة.

آخر تحديث لهذا الملف: 29 سبتمبر 2026.

---

## 1. فكرة المشروع

**«الغازي في التاريخ»** منصة تعليمية متخصصة في التاريخ والدراسات الاجتماعية (مصر). صاحب المنصة مدرس واحد يُسمّى في المشروع **«المستر» / Master**.

**الطالب يقدر:**

- ينشئ حسابه ويختار صفه الدراسي.
- يشترك في الكورسات.
- يفتح الدروس ويشاهد الفيديوهات والمواد.
- يدخل الامتحانات ويشوف النتائج.
- يشتري الكتب والمذكرات.
- يتواصل مع المدرس من Chat داخل الموقع.

**المستر يدير كل ده من Master Dashboard:** الطلاب، الكورسات والدروس، الامتحانات والأسئلة، النتائج والتصحيح، الاشتراكات، طلبات شراء الكتب، الكتب، صلاحيات الدروس الخاصة، وإعدادات الحساب والدفع.

**أهم مبدأ للـ Master Dashboard:** لوحة **تشغيلية** يومية، واضحة، Premium وProfessional. مش منصة تحليلات (BI).

---

## 2. الحالة الحالية (مهم جدًا)

| الجزء | الحالة |
|---|---|
| الموقع العام (Home / Login / Signup / Courses / CourseDetails / Books) | موجود |
| Student Dashboard كامل (Home, Courses, Books, Exams, Results, Profile, Support) | موجود |
| ExamInterface + ExamResult + LessonPage + Subscription + BookPurchase + Chat | موجود |
| Grade System موحّد | موجود |
| Lesson Access (منح الصلاحيات في الـ data/service) | موجود |
| Master Dashboard: التصميم والقرارات | **انتهى ومقفول** |
| Master Dashboard: الكود | **لم يبدأ فعليًا** (فقط هيكل مبدئي، انظر تحت) |
| Backend | **لا يوجد**. كل الداتا Mock في `src/data` |
| Auth حقيقي / حماية Routes | **لا يوجد** (`getCurrentStudent()` بترجع أول طالب mock) |

### ما هو موجود من Master بالضبط

- ملف واحد فقط: `src/Components/DashboardMaster/MasterLayout.jsx`. فيه Sidebar فاضي (عنوان فقط)، وTopbar بسيط، و`<Outlet />`.
- في `App.jsx` الـ Route الحالي: `<Route path="/dashboard-master" element={<MasterLayout />} />` وهو **غير متداخل** (مفيهوش Child Routes). لازم يتحول لـ Nested Routes زي Student Dashboard.
- **غير موجود لسه:** `MasterSidebar`، `MasterTopbar`، أي صفحة من صفحات Master، الـ Shared Components، ConfirmModal.

---

## 3. التقنيات (من `package.json` الفعلي)

| التقنية | النسخة |
|---|---|
| React | 19 |
| Vite | 8 |
| JavaScript (بدون TypeScript) | — |
| Tailwind CSS | v4 (عن طريق `@tailwindcss/vite`، والألوان في `@theme` داخل `src/index.css`، **مفيش** `tailwind.config.js`) |
| React Router DOM | 7 |
| Font Awesome | `@fortawesome/*` (react-fontawesome + free-solid + free-brands) |
| Swiper | 14 (مستخدم في سكشن الكتب) |
| uuid | 14 |
| خط Cairo | `@fontsource/cairo` |
| React Compiler | مفعّل (`babel-plugin-react-compiler`) |
| ESLint | 10 |

**الـ Backend المخطط لاحقًا: Supabase.** الخطة إنهاء الـ Frontend بالكامل بـ Mock Data أولًا، وبعدها نستبدل طبقة `services/` بـ Supabase.

> ملاحظة: كان هناك تصور قديم لـ Firebase / Cloud Functions / Cloudinary / React Icons. **مش مثبتين ومش مستخدمين** حاليًا. المعتمد Font Awesome وSupabase.

### تشغيل المشروع

```bash
npm install
npm run dev      # يفتح المتصفح تلقائيًا
npm run build
npm run lint
```

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
- **قرار Master (اتجاه مقترح ولم يُثبَّت رسميًا):** نفس الهوية العامة (ألوان، خطوط، Spacing، Buttons، Cards) مع طابع Admin أكثر تنظيمًا. **مش** نظام بصري منفصل.

---

## 5. شجرة الملفات (الحالية فعليًا)

```text
master/
├── public/   # ملفات ثابتة
│   ├── Imgs-plan/   # صور تخطيط التصميم (مرجع فقط)
│   │   ├── Plan.png
│   │   ├── website 2.png
│   │   └── website.png
│   └── Imgs-websit/   # أيقونة الموقع
│       └── favacon.png
├── src/
│   ├── assets/   # الصور
│   │   ├── Background/   # خلفيات الصفحات
│   │   │   ├── 1.jpg
│   │   │   ├── bg1.png
│   │   │   ├── bg2.webp
│   │   │   ├── coureses.webp
│   │   │   ├── dashbord student 1.webp
│   │   │   ├── dashbord student 2.webp
│   │   │   ├── dashbord student home.webp
│   │   │   ├── hero-bg.webp
│   │   │   ├── Login.webp
│   │   │   ├── Result Exam.jpg
│   │   │   └── signup.jpg
│   │   ├── Books/   # أغلفة الكتب
│   │   │   ├── book1.jpeg
│   │   │   ├── book2.jpeg
│   │   │   ├── book3.webp
│   │   │   ├── book4.jpeg
│   │   │   ├── book5.jpeg
│   │   │   └── book6.webp
│   │   ├── Logo/   # اللوجو
│   │   │   ├── logo.jpeg
│   │   │   └── transparent-Logo.png
│   │   └── Master/   # صور هوية المستر (تُستخدم في Hero وغيره)
│   │       ├── master 1.webp
│   │       ├── master 2.webp
│   │       ├── master 3.webp
│   │       ├── master no transparent.jpeg
│   │       ├── Master transparent.png
│   │       ├── master-home.png
│   │       └── master.webp
│   ├── Components/   # مكونات مشتركة وصفحات عامة
│   │   ├── Books/   # أغلفة الكتب
│   │   │   ├── BookCard.jsx
│   │   │   └── BooksSection.jsx
│   │   ├── Chat/   # مكونات الشات
│   │   │   └── ChatMessage.jsx
│   │   ├── DashboardMaster/   # داشبورد المستر (لسه في البداية)
│   │   │   └── MasterLayout.jsx   # هيكل مبدئي فقط (Sidebar فاضي + Topbar بسيط + Outlet)
│   │   ├── DashboardStudent/   # مكونات داشبورد الطالب
│   │   │   ├── DashboardBookCard.jsx
│   │   │   ├── DashboardExamCard.jsx
│   │   │   ├── DashboardLayout.jsx   # Layout الطالب (Navbar + Sidebar + Chat + Footer)
│   │   │   ├── DashboardResultCard.jsx
│   │   │   ├── DashboardSidebar.jsx   # Sidebar الطالب
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ExamQuestionCard.jsx
│   │   │   ├── ExamQuestionNavigator.jsx
│   │   │   └── ExamTimer.jsx
│   │   ├── Lesson/   # مكونات صفحة الدرس
│   │   │   ├── LessonContentList.jsx
│   │   │   ├── LessonMaterials.jsx
│   │   │   └── LessonVideo.jsx
│   │   ├── AboutPlatform.jsx
│   │   ├── Chat.jsx   # الشات العائم داخل الموقع
│   │   ├── CourseDetails.jsx
│   │   ├── Courses.jsx
│   │   ├── ExamResult.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── Signup.jsx
│   │   └── StudentOpinions.jsx
│   ├── data/   # Mock Data (بديل مؤقت لقاعدة البيانات)
│   │   ├── bookPurchaseRequests.jsx   # طلبات شراء الكتب (فاضية/معلّقة)
│   │   ├── books.jsx
│   │   ├── chatMessages.jsx
│   │   ├── courses.jsx
│   │   ├── enrollments.jsx   # اشتراكات الطلاب في الكورسات
│   │   ├── exams.jsx
│   │   ├── grades.jsx   # مصدر الصفوف الوحيد (IDs + Labels)
│   │   ├── lessonAccess.jsx   # صلاحيات الدروس الخاصة
│   │   ├── lessons.jsx
│   │   ├── paymentMethods.jsx   # Vodafone Cash
│   │   ├── questions.jsx   # الأسئلة (multiple-choice / true-false / essay)
│   │   ├── results.jsx
│   │   ├── students.jsx
│   │   └── subscriptionRequests.jsx   # طلبات الاشتراك (فاضية حاليًا)
│   ├── Page/   # صفحات الموقع
│   │   ├── DashboardStudent/   # مكونات داشبورد الطالب
│   │   │   ├── DashboardBooks.jsx
│   │   │   ├── DashboardCourses.jsx
│   │   │   ├── DashboardExams.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── DashboardProfile.jsx
│   │   │   ├── DashboardResults.jsx
│   │   │   ├── DashboardSupport.jsx
│   │   │   ├── ExamInterface.jsx   # واجهة حل الامتحان
│   │   │   └── LessonPage.jsx   # صفحة الدرس
│   │   ├── BookPurchase.jsx
│   │   ├── Books.jsx
│   │   ├── Home.jsx
│   │   └── Subscription.jsx   # صفحة الاشتراك والدفع
│   ├── services/   # طبقة الخدمات (async) — هي اللي هتتبدل بـ Supabase
│   │   ├── bookPurchaseService.jsx
│   │   ├── bookService.jsx
│   │   ├── chatService.jsx
│   │   ├── courseService.jsx
│   │   ├── enrollmentService.jsx
│   │   ├── examService.jsx
│   │   ├── lessonAccessService.jsx
│   │   ├── lessonService.jsx
│   │   ├── paymentMethodService.jsx
│   │   ├── questionService.jsx
│   │   ├── resultService.jsx
│   │   ├── studentService.jsx
│   │   └── subscriptionService.jsx
│   ├── utils/   # دوال مساعدة
│   │   └── gradeUtils.jsx   # getGradeLabel(gradeId)
│   ├── App.css
│   ├── App.jsx   # كل الـ Routes
│   ├── index.css   # Tailwind v4 + الألوان (@theme) + خط Cairo
│   └── main.jsx   # نقطة بداية التطبيق
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md   # هذا الملف
└── vite.config.js   # React + Tailwind v4 + React Compiler
```

> ملحوظات على الشجرة:
> - مجلد الداتا اسمه `src/data` (مش `src/date`).
> - `gradeUtils` امتداده `.jsx`.
> - مجلد Master Assets موجود: `src/assets/Master/` ولازم يُستغل في هوية Master.

---

## 6. الـ Routes

### الحالية في `App.jsx`

| المسار | الصفحة |
|---|---|
| `/` | Home |
| `/signup` | Signup |
| `/login` | Login |
| `/courses/:courseId` | CourseDetails |
| `/courses/:courseId/lessons/:lessonId` | LessonPage |
| `/books` | Books |
| `/books/:bookId/purchase` | BookPurchase |
| `/subscription/:courseId/:planId` | Subscription |
| `/exam-result/:examId` | ExamResult |
| `/dashboard-student/exams/:examId` | ExamInterface (خارج الـ Layout) |
| `/dashboard-student` (Nested داخل `DashboardLayout`) | index=Home، `courses`, `books`, `exams`, `results`, `profile`, `support` |
| `/dashboard-master` | `MasterLayout` (غير متداخل حاليًا) |

### المخططة لـ Master (Nested Routes داخل `MasterLayout`)

```text
/dashboard-master              الرئيسية
/dashboard-master/students     الطلاب  (+ تفاصيل الطالب)
/dashboard-master/courses      الكورسات والمحتوى
/dashboard-master/exams        الامتحانات والأسئلة
/dashboard-master/results      النتائج
/dashboard-master/subscriptions   الاشتراكات وطلبات الاشتراك
/dashboard-master/book-requests   طلبات شراء الكتب
/dashboard-master/books        الكتب والمذكرات
/dashboard-master/lesson-access   صلاحيات الدروس
/dashboard-master/settings     الإعدادات
```

> أسماء المسارات الفرعية أعلاه **مقترحة** وقابلة للتعديل عند التنفيذ، أما `/dashboard-master` نفسه فمعتمد. Master Dashboard **مستقل تمامًا** عن Student Dashboard.

---

## 7. طبقة البيانات (Mock Data + Services)

**النمط المتبع:** كل ملف داتا في `src/data/`، وكل وصول ليه من خلال `src/services/` بدوال `async` (عشان الانتقال لـ Supabase يبقى بتبديل الـ services فقط). الـ IDs بتتقارن دائمًا بـ `String(a) === String(b)`.

### ملفات الداتا وشكلها الحالي

| الملف | الحقول الحالية |
|---|---|
| `students.jsx` | `id, name, email, phone, grade, governorate` |
| `courses.jsx` | `id, title, description, grade, duration, image, lessonsCount, subscriptionPlans[{id,name,price,currency}]` |
| `lessons.jsx` | Units: `{id, courseId, title, lessons[{id,title,duration,description}]}` |
| `exams.jsx` | `id, unitId (أو null), title, courseId, sectionTitle, durationMinutes, totalQuestions, startsAt, endsAt` |
| `questions.jsx` | `id, examId, type, question, score, order` + حسب النوع (تحت) |
| `results.jsx` | `id, studentId, examId, score, total, submittedAt` (وأحيانًا `title`) |
| `enrollments.jsx` | `id, studentId, courseId, status ("active")` |
| `subscriptionRequests.jsx` | مصفوفة فاضية. الطلب: `id, referenceNumber (MK-…), studentId, courseId, accessType, planId, lessonId, amount, transactionId, paymentMethodId, status ("pending"), createdAt` |
| `books.jsx` | `id, title, grade, category, description, price, image` |
| `bookPurchaseRequests.jsx` | فاضية. الطلب: `id, referenceNumber, studentId, bookId, amount, transactionId, paymentMethodId, status ("pending"), createdAt` |
| `lessonAccess.jsx` | `id, studentId, courseId, lessonId, status ("active"), createdAt` |
| `paymentMethods.jsx` | `{id:"vodafone-cash", name:"Vodafone Cash", accountNumber:"01115083459", supportWhatsApp:"01006254308", isActive:true}` |
| `chatMessages.jsx` | `id, conversationId, senderRole, type (text/image/audio), text, createdAt` |
| `grades.jsx` | الصفوف (تحت) |

### أنواع الأسئلة الفعلية (لا تخترع أنواع جديدة)

```js
// اختيار من متعدد
{ type: "multiple-choice", question, options: [..4 خيارات..], correctAnswer: 1 /* index */, score, order }
// صح/خطأ
{ type: "true-false", question, correctAnswer: true /* boolean */, score, order }
// مقالي (بدون correctAnswer، يحتاج تصحيح يدوي)
{ type: "essay", question, score, order }
```

### الـ Services الموجودة

| الملف | الدوال |
|---|---|
| `studentService` | `getCurrentStudent` |
| `courseService` | `getCourses`, `getCourseById` |
| `lessonService` | `getUnitsByCourseId` |
| `enrollmentService` | `getEnrollmentsByStudentId`, `isStudentEnrolled` |
| `examService` | `getExamsByCourseId`, `getExamById` |
| `questionService` | `getQuestionsByExamId` |
| `resultService` | `getResultsByStudentId`, `getResultByExamId` |
| `subscriptionService` | `getSubscriptionRequestsByStudentId`, `getPendingSubscriptionRequest`, `createSubscriptionRequest` |
| `bookService` | `getBooks`, `getBookById`, `getBooksByStudentGrade` |
| `bookPurchaseService` | `getPendingBookPurchaseRequest`, `getBookPurchaseRequestsByStudentId`, `createBookPurchaseRequest` |
| `lessonAccessService` | `getLessonAccessByStudentId`, `getLessonAccessByStudentAndCourseId`, `hasLessonAccess`, `grantLessonAccess` |
| `paymentMethodService` | `getActivePaymentMethods`, `getPaymentMethodById` |
| `chatService` | `getMessages`, `sendMessage` |

> Master هيحتاج services جديدة (قراءة الكل، تعديل، حذف، قبول طلبات…). تتبنى **مع كل ميزة** وليس دفعة واحدة.

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

## 9. قواعد نظام الطالب (موجودة وبتأثر على Master)

### الاشتراك في الكورس

`غير مشترك` ← «اشترك في الكورس» | `قيد المراجعة` ← «الاشتراك قيد المراجعة» | `مقبول` ← «متابعة الكورس»

### شراء الكتاب

`لا يوجد طلب` ← «شراء الكتاب» | `قيد المراجعة` ← «الطلب قيد المراجعة» | `مقبول` ← «تم شراء الكتاب»
(حالة «مرفوض» **اتلغت**، انظر القسم 12.)

### الدفع

- المستر واحد. طريقة الدفع الحالية **Vodafone Cash** فقط. **لا Payment Gateway.**
- الطالب يحوّل، ثم يدخل **رقم العملية (`transactionId`)** ويرسل الطلب. المستر يراجع ويقبل.
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

مفيش Reference داخلي ثالث. (في الـ Mock حاليًا الكتب `book-1…6` والطلبات `MK-…`، انظر القسم 13.)

### الكتب

- **لا سنة دراسية (`academicYear`) للكتب.** لو كتاب قديم انتهى، المستر يخليه «غير متاح للشراء» ويضيف كتابًا جديدًا.
- حالة الكتاب: **متاح للشراء / غير متاح للشراء.** لو غير متاح، الطالب **لا يقدر يعمل طلب جديد**، لكن اللي اشتراه قبل كده **يفضل عنده** ومشترياته مش بتتلغي.
- الكتاب: `ID، اسم، وصف، grade، price، cover، availability`. لا مخزون، لا شحن، لا كوبونات، لا سلة.

---

## 10. Master Dashboard: القرارات العامة

### ترتيب العمل المتفق عليه

```text
1. تصور كل صفحات Master        ← انتهى
2. وظيفة كل صفحة بالتفصيل      ← انتهى
3. تحديد الحاجات المشتركة       ← اتحدد مفهومها
4. Layout + Sidebar + Topbar + Shared Components  ← الخطوة الجاية
5. تنفيذ الصفحات واحدة واحدة
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
- حالات الطلب: **قيد المراجعة / مقبول فقط** (لا يوجد مرفوض).
- **طلبات الاشتراك:** رقم الطلب، الطالب، الكورس، المبلغ، التاريخ، رقم العملية، الحالة. تفاصيل الطلب: بيانات الطالب، بيانات الاشتراك (الكورس، الخطة، المبلغ، تاريخ الطلب، رقم العملية، طريقة الدفع)، وزر **«قبول الطلب»**.
- **عند القبول → يتفعّل الاشتراك تلقائيًا.** لا توجد خطوة ثانية يدوية.
- **الاشتراكات:** الطالب، الكورس، الخطة، البداية، النهاية، الحالة. الإجراءات: عرض، **تمديد الاشتراك**، **إنهاء الاشتراك**.
- التمديد: أداة للمستر للتمديد المباشر/الاستثنائي (مثال: 30 يوم). أما الدفع لشهر جديد فيتم بـ **طلب اشتراك جديد**.
- **لا يوجد:** تعديل حر للاشتراك، ولا حذف اشتراك كإجراء عادي (الاشتراك يُنهى ولا يُحذف).
- حذف: طلب واحد / كل الطلبات.

### 11.7 طلبات شراء الكتب

- العنوان: «طلبات شراء الكتب — مراجعة طلبات شراء الكتب الخاصة بالطلاب».
- Stats: إجمالي الطلبات، تحتاج مراجعة، الطلبات المقبولة.
- **البحث (3 عناصر فقط):** اسم الطالب، رقم الطلب، رقم التحويل. فلاتر: الصف، الكتاب، حالة الطلب (**قيد المراجعة / مقبول**).
- جدول: رقم الطلب، الطالب، الكتاب، رقم التحويل، المبلغ، تاريخ الطلب، إجراء.
- تفاصيل الطلب: بيانات الطالب، بيانات الكتاب، بيانات الدفع (طريقة الدفع، رقم التحويل، المبلغ، التاريخ)، الحالة، زر **«قبول الطلب»**.
- **عند القبول → الكتاب يصبح مشتراة للطالب.**
- حذف: طلب واحد / الكل. **حذف الطلب المقبول لا يلغي حق الطالب في الكتاب.**
- لا يوجد: سبب رفض، رفض، إثبات دفع كصورة.

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

## 12. قرارات نهائية وأفكار مُلغاة (لا تقترحها مرة ثانية)

| الفكرة | القرار |
|---|---|
| Analytics / Charts / Ranking / Success Rate / Revenue / Course analytics | **ملغي.** المستر يريد Dashboard تشغيلية مش BI |
| Teacher Chat / Message Center / Chat Inbox | **ملغي.** التواصل عبر Telegram |
| Multi-Teacher / Roles / Permission matrix | **ملغي.** Master واحد فقط |
| رفض طلب الاشتراك أو طلب الكتاب / سبب الرفض / زر الرفض / حالة `rejected` | **ملغي نهائيًا** (الحالتان فقط: قيد المراجعة، مقبول) |
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
| Dark/Light switch / Multi-language | **ملغي** |

---

## 13. اختلافات وتنظيف مطلوب في الكود الحالي

اتراجعت على المشروع فعليًا، وده اللي لازم يتظبط أو يتقرر **قبل** الميزة المرتبطة به:

**تنظيف (يتعمل عند الوصول للميزة):**

1. **`rejected` لسه في الكود:** موجود في `src/Components/DashboardStudent/DashboardBookCard.jsx` (`isRejected`). لازم يتشال مع أي UI «إعادة طلب الشراء».
2. **`accessType: "lesson"` في `subscriptionService.jsx`:** الـ Service بتدعم طلبات اشتراك بالحصة (`lessonId`) رغم إن القرار إلغاء اشتراك الحصة. مش مستخدمة في أي مكان حاليًا، يُنظَّف عند الوصول لصفحة الاشتراكات.
3. **Reference الطلبات:** طلبات الكتب دلوقتي `MK-…` (نفس بادئة الاشتراك)، والمتفق عليه تمييز طلب الكتاب (`BK-…`) عن الكتاب نفسه (`BOOK-…`). (في الإنتاج الأرقام هتيجي من السيرفر.)
4. **Book Availability** غير مطبّق في واجهة الطالب: الكتاب غير المتاح لا يظهر له «شراء» لكن يفضل مفتوح لمن اشتراه.

**حقول ناقصة في الـ Mock Data (Master هيحتاجها):**

| الكيان | الحقل الناقص |
|---|---|
| Student | `parentPhone` (مطلوب في صفحة تفاصيل الطالب)، ويفضّل `createdAt` |
| Course | حالة النشر (`published`)، ويفضّل ربط الدروس/المشتركين بشكل صريح |
| Exam | حالة النشر (`published`)، ولازم `totalQuestions` يتحسب من الأسئلة الفعلية |
| Result | حالة التصحيح (`needs-grading / graded`)، وإجابات الطالب، ودرجات المقالي |
| Book | `availability` (متاح/غير متاح) |
| Enrollment/Subscription | `planId`، `startsAt`، `endsAt`، الحالة (`active/expired/ended`)، ومصدر الاشتراك (رقم الطلب) عشان التمديد والإنهاء |

> أي تغيير في شكل الداتا يتعمل مع الميزة، مع تحديث الـ Student Dashboard لو تأثر.

**نقاط تحتاج قرار من المستخدم (لم تُحسم):**

- هوية Master البصرية: التوصية نفس هوية الموقع مع طابع Admin (القسم 4). لم تُثبَّت رسميًا.
- بند «التصحيح المطلوب» في إدارة الامتحان (ظهر في التصميم القديم بصيغة «3 محاولات»): المعنى غير واضح، يُسأل عنه عند بناء الصفحة.
- أسماء المسارات الفرعية لـ Master (القسم 6).

---

## 14. طريقة العمل مع المستخدم (مهم)

- **اللغة:** عربي بأسلوب مصري بسيط ومباشر. الشرح عملي بدون مصطلحات معقدة. الكود والـ comments بالإنجليزية أو زي ما المشروع ماشي.
- **Feature by Feature / Page by Page.** لا تقفز بين الملفات ولا تضيف حاجات من غير حاجة.
- **اتفق على شكل ووظيفة الصفحة أولًا، وبعدها اكتب الكود.**
- **اقرأ الملفات الحالية قبل أي كود مرتبط بـ data.** ممنوع الاعتماد على نسخة قديمة من الذاكرة أو على أمثلة مكتوبة في هذا الـ README.
- ما تفترضش شكل الـ data. لو محتاج حقل جديد قول ده للمستخدم.
- لو محتاج توضيح، **اسأل** بدل ما تفترض.
- ما تبدأش كتابة أي كود قبل ما تلخص فهمك وتاخد تأكيد.
- عند تسليم كود: اذكر اسم الملف ومساره بالضبط، وإن كان ملف جديد أو تعديل.
- لو المشروع فيه Build/Lint، متقولش «اتحقق» إلا لو اتشغّل فعلًا (في مراجعة سابقة `npm run build` ما اتنفذش لأن الـ dependencies مكانتش متثبتة).

---

## 15. الخطوة الجاية

```text
1. MasterLayout  (تطويره: Sidebar + Topbar + Outlet، بدون Footer)
2. MasterSidebar (10 صفحات + تسجيل الخروج، Hamburger للموبايل)
3. MasterTopbar  (بسيط + زر Telegram)
4. Master Routing (تحويل /dashboard-master لـ Nested Routes في App.jsx)
5. Shared Components اللازمة فقط (PageHeader, StatCard, StatusBadge, ConfirmModal…)
6. Master Home
7. باقي الصفحات واحدة واحدة:
   Students → Courses → Exams → Results → Subscriptions → Book Requests → Books → Lesson Access → Settings
```

**ما لم يُبنَ بعد ويُبنى لاحقًا:** JSON Questions Import (Parser + Validation + Preview + Error reporting)، تنظيف `rejected`، Book Availability في واجهة الطالب، الانتقال لـ Supabase.

---

## 16. خطة Backend (Supabase) لاحقًا

- **الجداول المتوقعة:** Profiles, Courses, Units, Lessons, Exams, Questions, Results, Subscriptions, SubscriptionRequests, Books, BookPurchaseRequests, LessonAccess, PaymentSettings, Messages.
- **Trigger:** إنشاء Profile تلقائي عند التسجيل.
- **RLS Policies:** على كل الجداول (الطالب يقرأ بياناته فقط، المستر يعدّل ويحذف).
- **Auth Context + Protected Routes** (طالب / مستر).
- **الأمان:** جلسة واحدة (Single Session) لمنع مشاركة الحسابات، حماية الفيديوهات (منع right-click، إخفاء روابط YouTube، تحقق من الاشتراك أو الصلاحية قبل التشغيل)، نقل العمليات الحساسة لـ Edge Functions.
- **النشر:** Cloudflare Pages + ربط الدومين + اختبار موبايل/كمبيوتر.
- **ملاحظة:** الخطة القديمة كانت «أكواد تفعيل». **اتبدّلت** بنظام طلبات الاشتراك (Vodafone Cash + رقم عملية + قبول المستر)، فما تبنيش نظام Activation Codes.
