# 🗺️ خريطة مشروع منصة "الغازي في التاريخ"

## 🛠️ المرحلة 1: التجهيز وإعداد البيئة (Setup)

- تثبيت React (Vite) + JavaScript + Tailwind CSS.
- تثبيت المكتبات الأساسية: React Router, Supabase Client, Cloudinary, React Icons.
- إنشاء مشروع Supabase وتجهيز الـ Environment Variables (.env).
- إعداد هيكل المجلدات (Components, Pages, Context, Assets).

## 🎨 المرحلة 2: بناء الواجهات (UI/UX) - هنبدأها بالصور

_(هنشتغل في كل صفحة لحد ما نخلصها بناءً على الصور اللي هتبعتها)_

### أ. الواجهات العامة (Public):

- الصفحة الرئيسية (Landing Page) + سكشن "عن المدرس".
- صفحة تسجيل الدخول (Login).
- صفحة إنشاء حساب جديد (Sign Up).

### ب. واجهات الطالب (Student):

1. داش بورد الطالب.
2. صفحة الكورسات (كورساتي + المتاحة).
3. صفحة تفاصيل الكورس.
4. صفحة الدرس (مشغل الفيديو + القائمة الجانبية).
5. صفحة الامتحانات.
6. واجهة حل الامتحان.
7. صفحة نتيجة الامتحان.
8. صفحة الاشتراك والدفع (تعليمات فودافون كاش + إدخال الكود).
9. صفحة حسابي (My Account).
10. صفحة الدعم والمساعدة (Chat + FAQ).

### ج. واجهات المدرس (Teacher Dashboard):

11. داش بورد المدرس.
12. إدارة الطلاب.
13. إدارة الكورسات والمحتوى (وحدات، دروس، رفع ملفات).
14. إدارة الامتحانات (إنشاء وتعديل).
15. إدارة طلبات الاشتراك (تفعيل الأكواد).
16. صندوق الرسائل (Inbox).

## 🗄️ المرحلة 3: الباك إند وقاعدة البيانات (Supabase Backend)

- **الجداول (Tables):** Users/Profiles, Courses, Units, Lessons, Exams, Questions, Results, Activation_Codes, Subscriptions, Messages.
- **الأتمتة (Triggers):** إنشاء Profile تلقائي عند تسجيل حساب جديد.
- **الأمان الصارم (RLS Policies):** تطبيق قواعد الحماية على كل الجداول (طالب يشوف بس، مدرس يعدل ويحذف).

## 🔗 المرحلة 4: الربط والمنطق البرمجي (Integration)

- إعداد Auth Context و Protected Routes (حماية الصفحات).
- ربط تسجيل الدخول وإنشاء الحساب بـ Supabase.
- برمجة منطق أكواد التفعيل (توليد، تحقق، تفعيل اشتراك).
- ربط الداش بوردات بالبيانات الحقيقية (جلب الكورسات، الامتحانات، إلخ).
- برمجة نظام الشات (إرسال واستقبال الرسائل).

## 🛡️ المرحلة 5: الأمان والحماية (Security - الخط الأحمر)

- **منع مشاركة الحسابات:** تفعيل نظام الجلسة الواحدة (Single Session).
- **حماية الفيديوهات:** منع Right-Click، إخفاء روابط YouTube، والتحقق من الاشتراك قبل التحميل.
- **Edge Functions:** نقل العمليات الحساسة (زي رفع الصور لـ Cloudinary) للسيرفر لحماية الـ API Keys.

## 🚀 المرحلة 6: النشر والإطلاق (Deployment)

- رفع المشروع على Cloudflare Pages.
- ربط الدومين (المجاني أو المدفوع لاحقاً).
- اختبار نهائي للأمان والسرعة على الموبايل والكمبيوتر.

############################################################

# الغازي في التاريخ — UI Design System Brief #The Promt

