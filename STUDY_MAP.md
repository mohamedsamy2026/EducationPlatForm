# خريطة مذاكرة مشروع «الغازي في التاريخ»

الملفات مرتبة من أول حاجة تتشغل ومن أول حاجة بتظهر على الشاشة (الهيرو) لحد آخر ملف. عدد الملفات: **135** (مفحوصة تلقائيًا: مفيش ملف ناقص ولا مكرر).

## إزاي تذاكر كل ملف
1. اقرأ سطر الوصف هنا، وبعدين افتح الملف.
2. شوف الـ `import` في أول الملف: بيقولك الملف بيعتمد على إيه (وده اللي لازم تكون قريته قبله).
3. شوف الـ state (`useState`) وبعدها الـ `useEffect` (من فين بيجيب الداتا).
4. آخر حاجة اقرأ الـ JSX (الشكل).
5. لو الملف صفحة مستر، افتح الـ service بتاعتها جنبها.

## القاعدة اللي المشروع كله ماشي عليها
`data` (بيانات تجريبية) ← `services` (المنطق، دوال async) ← الصفحات (عرض فقط). لما تربط Supabase بتبدّل جوه الـ services بس والصفحات تفضل زي ما هي.


---

## المرحلة 0: ملفات الإعداد ونقطة البداية

ابدأ من هنا: إزاي المشروع بيشتغل، ومنين بتبدأ أي صفحة. مفيش منطق أعمال في المرحلة دي.

**1. `package.json`**   
المكتبات (React, Router, Tailwind, Font Awesome, uuid) وأوامر التشغيل. مكتبة Supabase لسه مش متثبتة (هتتضاف وقت الربط).

**2. `vite.config.js`**   
إعداد Vite وإضافة Tailwind.

**3. `eslint.config.js`**   
قواعد فحص جودة الكود (lint).

**4. `index.html`**   
صفحة HTML الوحيدة: فيها div الجذر وبتحمّل main.jsx.

**5. `.gitignore`**   
الملفات اللي Git يتجاهلها (node_modules, dist, ملفات .env).

**6. `README.md`**   
مرجع القرارات (قديم في بعض النقاط). الكود الفعلي هو المرجع الأحدث.

**7. `src/main.jsx`** (13 سطر)  
نقطة بداية التطبيق: بيركّب React في الصفحة ويلف App بـ StrictMode وBrowserRouter.  
↳ يستورد: مكونات/صفحات: App.jsx

**8. `src/index.css`** (35 سطر)  
الألوان (Midnight/Gold...) وخط Cairo وإعدادات Tailwind العامة. مصدر الهوية البصرية.

**9. `src/App.css`** (0 سطر)  
ملف فاضي (0 بايت) ومش مستخدم. ممكن تمسحه أو تسيبه.

**10. `src/App.jsx`** (106 سطر)  
خريطة كل الصفحات (Routes): العامة، لوحة الطالب، لوحة المستر. أي صفحة جديدة بتتسجل هنا.  
↳ يستورد: مكونات/صفحات: Home, Signup, Login, CourseDetails, ExamResult, Books, BookPurchase, ScrollToTop, DashboardLayout, DashboardHome, DashboardCourses, DashboardBooks, DashboardExams, DashboardResults, DashboardProfile, DashboardSupport, ExamInterface, LessonPage, Subscription, MasterLayout, MasterHome, MasterPlaceholder, MasterStudents, MasterStudentDetails, MasterCourses, MasterCourseForm, MasterCourseContent, MasterExams, MasterExamForm, MasterExamManage, MasterResults, MasterResultDetails, MasterSubscriptions, MasterBookRequests, MasterBooks, MasterBookForm, MasterLessonAccess, MasterSettings

**11. `src/Components/ScrollToTop.jsx`** (12 سطر)  
بيرجّع الصفحة لأعلى كل ما تتنقل بين صفحتين.


---

## المرحلة 1: الصفحة الرئيسية للموقع (من فوق لتحت)

الأقسام بترتيب ظهورها على الشاشة بالظبط: الهيرو أولًا. أغلبها تصميم وعرض بدون منطق.

**12. `src/Page/Home.jsx`** (44 سطر)  
الصفحة الرئيسية: بترص الأقسام بالترتيب (Navbar ← Hero ← عن المنصة ← الكورسات ← الكتب ← الآراء ← Footer).  
↳ يستورد: مكونات/صفحات: Navbar, HeroSection, AboutPlatform, Courses, StudentOpinions, Footer, BooksSection

