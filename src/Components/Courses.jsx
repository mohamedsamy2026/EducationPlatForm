// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import {
  faGraduationCap,
  faClock,
  faBookOpen,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// React Router
import { Link } from "react-router-dom";

// Images
import Master1 from "../assets/Master/master 1.webp";
import Master2 from "../assets/Master/master 2.webp";
import Master3 from "../assets/Master/master 3.webp";

/*
|--------------------------------------------------------------------------
| Mock Courses
|--------------------------------------------------------------------------
| دي بيانات مؤقتة للتصميم والتجربة.
| لاحقًا عند الربط بـ Supabase هنستبدل مصدر البيانات فقط،
| والـ UI نفسه يفضل شغال بدون الحاجة لإعادة تصميم الكارت.
|--------------------------------------------------------------------------
*/

const courses = [
  {
    id: "social-studies-preparatory",
    title: "الدراسات الاجتماعية للمرحلة الإعدادية",
    description:
      "شرح مبسط ومنظم يساعدك على فهم الدروس وربط الأحداث بطريقة سهلة وشيقة.",
    grade: "المرحلة الإعدادية",
    duration: "كورس شامل",
    image: Master1,
  },
  {
    id: "history-secondary",
    title: "التاريخ للمرحلة الثانوية",
    description:
      "شرح التاريخ بطريقة واضحة مع التركيز على أهم الأحداث والنقاط التي تحتاجها في دراستك.",
    grade: "المرحلة الثانوية",
    duration: "كورس شامل",
    image: Master2,
  },
  {
    id: "history-different-way",
    title: "التاريخ بطريقة مختلفة",
    description:
      "محتوى تعليمي منظم يساعدك على تثبيت المعلومات وفهم التاريخ بصورة أعمق.",
    grade: "محتوى تعليمي",
    duration: "دروس متكاملة",
    image: Master3,
  },
];

