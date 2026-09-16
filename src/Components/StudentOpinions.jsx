// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import { faQuoteRight, faStar } from "@fortawesome/free-solid-svg-icons";

const testimonials = [
  {
    id: 1,
    name: "محمد عماد",
    initials: "م ع",
    review:
      "شرح مستر محمد خالد بسيط وواضح جدًا، وبقيت أفهم الأحداث وأربط بينها بسهولة.",
  },
  {
    id: 2,
    name: "مروان محمد",
    initials: "م م",
    review:
      "أكثر شيء عجبني هو طريقة عرض المعلومات، لأنها بتخلّي المذاكرة أسهل والمراجعة أسرع.",
  },
  {
    id: 3,
    name: "احمد اشرف",
    initials: "أ أ",
    review:
      "الشرح ساعدني أراجع أهم النقاط وأدخل الامتحان وأنا فاهم المنهج وواثق من إجاباتي.",
  },
];

export default function StudentOpinions() {
  return (
    <section
      dir="rtl"
      id="StudentOpinions"
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

      <div className="pointer-events-none absolute right-1/2 top-20 h-72 w-72 translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#10243a]/50 blur-[100px]" />

      {/* =========================================================
          Content
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =======================================================
            Section Heading
        ======================================================= */}

        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-l from-gold to-transparent" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              تجارب الطلاب
            </span>

            <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
          </div>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-warm-white sm:text-4xl md:text-5xl">
            آراء طلابنا
          </h2>

          <p className="text-sm leading-8 text-white/60 sm:text-base">
            تجارب حقيقية من طلابنا عن رحلتهم في تعلم التاريخ
          </p>
        </div>

        {/* =======================================================
            Testimonials
        ======================================================= */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((student) => (
            <article
              key={student.id}
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
                bg-charcoal/70
                p-7
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-gold/30
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
              "
            >
              {/* Top Gold Accent */}
              <div
                className="
                  absolute
                  right-0
                  top-8
                  h-12
                  w-1
                  rounded-l-full
                  bg-gold/70
                "
              />

              {/* Quote Icon */}

              <div
                className="
                  absolute
                  left-6
                  top-6
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gold/15
                  bg-gold/5
                  text-gold
                  transition-all
                  duration-300
                  group-hover:border-gold/30
                  group-hover:bg-gold/10
                "
              >
                <FontAwesomeIcon icon={faQuoteRight} className="text-sm" />
              </div>

              {/* =================================================
                  Review
              ================================================= */}

              <div className="relative mb-8 w-[86%]">
                <p
                  className="
                    text-sm
                    leading-8
                    text-white/75
                    sm:text-base
                  "
                >
                  {student.review}
                </p>
              </div>

              {/* Divider */}

              <div className="mb-6 h-px w-full bg-gradient-to-l from-transparent via-white/10 to-transparent" />

              {/* =================================================
                  Student Info
              ================================================= */}

              <div className="mt-auto flex items-center gap-4">
                {/* Initials */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gold/30
                    bg-gradient-to-br
                    from-gold/20
                    to-gold/5
                    text-base
                    font-extrabold
                    text-gold
                    shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                  "
                >
                  {student.initials}
                </div>

                {/* Name */}

                <div>
                  <h3
                    className="
                      text-base
                      font-extrabold
                      text-warm-white
                      transition-colors
                      duration-300
                      group-hover:text-gold
                      sm:text-lg
                    "
                  >
                    {student.name}
                  </h3>

                  <span className="text-xs text-white/40 sm:text-sm">
                    من طلاب مستر محمد خالد
                  </span>
                </div>
              </div>

              {/* =================================================
                  Stars
              ================================================= */}

              <div className="mt-5 flex items-center gap-1 text-sm text-gold/90">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* =========================================================
          Bottom Line
      ========================================================= */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
    </section>
  );
}