**13. `src/Components/Navbar.jsx`** (295 سطر)  
الشريط العلوي للموقع: الشعار والروابط وزرارين تسجيل الدخول وإنشاء حساب.

**14. `src/Components/HeroSection.jsx`** (136 سطر)  
قسم الهيرو: العنوان الكبير «تعلّم التاريخ بأسلوب مختلف» وصورة المستر وأزرار البداية.

**15. `src/Components/AboutPlatform.jsx`** (323 سطر)  
قسم «عن المنصة»: مميزات المنصة في بطاقات (فهم الأحداث، الاستعداد للامتحانات...).

**16. `src/Components/Courses.jsx`** (505 سطر)  
قسم أحدث الكورسات: بيجيب الكورسات المنشورة ويعرضها كبطاقات تودي لصفحة التفاصيل.  
↳ يستورد: خدمات: courseService | أدوات: gradeUtils | مكونات/صفحات: EmptyState

**17. `src/Components/Books/BooksSection.jsx`** (163 سطر)  
قسم الكتب في الرئيسية: بيجيب الكتب ويعرض بطاقات BookCard.  
↳ يستورد: خدمات: bookService | مكونات/صفحات: BookCard

**18. `src/Components/Books/BookCard.jsx`** (81 سطر)  
بطاقة كتاب عامة: صورة وسعر وزر شراء (أو «غير متاح للشراء» لو المستر أوقفه).  
↳ يستورد: أدوات: gradeUtils

**19. `src/Components/StudentOpinions.jsx`** (247 سطر)  
قسم آراء الطلاب (نصوص ثابتة في الملف).

**20. `src/Components/Footer.jsx`** (565 سطر)  
تذييل الموقع: وصف المنصة وروابط التواصل والتنقل.


---

## المرحلة 2: الأساس اللي كل حاجة بتعتمد عليه (ثوابت، أدوات، داتا، خدمات)

لازم تفهمها قبل أي صفحة فيها منطق. الترتيب: ثوابت ← أدوات ← داتا تجريبية ← الخدمات الأساسية. الخدمات هي اللي هتتبدل بـ Supabase.

**21. `src/constants/statusLabels.js`** (69 سطر)  
كل نصوص الحالات العربية (مقبول، نشط، منتهي...) في مكان واحد.

**22. `src/utils/gradeUtils.jsx`** (5 سطر)  
دالة getGradeLabel: بتحوّل كود الصف (first-preparatory) لاسمه بالعربي.  
↳ يستورد: داتا: grades

**23. `src/utils/formatters.js`** (60 سطر)  
تنسيق التاريخ والوقت والسعر والحجم (MB/GB) وتحويل التاريخ لقيمة input.

**24. `src/utils/paginate.js`** (26 سطر)  
paginate: تقسيم قائمة لصفحات، وmatchesSearch: بحث نصي. بيستخدمهم كل service قائمة.

**25. `src/utils/downloadTextFile.js`** (13 سطر)  
تنزيل ملف نصي من المتصفح (تصدير CSV للنتائج).

**26. `src/utils/readImageFile.js`** (27 سطر)  
قراءة صورة من الجهاز مؤقتًا. هتتبدل برفع Cloudinary وقت الربط.

**27. `src/hooks/useAsyncData.js`** (33 سطر)  
hook للتحميل: loading أول مرة، error، وإلغاء عند الخروج. بتستخدمه صفحات المستر.

**28. `src/data/grades.jsx`** (34 سطر)  
الصفوف الدراسية الستة (إعدادي وثانوي).

**29. `src/data/students.jsx`** (11 سطر)  
طلاب تجريبيون (الاسم، الصف، الهاتف، ولي الأمر...).

**30. `src/data/courses.jsx`** (85 سطر)  
الكورسات التجريبية: العنوان والصف والصورة وخطط الاشتراك (شهري/ترم) وحقل النشر.

**31. `src/data/lessons.jsx`** (53 سطر)  
الوحدات ودروس كل وحدة (مصفوفة وحدات، وكل وحدة فيها مصفوفة دروس).

**32. `src/data/exams.jsx`** (76 سطر)  
الامتحانات: الكورس والوحدة والمدة ووقت البداية والنهاية وحالة النشر.

**33. `src/data/questions.jsx`** (344 سطر)  
أسئلة الامتحانات (اختيار، صح/خطأ، مقالي) وإجاباتها الصحيحة.

