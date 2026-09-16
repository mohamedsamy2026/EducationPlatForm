import MasterImg from "../assets/Master/master no transparent.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBookOpen,
  faGraduationCap,
  faFileLines,
  faChalkboardTeacher,
  faCircleCheck,
  faVideo,
  faClipboardCheck,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function AboutPlatform() {
  const learningFeatures = [
    {
      icon: faBookOpen,
      text: "فهم الأحداث بطريقة سهلة ومبسطة",
    },
    {
      icon: faGraduationCap,
      text: "الاستعداد للامتحانات بثقة",
    },
    {
      icon: faCircleCheck,
      text: "التركيز على أهم النقاط والأسئلة",
    },
    {
      icon: faLayerGroup,
      text: "ترتيب المحتوى بطريقة منظمة",
    },
  ];

  const platformFeatures = [
    {
      icon: faFileLines,
      text: "شرح ودروس منظمة باستمرار",
    },
    {
      icon: faChalkboardTeacher,
      text: "محتوى تعليمي مناسب لكل صف",
    },
    {
      icon: faVideo,
      text: "فيديوهات ودروس تعليمية واضحة",
    },
    {
      icon: faClipboardCheck,
      text: "أسئلة وتقييمات تساعدك على التطور",
    },
  ];

  return (
    <section
      dir="rtl"
      id="aboutPlatform"
      className="relative overflow-hidden bg-midnight px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-1/2 top-32 h-72 w-72 translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= Section Heading ================= */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-l from-gold to-transparent" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              من نحن
            </span>

            <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
          </div>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-warm-white sm:text-4xl md:text-5xl">
            تعرّف على المنصة
          </h2>

          <p className="text-sm leading-8 text-white/60 sm:text-base">
            نعمل على تقديم تجربة تعليمية مميزة تساعدك على فهم التاريخ بسهولة،
            وربط الأحداث ببعضها بدلًا من حفظها فقط.
          </p>
        </div>

        {/* ================= Main Grid ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-stretch">

          {/* ================= Right Card ================= */}
          <div
            className="
              group
              relative
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
              hover:border-gold/40
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
            "
          >
            {/* Gold accent */}
            <div className="absolute right-0 top-8 h-12 w-1 rounded-l-full bg-gold/70" />

            <div className="mb-8">
              <span className="mb-3 block text-xs font-bold text-gold/80">
                لماذا تتعلم معنا؟
              </span>

              <h3 className="text-xl font-extrabold text-warm-white sm:text-2xl">
                مميزات التعلم معنا
              </h3>
            </div>

            <div className="space-y-4">
              {learningFeatures.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.025]
                    px-4
                    py-4
                    transition-colors
                    duration-300
                    group-hover:border-gold/10
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-gold/10
                      text-sm
                      text-gold
                    "
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </div>

                  <p className="text-sm font-semibold leading-6 text-white/80">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= Master Card ================= */}
          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-gold/25
              bg-gradient-to-b
              from-[#17283d]
              to-[#0d1a2b]
              p-7
              text-center
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "
          >
            {/* Decorative top line */}
            <div className="absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 rounded-b-full bg-gold" />

            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-24 h-40 w-40 -translate-x-1/2 rounded-full bg-gold/10 blur-[70px]" />

            <div className="relative z-10">

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-gold/20
                  bg-gold/5
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-gold
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                مدرس التاريخ
              </span>

              <div className="mx-auto mb-5 mt-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gold/70 bg-midnight shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <img
                  src={MasterImg}
                  alt="أ. محمد خالد"
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mb-3 text-2xl font-extrabold text-gold sm:text-3xl">
                محمد خالد
              </h3>

              <div className="mx-auto mb-5 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-gold/40" />
                <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                <span className="h-px w-8 bg-gold/40" />
              </div>

              <p className="text-sm leading-8 text-white/70 sm:text-base">
                مدرس الدراسات الاجتماعية للمرحلة الإعدادية والتاريخ للمرحلة
                الثانوية، نقدم شرحًا مبسطًا ومنظمًا يساعدك على فهم التاريخ
                وربط الأحداث بطريقة سهلة وشيقة، مع التركيز على أهم النقاط التي
                تحتاجها لتحقيق أفضل نتيجة.
              </p>
            </div>
          </div>

          {/* ================= Left Card ================= */}
          <div
            className="
              group
              relative
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
              hover:border-gold/40
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
            "
          >
            {/* Gold accent */}
            <div className="absolute right-0 top-8 h-12 w-1 rounded-l-full bg-gold/70" />

            <div className="mb-8">
              <span className="mb-3 block text-xs font-bold text-gold/80">
                ماذا نقدم؟
              </span>

              <h3 className="text-xl font-extrabold text-warm-white sm:text-2xl">
                ماذا تقدم لك المنصة؟
              </h3>
            </div>

            <div className="space-y-4">
              {platformFeatures.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.025]
                    px-4
                    py-4
                    transition-colors
                    duration-300
                    group-hover:border-gold/10
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-gold/10
                      text-sm
                      text-gold
                    "
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </div>

                  <p className="text-sm font-semibold leading-6 text-white/80">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
    </section>
  );
}