Create a complete, high-end desktop UI design system and a full set of cohesive web interface screens for a modern Egyptian educational platform called **"الغازي في التاريخ"**, owned and taught by **Mohamed Khaled**.

## ⚠️ IMPORTANT

- This is a **VISUAL UI DESIGN TASK ONLY**.
- Generate polished **UI DESIGN IMAGES**, not code.
- Do **NOT** output HTML, CSS, React, JavaScript, wireframes, or programming instructions.
- The final result must look like a real, production-ready premium educational website that a professional UI/UX designer could hand to a developer.

## Brand References

Use the attached images as brand references:

- The attached images contain the official "الغازي في التاريخ" logo, photos of the teacher Mohamed Khaled, educational book/course artwork, and visual references related to the brand.
- Use these uploaded images as references for the brand identity, teacher appearance, logo, books, and overall visual direction.
- Do not redesign or replace the official logo.
- Do not invent a different teacher identity.
- Use the teacher's provided photos naturally and professionally where appropriate.

## Platform Identity

- **Brand name:** "الغازي في التاريخ"
- **Teacher:** Mohamed Khaled
- **Target audience:** Egyptian middle-school and high-school students.

The platform teaches:

- Social Studies for all Egyptian middle-school grades.
- History for all Egyptian high-school grades.

## Language

- Arabic only.
- Full RTL Arabic interface.
- All navigation, buttons, labels, headings, cards, forms, menus, and interface text must be in natural Egyptian/Modern Standard Arabic suitable for an Egyptian educational platform.
- Do not use English UI labels anywhere.

## Design Direction

Modern · Premium · Elegant · Professional · Educational · Historical · Contemporary · Sophisticated · Clean · Easy to understand.

- Not childish.
- Not cartoonish.
- Not game-like.
- Not visually crowded.
- Not old-fashioned.
- Do not make the website look like a museum website.
- Instead, create a modern educational SaaS-style interface with a subtle historical identity.

## Theme

Dark mode only. The primary visual identity should be based on deep midnight navy and charcoal tones rather than pure black.

**Suggested visual palette:**

- Deep Midnight Navy for main backgrounds.
- Dark charcoal/navy surfaces for cards and panels.
- Refined antique gold / muted metallic gold as the primary accent.
- Warm off-white / light gray for primary text.
- Muted gray for secondary text.
- Very subtle bronze/brown tones only where they support the historical atmosphere.

Notes:

- Use gold carefully and intentionally.
- Gold should feel premium and historical, not excessive.
- Do not make the entire interface gold.
- Do not use bright neon colors.
- Do not use excessive gradients.
- Maintain excellent contrast and readability.

## Visual Atmosphere

Create a subtle cinematic historical atmosphere inspired by history, Egyptian heritage, old maps, manuscripts, ancient architecture, parchment textures, historical books, monuments, and archival materials.

However, historical elements must remain subtle and elegant. They should support the UI instead of overpowering it.

For backgrounds or visual elements where no supplied image exists, generate original high-quality historical visuals that match the brand identity. Examples include:

- dark cinematic historical maps
- subtle parchment textures
- silhouettes of historical architecture
- ancient Egyptian-inspired architectural details
- historical books
- elegant archival textures
- atmospheric historical scenes
- subtle golden particles or light
- classical historical objects

Do **NOT** use random generic stock photography.
Do **NOT** overload screens with historical decorations.
Do **NOT** make backgrounds visually noisy.
Keep all important UI content highly readable.

## Typography

Use a modern premium Arabic font style with excellent readability. The typography must feel contemporary and professional.

Use strong hierarchy between:

- large headings
- section headings
- body text
- labels
- buttons
- metadata

Avoid decorative Arabic fonts that reduce usability.

## UI Component Style