**34. `src/data/results.jsx`** (80 سطر)  
نتائج الطلاب: الدرجة، الإجابات، درجات المقالي، وحالة التصحيح.

**35. `src/data/enrollments.jsx`** (8 سطر)  
اشتراكات الطلاب في الكورسات: الخطة وتاريخ البداية والنهاية والحالة.

**36. `src/data/subscriptionRequests.jsx`** (5 سطر)  
طلبات الاشتراك (رقم الطلب، رقم التحويل، الحالة).

**37. `src/data/lessonAccess.jsx`** (6 سطر)  
صلاحيات الدروس الفردية الممنوحة لطلاب.

**38. `src/data/books.jsx`** (76 سطر)  
الكتب: العنوان والسعر والصورة وتوفر الشراء.

**39. `src/data/bookPurchaseRequests.jsx`** (5 سطر)  
طلبات شراء الكتب (الحالة قيد المراجعة/مقبول/مرفوض).

**40. `src/data/bookPurchases.jsx`** (26 سطر)  
سجل ملكية الكتب: مين اشترى إيه (منفصل عن الطلبات).

**41. `src/data/paymentMethods.jsx`** (11 سطر)  
وسائل الدفع (فودافون كاش: الرقم وواتساب الدعم).

**42. `src/data/chatMessages.jsx`** (44 سطر)  
رسائل تجريبية للمحادثة.

**43. `src/data/masterProfile.jsx`** (9 سطر)  
بيانات المستر (الاسم، رابط Telegram...). الـ Topbar بتقرا منها.

**44. `src/data/storageUsage.jsx`** (12 سطر)  
أرقام استهلاك المساحة التجريبية وحدود الخطط المجانية.

**45. `src/services/gradeService.jsx`** (5 سطر)  
getGrades: بترجع الصفوف.  
↳ يستورد: داتا: grades

**46. `src/services/studentService.jsx`** (36 سطر)  
getCurrentStudent (حاليًا أول طالب)، وجلب/تعديل/حذف الطلاب.  
↳ يستورد: داتا: students

**47. `src/services/courseService.jsx`** (71 سطر)  
الكورسات: للطالب المنشور بس، وللمستر كل الكورسات + إنشاء/تعديل/حذف.  
↳ يستورد: داتا: courses

**48. `src/services/lessonService.jsx`** (174 سطر)  
الوحدات والدروس: عرض للطالب + إنشاء/تعديل/حذف/ترتيب للمستر.  
↳ يستورد: داتا: lessons

**49. `src/services/examService.jsx`** (96 سطر)  
الامتحانات: للطالب المنشور بس، وللمستر كل العمليات.  
↳ يستورد: داتا: exams

**50. `src/services/questionService.jsx`** (110 سطر)  
الأسئلة: جلب، إضافة، تعديل، حذف، ترتيب.  
↳ يستورد: داتا: questions

**51. `src/services/resultService.jsx`** (141 سطر)  
النتائج: تسجيل تسليم الامتحان (مرة واحدة فقط)، جلب، حذف، تحديث.  
↳ يستورد: داتا: results

**52. `src/services/enrollmentService.jsx`** (125 سطر)  
الاشتراكات: isEnrollmentActive (التعريف الوحيد للاشتراك النشط)، إنشاء، تمديد، إنهاء.  
↳ يستورد: داتا: enrollments

**53. `src/services/subscriptionService.jsx`** (231 سطر)  
طلبات الاشتراك: إنشاء، قبول (بيفعّل الاشتراك)، رفض، حذف.  
↳ يستورد: داتا: subscriptionRequests | مكونات/صفحات: enrollmentService, lessonAccessService

**54. `src/services/lessonAccessService.jsx`** (115 سطر)  
صلاحيات الدروس: منح، جلب، سحب.  
↳ يستورد: داتا: lessonAccess

**55. `src/services/bookService.jsx`** (63 سطر)  
الكتب: جلب وإنشاء وتعديل وحذف، وisBookAvailable.  
↳ يستورد: داتا: books

**56. `src/services/bookPurchaseService.jsx`** (165 سطر)  
طلبات شراء الكتب: إنشاء (مع منع غير المتاح/المملوك)، قبول (بيسجل الملكية)، رفض، حذف.  
↳ يستورد: داتا: bookPurchaseRequests | مكونات/صفحات: bookService, bookPurchasesService