export default function Courses() {
  return (
    <section
      id="courses"
      dir="rtl"
      className="
        relative
        overflow-hidden
        bg-midnight
        px-4
        py-24
        sm:px-6
        lg:px-8
      "
    >
      {/* =========================================================
          Background Decoration
      ========================================================= */}

      {/* Main Gold Glow */}
      <div
        className="
          pointer-events-none
          absolute
          right-1/2
          top-20
          h-80
          w-80
          translate-x-1/2
          rounded-full
          bg-gold/5
          blur-[130px]
        "
      />

      {/* Navy Glow - Left */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-20
          left-0
          h-72
          w-72
          rounded-full
          bg-[#10243a]/50
          blur-[120px]
        "
      />

      {/* Top Transition */}
      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-24
          bg-gradient-to-b
          from-midnight
          to-transparent
        "
      />

      {/* Bottom Transition */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-midnight
          to-transparent
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =========================================================
            Section Heading
        ========================================================= */}

        <div className="mx-auto mb-14 max-w-2xl text-center">
          {/* Section Label */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-l from-gold to-transparent" />

            <span className="text-xs font-bold tracking-[0.25em] text-gold">
              محتوى تعليمي
            </span>

            <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
          </div>

          {/* Heading */}
          <h2
            className="
              mb-4
              text-3xl
              font-extrabold
              leading-tight
              text-warm-white
              sm:text-4xl
              md:text-5xl
            "
          >
            أحدث الكورسات
          </h2>

          {/* Description */}
          <p className="text-sm leading-8 text-white/60 sm:text-base">
            اختر الكورس المناسب لك وابدأ رحلتك في تعلم التاريخ بطريقة مختلفة، مع
            شرح مبسط يساعدك على الفهم وليس الحفظ فقط.
          </p>
        </div>

        {/* =========================================================
            Courses
        ========================================================= */}

        {courses.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {courses.map((course) => (
              <article
                key={course.id}
                className="
                  group
                  relative
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0c1a2b]
                  shadow-[0_15px_45px_rgba(0,0,0,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-gold/35
                  hover:shadow-[0_25px_60px_rgba(0,0,0,0.30)]
                "
              >
                {/* =================================================
                    Course Image
                ================================================= */}

                <div className="relative aspect-video overflow-hidden bg-[#071321]">
                  <img
                    src={course.image}
                    alt={`صورة ${course.title}`}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-[1.035]
                    "
                  />

                  {/* Image Overlay */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#071321]/85
                      via-[#071321]/10
                      to-transparent
                    "
                  />

                  {/* Image Top Shine */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      top-0
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-gold/40
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  {/* Grade Badge */}
                  <div
                    className="
                      absolute
                      bottom-4
                      right-4
                      rounded-lg
                      border
                      border-gold/30
                      bg-[#071321]/85
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-gold
                      shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                      backdrop-blur-sm
                    "
                  >
                    {course.grade}
                  </div>
                </div>

                {/* =================================================
                    Course Content
                ================================================= */}

                <div className="flex flex-1 flex-col p-6">
                  {/* Course Label */}
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-gold
                        shadow-[0_0_10px_rgba(212,175,55,0.65)]
                      "
                    />

                    <span className="text-xs font-bold text-gold/75">
                      كورس تعليمي
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="
                      mb-4
                      min-h-[4rem]
                      text-xl
                      font-extrabold
                      leading-8
                      text-warm-white
                      transition-colors
                      duration-300
                      group-hover:text-gold
                      sm:text-2xl
                    "
                  >
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="
                      mb-6
                      min-h-[5.25rem]
                      text-sm
                      leading-7
                      text-white/55
                      sm:text-base
                    "
                  >
                    {course.description}
                  </p>

                  {/* Divider */}
                  <div
                    className="
                      mb-5
                      h-px
                      w-full
                      bg-gradient-to-l
                      from-transparent
                      via-white/10
                      to-transparent
                    "
                  />

                  {/* =================================================
                      Course Info
                  ================================================= */}

                  <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {/* Content Type */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/55 sm:text-sm">
                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          bg-gold/10
                          text-gold
                        "
                      >
                        <FontAwesomeIcon icon={faBookOpen} />
                      </span>

                      <span>محتوى تعليمي</span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/55 sm:text-sm">
                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          bg-gold/10
                          text-gold
                        "
                      >
                        <FontAwesomeIcon icon={faClock} />
                      </span>

                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* =================================================
                      Course Button
                  ================================================= */}

                  <Link
                    to={`/courses/${course.id}`}
                    className="
                      mt-auto
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-xl
                      bg-gold
                      px-5
                      py-3.5
                      text-sm
                      font-extrabold
                      text-midnight
                      shadow-[0_8px_25px_rgba(212,175,55,0.10)]
                      transition-all
                      duration-300
                      hover:gap-5
                      hover:bg-gold-light
                      hover:shadow-[0_12px_30px_rgba(212,175,55,0.20)]
                    "
                  >
                    <span>عرض الكورس</span>

                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Link>
                </div>

                {/* Bottom Accent */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-gold
                    transition-all
                    duration-500
                    group-hover:w-1/2
                  "
                />
              </article>
            ))}
          </div>
        ) : (
          /* =========================================================
             Empty State
          ========================================================= */

          <div
            className="
              mx-auto
              max-w-2xl
              rounded-2xl
              border
              border-white/10
              bg-[#0c1a2b]/80
              px-6
              py-16
              text-center
              shadow-[0_20px_50px_rgba(0,0,0,0.20)]
              backdrop-blur-sm
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-gold/20
                bg-gold/10
                text-2xl
                text-gold
              "
            >
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>

            <h3 className="mb-3 text-xl font-extrabold text-warm-white">
              لا توجد كورسات حاليًا
            </h3>

            <p className="text-sm leading-7 text-white/50">
              سيتم إضافة الكورسات التعليمية هنا قريبًا.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          Section Bottom Line
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-gold/15
          to-transparent
        "
      />
    </section>
  );
}