- Elegant rounded cards.
- Moderate corner radius.
- Clean spacing.
- Premium buttons.
- Subtle borders.
- Soft shadows.
- Clear visual hierarchy.
- Consistent iconography.
- Modern Arabic RTL navigation.
- Consistent components across every screen.
- Minimal but refined micro-interaction visual cues.
- Avoid excessive glassmorphism.
- Avoid excessive neumorphism.
- Avoid huge cards.
- Avoid unnecessary widgets.

The entire website must feel like **ONE coherent product**.

## Desktop Format

- Design all screens specifically for desktop computer displays.
- Use a wide 16:9 desktop composition.
- Target approximately 1920 × 1080 visual proportions.
- Do not design mobile screens.
- Do not create phone mockups.
- Do not create tablet layouts.

## Important UI Principle

Keep the interface simple. Do not invent complicated features. Do not add unnecessary dashboards, analytics, tracking systems, notifications, achievement systems, search systems, favorites, certificates, parent accounts, or other features not specified below.

---

## Screen 1 — Home / Landing Page

Create a premium, visually impressive landing page for "الغازي في التاريخ".

The page should contain:

**1. Hero / Cover Section**

- Official "الغازي في التاريخ" logo.
- Mohamed Khaled's provided photo used professionally.
- Strong Arabic headline introducing the platform.
- Short educational value proposition.
- Primary CTA for starting/registering.
- Secondary CTA for exploring courses.
- Cinematic historical visual background.
- Strong dark navy and antique gold identity.
- Excellent visual hierarchy.
- The hero should immediately communicate: history + education + premium quality.

**2. About Mohamed Khaled**

A major and visually important section. Use the provided teacher photo. Show:

- Mohamed Khaled
- Brief professional educational introduction.
- His teaching subjects and target grades.
- A premium editorial composition combining the teacher image with subtle historical elements.

This section should feel trustworthy and important, not like a generic "About us" block.

**3. Subjects and Grades**

Clearly communicate:

- Social Studies — middle school
- History — high school

Show the relevant Egyptian school grades in a clean visual structure.

**4. Courses**

Show selected course cards using the provided book/course visual references where appropriate. Course cards should feel premium and educational. Do not overcrowd the section.

**5. Why "الغازي في التاريخ"**

A simple, elegant section communicating the main benefits of learning through the platform. Keep it concise and visual. Do not create complicated feature grids.

**6. Student Testimonials**

Create a premium testimonials section featuring:

- أحمد أشرف
- مروان محمد
- محمد عماد

Do not use real-person identification or imply that generated avatar portraits are the actual students. Use elegant abstract avatars, initials, or generic student avatar representations. Keep testimonials visually believable but concise.

**7. Final CTA**

A strong but clean call-to-action encouraging students to start learning.

**8. Footer**

A complete premium footer containing:

- Official logo
- Platform name
- Important navigation links
- WhatsApp
- Facebook
- Instagram
- Contact information area
- Copyright

Maintain the same dark navy and gold identity.

---

## Screen 2 — Login

Create a clean Arabic RTL login screen.

Include:

- Official logo
- Welcome message
- Username/login field
- Password field
- Login button
- Link to create a new account
- Elegant historical visual treatment
- Dark premium layout
- Minimal distractions

Do **NOT** include a forgot-password feature.

---

## Screen 3 — Sign Up

Create a modern Arabic RTL registration screen.

Include:

- Name
- Login/contact information required by the platform
- Password
- Confirm password
- Mandatory school grade selection

**Grade options:**

Middle School:

- الصف الأول الإعدادي
- الصف الثاني الإعدادي
- الصف الثالث الإعدادي

High School:

- الصف الأول الثانوي
- الصف الثاني الثانوي
- الصف الثالث الثانوي

Make grade selection clear and easy.

---

## Screen 4 — Student Dashboard

Create a clean and useful student dashboard.

Do **NOT** overload the dashboard.

Include only useful high-level information such as:

- Greeting using a sample student name such as "محمد سامي"
- Student grade
- Enrolled courses
- Simple course information
- Available exams
- A very small, subtle gamification/achievement element if it naturally fits
- Simple access to support/chat
- Clear navigation

Do not create a complicated analytics dashboard. Do not create a dedicated progress system. Do not create an announcements system. Do not create excessive statistics. The dashboard should feel calm, organized, premium, and easy for a student to understand immediately.

---

## Screen 5 — Courses

Create the main courses browsing screen.

The page should contain:

- "كورساتي" for courses the student already has access to.
- Available courses the student can subscribe to.
- Courses organized logically according to the student's grade and subject.
- Course cards using suitable book/course imagery.
- Clear course title.
- Grade.
- Subject.
- Subscription information.
- Clean CTA.

Do not create a search system. Do not add unnecessary filters. Keep the page simple.

---

## Screen 6 — Course Details

Create a premium course details page.

Include:

- Course cover artwork.
- Course title.
- Teacher name: محمد خالد.
- Grade and subject.
- Short course description.
- Course content structure.
- Units and lessons.
- Videos.
- PDF/material indicators.
- Exams.
- Subscription CTA.

For a student who already has access, show a clear learning CTA instead of a purchase CTA.

---

## Screen 7 — Lesson / Video

Create the main lesson learning interface.

Include:

- Large YouTube video player area.
- Lesson title.
- Course/unit context.
- RTL lesson navigation.
- Lesson list/sidebar.
- Available PDF/materials.
- Previous and next lesson controls.

Keep it simple. The video is the main focus. Do not add complicated video tracking features. Do not create restrictions around skipping video. Do not create excessive analytics.

---

## Screen 8 — Exams

Create a clean student exams page.

Show exam cards with:

- Exam name.
- Related course/unit.
- Number of questions.
- Score information where appropriate.
- Exam status.
- Start exam button.

Only support:

- Multiple choice.
- True / False.

---

## Screen 9 — Exam Interface

Create a professional Arabic RTL exam interface.

Include:

- Question.
- Multiple-choice answers.
- True/False questions.
- Question numbering.
- Previous/next controls.
- Clear submit button.
- Simple clean structure.

Avoid unnecessary complexity.

---

## Screen 10 — Exam Result

Create a clean result screen.

Show:

- Final score.
- Percentage.
- Correct answers.
- Incorrect answers.
- Clear result status.
- Simple option to review answers if appropriate.

Keep it visually simple and encouraging without making it look like a game.

---

## Screen 11 — Subscription / Payment Flow

Create the subscription experience for paid courses.

**Subscription options:**

- Monthly subscription.
- Term subscription.

The student selects a plan and sees simple Vodafone Cash payment instructions.

Show:

- Selected course.
- Selected subscription type.
- Price.
- Vodafone Cash payment instructions.
- "تم الدفع" / payment confirmation action.

**After submitting payment**, show a clean confirmation state:

- Payment request submitted.
- Unique order/reference number such as #MK-2847.
- Status: "في انتظار المراجعة".
- WhatsApp contact action.

The reference number is only a payment/order reference, **NOT** an access code.

---

## Screen 12 — My Account

Create one unified account page instead of separate profile and settings pages.

Include:

- Student profile information.
- Name.
- Profile image/avatar.
- Grade.
- Account information.
- Password management.
- Active subscriptions.
- Subscription status.
- Subscription dates.
- Appearance/theme controls.

Keep it organized with sections or tabs if necessary, but do not create a cluttered page.

---

## Screen 13 — Support & Help

Create a unified support center.

Include:

- FAQ / frequently asked questions.
- Simple categories or expandable questions.
- Contact options:
  - WhatsApp
  - Facebook
  - Instagram
- In-platform chat with the platform support/team.

Do not create separate FAQ, contact, and chat pages. Keep everything simple and accessible.

---

## Screen 14 — Teacher Dashboard

Create a professional dashboard specifically for Mohamed Khaled.