**57. `src/services/bookPurchasesService.jsx`** (71 سطر)  
سجل ملكية الكتب (حذف الطلب ما بيلغيها).  
↳ يستورد: داتا: bookPurchases

**58. `src/services/paymentMethodService.jsx`** (29 سطر)  
وسائل الدفع: جلب النشطة وتعديل بيانات الحساب.  
↳ يستورد: داتا: paymentMethods

**59. `src/services/chatService.jsx`** (34 سطر)  
رسائل المحادثة: جلب، إرسال، حذف الكل.  
↳ يستورد: داتا: chatMessages

**60. `src/services/masterProfileService.jsx`** (11 سطر)  
بيانات المستر: قراءة وتحديث.  
↳ يستورد: داتا: masterProfile


---

## المرحلة 3: صفحات الموقع العامة (كورسات وكتب واشتراك)

أول صفحات بتستخدم الخدمات: تفاصيل كورس ← الكتب ← شراء كتاب ← الاشتراك في كورس.

**61. `src/Components/CourseDetails.jsx`** (521 سطر)  
صفحة تفاصيل الكورس (/courses/:id): الوحدات والدروس وخطط الاشتراك، وبتفحص اشتراك الطالب.  
↳ يستورد: خدمات: studentService, courseService, enrollmentService, lessonService, lessonAccessService | أدوات: gradeUtils | مكونات/صفحات: Navbar, Footer

**62. `src/Page/Books.jsx`** (146 سطر)  
صفحة كل الكتب (/books) مع فلتر الصف. (بتستورد grades من data مباشرة: تتحول لـ getGrades.)  
↳ يستورد: خدمات: bookService | داتا: grades | مكونات/صفحات: Navbar, Footer, BookCard

**63. `src/Page/BookPurchase.jsx`** (544 سطر)  
صفحة شراء كتاب: بيانات الدفع ورقم التحويل وإرسال الطلب.  
↳ يستورد: خدمات: bookService, studentService, bookPurchaseService, paymentMethodService | مكونات/صفحات: Navbar, Footer

**64. `src/Page/Subscription.jsx`** (672 سطر)  
صفحة الاشتراك في كورس بخطة معينة: بيانات الدفع وإرسال طلب الاشتراك.  
↳ يستورد: خدمات: studentService, courseService, enrollmentService, subscriptionService, paymentMethodService | مكونات/صفحات: Navbar


---

## المرحلة 4: التسجيل والدخول

نموذجان بتحقق من المدخلات. لسه مش متوصلين بحساب حقيقي (ده شغل الربط بـ Supabase Auth).

**65. `src/Components/Signup.jsx`** (601 سطر)  
نموذج إنشاء حساب (تحقق من المدخلات). لسه مش بيحفظ طالب فعليًا: ينتظر الربط.  
↳ يستورد: داتا: grades

**66. `src/Components/Login.jsx`** (303 سطر)  
نموذج تسجيل الدخول (تحقق من المدخلات). لسه مش بيعمل دخول فعلي: ينتظر الربط.


---

## المرحلة 5: لوحة الطالب (/dashboard-student)

الهيكل ← الرئيسية ← الكورسات ← الدرس ← الامتحانات ← حل الامتحان ← النتيجة ← الكتب ← الملف الشخصي ← الدعم.

**67. `src/Components/DashboardStudent/DashboardLayout.jsx`** (24 سطر)  
هيكل لوحة الطالب: السايدبار + مكان الصفحات.  
↳ يستورد: مكونات/صفحات: Navbar, Footer, DashboardSidebar, Chat

**68. `src/Components/DashboardStudent/DashboardSidebar.jsx`** (157 سطر)  
قائمة لوحة الطالب الجانبية.

**69. `src/Components/DashboardStudent/EmptyState.jsx`** (33 سطر)  
رسالة «لا يوجد محتوى» للطالب.

**70. `src/Page/DashboardStudent/DashboardHome.jsx`** (416 سطر)  
رئيسية الطالب: ملخص كورساته وامتحاناته ونتائجه.  
↳ يستورد: خدمات: studentService, courseService, enrollmentService, examService, resultService | أدوات: gradeUtils | مكونات/صفحات: EmptyState

**71. `src/Page/DashboardStudent/DashboardCourses.jsx`** (218 سطر)  
كورسات الطالب المشترك فيها.  
↳ يستورد: خدمات: studentService, courseService, enrollmentService | أدوات: gradeUtils | مكونات/صفحات: EmptyState

**72. `src/Page/DashboardStudent/LessonPage.jsx`** (385 سطر)  
صفحة الدرس: الفيديو والملزمة وقائمة المحتوى (فيها روابط demo مؤقتة).  
↳ يستورد: خدمات: studentService, courseService, lessonService, examService, enrollmentService, lessonAccessService | مكونات/صفحات: LessonVideo, LessonMaterials, LessonContentList

**73. `src/Components/Lesson/LessonVideo.jsx`** (81 سطر)  
مشغّل فيديو YouTube: بيستخرج الـ Video ID ويعرضه في iframe.

**74. `src/Components/Lesson/LessonMaterials.jsx`** (62 سطر)  
زر تحميل الملزمة (بيحوّل رابط Google Drive لرابط تنزيل).

**75. `src/Components/Lesson/LessonContentList.jsx`** (169 سطر)  
قائمة وحدات ودروس الكورس بجانب الدرس.

**76. `src/Page/DashboardStudent/DashboardExams.jsx`** (267 سطر)  
قائمة امتحانات الطالب وحالتها (متاح/منتهي/تم الحل).  
↳ يستورد: خدمات: studentService, examService, resultService, enrollmentService, courseService | مكونات/صفحات: EmptyState, DashboardExamCard

**77. `src/Components/DashboardStudent/DashboardExamCard.jsx`** (128 سطر)  
بطاقة امتحان في قائمة الطالب.

**78. `src/Page/DashboardStudent/ExamInterface.jsx`** (477 سطر)  
شاشة حل الامتحان: المؤقت والتنقل والتسليم (مرة واحدة) وتسجيل النتيجة.  
↳ يستورد: خدمات: examService, questionService, studentService, enrollmentService, resultService | مكونات/صفحات: ExamQuestionCard, ExamQuestionNavigator, ExamTimer

**79. `src/Components/DashboardStudent/ExamTimer.jsx`** (90 سطر)  
مؤقت الامتحان.

**80. `src/Components/DashboardStudent/ExamQuestionNavigator.jsx`** (88 سطر)  
أرقام الأسئلة للتنقل السريع.

**81. `src/Components/DashboardStudent/ExamQuestionCard.jsx`** (249 سطر)  
عرض سؤال واحد بكل أنواعه (اختيار، صح/خطأ، مقالي).

**82. `src/Components/ExamResult.jsx`** (320 سطر)  
صفحة نتيجة الامتحان بعد التسليم (/exam-result/:id).  
↳ يستورد: خدمات: studentService, examService, resultService

**83. `src/Page/DashboardStudent/DashboardResults.jsx`** (326 سطر)  
كل نتائج الطالب.  
↳ يستورد: خدمات: studentService, resultService, examService, courseService | مكونات/صفحات: EmptyState, DashboardResultCard

**84. `src/Components/DashboardStudent/DashboardResultCard.jsx`** (76 سطر)  
بطاقة نتيجة.

**85. `src/Page/DashboardStudent/DashboardBooks.jsx`** (177 سطر)  
كتب الطالب وحالة شراء كل كتاب.  
↳ يستورد: خدمات: studentService, bookService, bookPurchaseService, bookPurchasesService | أدوات: gradeUtils | مكونات/صفحات: DashboardBookCard

**86. `src/Components/DashboardStudent/DashboardBookCard.jsx`** (103 سطر)  
بطاقة كتاب لطالب: شراء/قيد المراجعة/تم الشراء/مرفوض/غير متاح.  
↳ يستورد: أدوات: gradeUtils

**87. `src/Page/DashboardStudent/DashboardProfile.jsx`** (223 سطر)  
الملف الشخصي للطالب.  
↳ يستورد: خدمات: studentService | مكونات/صفحات: EmptyState

**88. `src/Page/DashboardStudent/DashboardSupport.jsx`** (220 سطر)  
صفحة الدعم (بتعرض مكوّن المحادثة).

**89. `src/Components/Chat.jsx`** (174 سطر)  
نافذة المحادثة (مساعد دراسي): جلب وإرسال رسائل.  
↳ يستورد: خدمات: chatService | مكونات/صفحات: ChatMessage

**90. `src/Components/Chat/ChatMessage.jsx`** (73 سطر)  
فقاعة رسالة واحدة.


---

## المرحلة 6: لوحة المستر - الهيكل والمكونات المشتركة (/dashboard-master)