It should feel like a teacher/content-management dashboard, not a generic corporate admin dashboard.

Include simple useful information:

- Students.
- Active subscriptions.
- New subscription requests.
- Courses.
- Exams.
- Recent useful activity.

Avoid complicated analytics.

---

## Screen 15 — Students Management

Create a teacher-side student management interface.

Show:

- Student name.
- Grade.
- Enrolled courses.
- Subscription status.
- Basic student information.

Allow the teacher to open a student's details in a clean interface.

Do not create unnecessary analytics.

---

## Screen 16 — Courses & Content Management

Create one unified teacher interface for managing courses and course content.

Mohamed Khaled should be able to manage:

- Courses.
- Units.
- Lessons.
- YouTube unlisted video links.
- PDF files.
- Lesson questions/materials.
- Course organization.

Keep the interface practical and easy for a teacher to use. Do not make it overly technical.

---

## Screen 17 — Exams Management

Create the teacher exam-management interface.

Mohamed Khaled can:

- Create an exam.
- Choose the course/unit.
- Add multiple-choice questions.
- Add True/False questions.
- Define the correct answer.
- Set the score.
- Edit exams.
- Publish/hide exams.

Make automatic grading visually understandable.

---

## Screen 18 — Subscription Requests

Create the teacher interface for reviewing payment/subscription requests.

Show request cards or a clean table containing:

- Student name.
- Grade.
- Course.
- Monthly or term subscription.
- Amount.
- Request status.

Each pending request should have clear actions:

- قبول وتفعيل
- رفض

When the teacher accepts the payment, the student's subscription becomes active and the course becomes accessible.

Keep this interface extremely clear and easy to operate.

---

## Teacher Messages / Inbox

Do not create a completely separate complex messaging product.

Include a simple messages/inbox area within the teacher dashboard/navigation where Mohamed Khaled can view and respond to student support conversations.

For the student, chat access should remain part of the Support & Help experience.

---

## Global Navigation

Create a consistent RTL navigation system across the platform.

**Student navigation** should remain simple and include the most important areas such as:

- الرئيسية
- الكورسات
- الامتحانات
- حسابي
- الدعم

**Teacher navigation** should include:

- لوحة التحكم
- الطلاب
- الكورسات والمحتوى
- الامتحانات
- طلبات الاشتراك
- الرسائل

Use the official logo appropriately.

---

## Visual Consistency

All 18 screens must clearly look like parts of the same product.

Maintain:

- Same color system.
- Same typography.
- Same card language.
- Same button language.
- Same spacing system.
- Same icon style.
- Same navigation.
- Same RTL behavior.
- Same historical visual atmosphere.
- Same premium dark navy + antique gold identity.

Do not randomly change styles between screens.

---

## Image Generation Rules

Use the supplied teacher and brand images wherever they are relevant.

For missing visual assets, generate original visuals that match the identity.

Historical backgrounds should be:

- cinematic
- elegant
- subtle
- premium
- educational
- historically inspired
- visually coherent with the attached brand images

Examples: dark historical maps, old manuscripts, archival paper, historical architecture, ancient Egyptian-inspired details, books, monuments, subtle golden light, atmospheric historical scenes.

Do not use cartoon characters. Do not use childish illustrations. Do not use generic colorful education stock imagery. Do not fill every section with an image. Use imagery strategically.

---

## Final Output

Present the complete design as a cohesive collection of high-fidelity desktop UI screens.

Each screen should be visually distinct and readable while clearly belonging to the same design system.

**Prioritize:**

1. Beautiful visual hierarchy.
2. Professional UX.
3. Strong Arabic RTL layout.
4. Premium historical identity.
5. Simplicity.
6. Realistic educational content.
7. Consistency between all screens.
8. Clean, production-ready UI appearance.

The result must look like a real premium Egyptian educational platform called **"الغازي في التاريخ"**, not a generic AI-generated website.