اقرأها قبل أي صفحة مستر: كل صفحة بتبنيها منها. الترتيب: الهيكل ← الأنماط ← المكونات الصغيرة ← النوافذ.

**91. `src/Components/DashboardMaster/MasterLayout.jsx`** (35 سطر)  
هيكل لوحة المستر: السايدبار الثابت + الشريط العلوي + مكان الصفحات.  
↳ يستورد: مكونات/صفحات: MasterSidebar, MasterTopbar

**92. `src/Components/DashboardMaster/MasterSidebar.jsx`** (208 سطر)  
القائمة الجانبية (10 أقسام) وزر الهمبرجر على الموبايل وتسجيل الخروج.

**93. `src/Components/DashboardMaster/MasterTopbar.jsx`** (281 سطر)  
الرئيسية: Hero بصورة. باقي الصفحات: شريط رفيع باسم الصفحة. الاسم وTelegram من إعدادات المستر.  
↳ يستورد: خدمات: masterProfileService | hooks: useAsyncData

**94. `src/Components/DashboardMaster/Shared/masterStyles.js`** (27 سطر)  
كلاسات الأزرار والحقول والكروت المشتركة (الهوية في مكان واحد).

**95. `src/Components/DashboardMaster/Shared/MasterPageHeader.jsx`** (26 سطر)  
عنوان الصفحة + زر رجوع/إضافة.

**96. `src/Components/DashboardMaster/Shared/MasterStatCard.jsx`** (4 سطر)  
كارت رقم/إحصائية.

**97. `src/Components/DashboardMaster/Shared/MasterSearchFilters.jsx`** (24 سطر)  
شريط البحث والفلاتر.

**98. `src/Components/DashboardMaster/Shared/MasterPagination.jsx`** (64 سطر)  
التقسيم على صفحات (بتاخد itemLabel: طالب/كورس...).

**99. `src/Components/DashboardMaster/Shared/MasterStatusBadge.jsx`** (30 سطر)  
بادج الحالة الملون.

**100. `src/Components/DashboardMaster/Shared/MasterEmptyState.jsx`** (5 سطر)  
رسالة «لا توجد بيانات».

**101. `src/Components/DashboardMaster/Shared/MasterNotice.jsx`** (28 سطر)  
شريط نجاح/خطأ.

**102. `src/Components/DashboardMaster/Shared/MasterConfirmModal.jsx`** (9 سطر)  
نافذة تأكيد (للحذف والعمليات الخطرة).

**103. `src/Components/DashboardMaster/Shared/MasterModal.jsx`** (75 سطر)  
نافذة عامة للنماذج والتفاصيل.

**104. `src/Components/DashboardMaster/Shared/MasterField.jsx`** (78 سطر)  
حقل نموذج موحّد (نص/قائمة/نص طويل) مع رسالة خطأ.  
↳ يستورد: مكونات/صفحات: masterStyles

**105. `src/Components/DashboardMaster/Shared/MasterTabs.jsx`** (36 سطر)  
تبويبات (في صفحة الاشتراكات).

**106. `src/Components/DashboardMaster/Shared/MasterImageField.jsx`** (48 سطر)  
رفع صورة مؤقت (يتبدل بـ Cloudinary).  
↳ يستورد: أدوات: readImageFile

**107. `src/Page/DashboardMaster/MasterPlaceholder.jsx`** (35 سطر)  
صفحة «قيد التجهيز» لأي رابط ملوش صفحة.


---

## المرحلة 7: صفحات المستر، صفحة صفحة (كل صفحة وبعدها الـ service بتاعتها)

نفس ترتيب القائمة الجانبية. القاعدة: الصفحة عرض فقط، والـ master...Service هي العقل (بحث، فلاتر، حذف متسلسل، قبول، تصحيح).

**108. `src/Page/DashboardMaster/MasterHome.jsx`** (428 سطر)  
رئيسية المستر: إحصائيات، أشياء تحتاج إجراء، آخر النتائج والنشاطات.  
↳ يستورد: خدمات: masterDashboardService

**109. `src/services/masterDashboardService.jsx`** (138 سطر)  
بتجمع وتحسب ملخص الرئيسية.  
↳ يستورد: أدوات: gradeUtils | ثوابت: statusLabels | مكونات/صفحات: studentService, courseService, examService, resultService, enrollmentService, subscriptionService, bookPurchaseService

**110. `src/Page/DashboardMaster/MasterStudents.jsx`** (180 سطر)  
قائمة الطلاب: بحث وفلاتر وتقسيم وإحصائيات.  
↳ يستورد: خدمات: masterStudentsService | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterPagination, MasterPageHeader, MasterSearchFilters, MasterStatCard, MasterStatusBadge

**111. `src/Page/DashboardMaster/MasterStudentDetails.jsx`** (472 سطر)  
تفاصيل طالب: بياناته واشتراكاته ونتائجه وطلباته، وتعديل/حذف.  
↳ يستورد: خدمات: masterStudentsService | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterPageHeader, MasterStatusBadge

**112. `src/services/masterStudentsService.jsx`** (336 سطر)  
منطق صفحتي الطلاب (قائمة وتفاصيل وحذف متسلسل).  
↳ يستورد: أدوات: gradeUtils | ثوابت: statusLabels | مكونات/صفحات: studentService, courseService, examService, enrollmentService, resultService, subscriptionService, bookPurchaseService, lessonAccessService, bookService, gradeService, bookPurchasesService, lessonService

**113. `src/Page/DashboardMaster/MasterCourses.jsx`** (291 سطر)  
كروت الكورسات: نشر/إخفاء/حذف مع ملخص بالسجلات.  
↳ يستورد: خدمات: masterCoursesService | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatusBadge, masterStyles

**114. `src/Page/DashboardMaster/MasterCourseForm.jsx`** (153 سطر)  
إضافة/تعديل كورس (البيانات والأسعار والصورة).  
↳ يستورد: خدمات: masterCoursesService | hooks: useAsyncData | مكونات/صفحات: MasterField, MasterImageField, MasterNotice, MasterPageHeader, MasterEmptyState, masterStyles

**115. `src/Page/DashboardMaster/MasterCourseContent.jsx`** (461 سطر)  
إدارة وحدات ودروس كورس (ترتيب ↑↓، فيديو، ملزمة).  
↳ يستورد: خدمات: masterCoursesService | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterStatusBadge, masterStyles

**116. `src/services/masterCoursesService.jsx`** (436 سطر)  
منطق صفحات الكورسات والمحتوى والحذف المتسلسل.  
↳ يستورد: أدوات: gradeUtils, paginate | ثوابت: statusLabels | مكونات/صفحات: courseService, lessonService, examService, questionService, resultService, enrollmentService, subscriptionService, lessonAccessService, gradeService

**117. `src/Page/DashboardMaster/MasterExams.jsx`** (301 سطر)  
قائمة الامتحانات وإحصائياتها (حالة الوقت تتحسب تلقائيًا).  
↳ يستورد: خدمات: masterExamsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**118. `src/Page/DashboardMaster/MasterExamForm.jsx`** (167 سطر)  
إضافة/تعديل امتحان (الكورس والوحدة والوقت).  
↳ يستورد: خدمات: masterExamsService | hooks: useAsyncData | مكونات/صفحات: MasterEmptyState, MasterField, MasterNotice, MasterPageHeader, masterStyles

**119. `src/Page/DashboardMaster/MasterExamManage.jsx`** (651 سطر)  
إدارة أسئلة الامتحان + استيراد JSON بمعاينة.  
↳ يستورد: خدمات: masterExamsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterStatCard, MasterStatusBadge, masterStyles

**120. `src/services/masterExamsService.jsx`** (568 سطر)  
منطق الامتحانات والأسئلة واستيراد/فحص JSON.  
↳ يستورد: أدوات: gradeUtils, formatters, paginate | ثوابت: statusLabels | مكونات/صفحات: examService, questionService, resultService, courseService, lessonService, gradeService

**121. `src/Page/DashboardMaster/MasterResults.jsx`** (284 سطر)  
قائمة النتائج: فلاتر، تصدير CSV، حذف.  
↳ يستورد: خدمات: masterResultsService | أدوات: downloadTextFile, formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**122. `src/Page/DashboardMaster/MasterResultDetails.jsx`** (251 سطر)  
تفاصيل نتيجة وتصحيح الأسئلة المقالية.  
↳ يستورد: خدمات: masterResultsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterStatCard, MasterStatusBadge, masterStyles

**123. `src/services/masterResultsService.jsx`** (332 سطر)  
منطق النتائج والتصحيح (الدرجة النهائية = تلقائي + مقالي) والتصدير.  
↳ يستورد: أدوات: gradeUtils, formatters, paginate | ثوابت: statusLabels | مكونات/صفحات: resultService, studentService, courseService, examService, questionService, gradeService

**124. `src/Page/DashboardMaster/MasterSubscriptions.jsx`** (495 سطر)  
تبويبان: الاشتراكات (تمديد/إنهاء) وطلبات الاشتراك (قبول/رفض/حذف).  
↳ يستورد: خدمات: masterSubscriptionsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, MasterTabs, masterStyles

**125. `src/services/masterSubscriptionsService.jsx`** (263 سطر)  
منطق الاشتراكات والطلبات.  
↳ يستورد: أدوات: gradeUtils, paginate | ثوابت: statusLabels | مكونات/صفحات: subscriptionService, enrollmentService, studentService, courseService, paymentMethodService, gradeService

**126. `src/Page/DashboardMaster/MasterBookRequests.jsx`** (308 سطر)  
طلبات شراء الكتب: مراجعة وقبول ورفض وحذف.  
↳ يستورد: خدمات: masterBookRequestsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**127. `src/services/masterBookRequestsService.jsx`** (143 سطر)  
منطق طلبات الكتب.  
↳ يستورد: أدوات: gradeUtils, paginate | ثوابت: statusLabels | مكونات/صفحات: bookPurchaseService, bookPurchasesService, bookService, studentService, paymentMethodService, gradeService

**128. `src/Page/DashboardMaster/MasterBooks.jsx`** (327 سطر)  
كروت الكتب: متاح/غير متاح، معاينة، حذف.  
↳ يستورد: خدمات: masterBooksService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**129. `src/Page/DashboardMaster/MasterBookForm.jsx`** (131 سطر)  
إضافة/تعديل كتاب.  
↳ يستورد: خدمات: masterBooksService | hooks: useAsyncData | مكونات/صفحات: MasterEmptyState, MasterField, MasterImageField, MasterNotice, MasterPageHeader, masterStyles

**130. `src/services/masterBooksService.jsx`** (223 سطر)  
منطق الكتب والحذف المتسلسل.  
↳ يستورد: أدوات: gradeUtils, paginate | ثوابت: statusLabels | مكونات/صفحات: bookService, bookPurchasesService, bookPurchaseService, gradeService

**131. `src/Page/DashboardMaster/MasterLessonAccess.jsx`** (321 سطر)  
منح وسحب صلاحيات دروس فردية.  
↳ يستورد: خدمات: masterLessonAccessService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, masterStyles

**132. `src/services/masterLessonAccessService.jsx`** (129 سطر)  
منطق الصلاحيات مع منع التكرار.  
↳ يستورد: أدوات: gradeUtils, paginate | ثوابت: statusLabels | مكونات/صفحات: lessonAccessService, lessonService, courseService, studentService, gradeService

**133. `src/Page/DashboardMaster/MasterSettings.jsx`** (361 سطر)  
الحساب، كلمة المرور، بيانات الدفع، المساحة المستخدمة، حذف المحادثات.  
↳ يستورد: خدمات: masterSettingsService | أدوات: formatters | hooks: useAsyncData | مكونات/صفحات: MasterConfirmModal, MasterEmptyState, MasterField, MasterNotice, MasterPageHeader, masterStyles

**134. `src/services/masterSettingsService.jsx`** (89 سطر)  
منطق الإعدادات والتحقق من المدخلات.  
↳ يستورد: مكونات/صفحات: masterProfileService, paymentMethodService, chatService, masterStorageService

**135. `src/services/masterStorageService.jsx`** (23 سطر)  
أرقام المساحة (تجريبية) بنفس شكل الربط النهائي.  
↳ يستورد: داتا: storageUsage | ثوابت: statusLabels


---

## ملحق: الصور (assets) والملفات العامة

- `src/assets/Background/`: 11 ملف (1.jpg, Login.webp, Result Exam.jpg, bg1.png, bg2.webp, coureses.webp, dashbord student 1.webp, dashbord student 2.webp, dashbord student home.webp, hero-bg.webp, signup.jpg)
- `src/assets/Books/`: 6 ملف (book1.jpeg, book2.jpeg, book3.webp, book4.jpeg, book5.jpeg, book6.webp)
- `src/assets/Logo/`: 2 ملف (logo.jpeg, transparent-Logo.png)
- `src/assets/Master/`: 7 ملف (Master transparent.png, master 1.webp, master 2.webp, master 3.webp, master no transparent.jpeg, master-home.png, master.webp)
- `public/`: Imgs-plan, Imgs-websit
