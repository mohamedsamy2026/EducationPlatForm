import { Link } from "react-router-dom";

import MasterImg from "../assets/Master/master.webp";

import HeroImg from "../assets/Background/1.jpg";

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      id="heroSection"
      className="relative lg:min-h-screen lg:py-0 py-11 overflow-hidden flex items-center"
    >
      {/* Background Start */}
      <div className="absolute inset-0 z-0">
        <img
          src={HeroImg}
          alt="الأهرامات المصرية"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Navy cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-[#061522]/60" />

        {/* Text readability overlay */}
        <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-l  via-[#061522]/20 to-transparent" />


        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
        {/* Subtle gold glow مهمه */}
        <div className="absolute -left-32 bottom-10 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
      </div>
      {/* Background End */}

      

      {/* Decorative Elements Start */}
      <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-gold/60 to-transparent opacity-60" />
      <div className="absolute bottom-24 right-10 hidden lg:block w-2 h-2 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]" />
      {/* Decorative Elements End */}

      {/* Content Start */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 pb-20 lg:pt-32 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-2">
          {/* Text Start */}
          <div className="order-1 md:order-2 text-right lg:max-w-2xl max-w-7xl lg:pl-4 xl:pl-8">
            {/* Small label */}
            <div className="inline-flex items-center gap-3 mb-5 px-4 py-2 rounded-full border border-gold/30 bg-black/20 backdrop-blur-sm text-gold text-xs sm:text-sm font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              منصة تعليم التاريخ بأسلوب مختلف
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.1rem] xl:text-[4.6rem] font-extrabold leading-[1.20] tracking-tight text-white mb-6">
              تعلّم التاريخ
              <br />
              <span className="text-gold drop-shadow-[0_4px_18px_rgba(212,175,55,0.12)]">
                بأسلوب مختلف
              </span>
            </h1>


            {/* Gold separator */}
            <div className="flex items-center justify-start gap-3 mb-6">
              <div className="w-20 h-px bg-gradient-to-r from-gold to-transparent" />

              <div className="w-2 h-2 rotate-45 bg-gold" />

              <div className="w-20 h-px bg-gradient-to-r from-gold to-transparent" />
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg leading-8 text-white/80 max-w-xl text-right ml-auto mb-8">
              تعلّم التاريخ مع مستر محمد خالد بخبرة تمتد لأكثر من 3 سنوات في
              التدريس، من خلال شرح مبسّط وشيّق يساعدك على فهم الأحداث وربطها
              ببعضها بدلًا من حفظها فقط.
            </p>

            {/* ================= Buttons ================= */}
            <div className="flex flex-col sm:flex-row justify-start sm:items-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gold text-midnight font-extrabold text-base shadow-[0_10px_30px_rgba(212,175,55,0.20)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(212,175,55,0.30)]"
              >
                ابدأ التعلم
              </Link>

              <a
                href="#courses"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold text-base transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
              >
                شاهد الكورسات
              </a>
            </div>

            {/* Trust detail */}
            <div className="mt-10 flex items-center justify-start gap-3 text-xs sm:text-sm text-white/50">
              <span className="text-gray-300 font-bold">شرح مبسّط</span>

              <span className="w-1 h-1 rounded-full bg-gold/70" />

              <span className="text-gray-300 font-bold">فهم أعمق</span>

              <span className="w-1 h-1 rounded-full bg-gold/70" />

              <span className="text-gray-300 font-bold">تجربة تعليمية مختلفة</span>
            </div>

          </div>

          {/* Text End */}

          {/* Master Start */}
          <div className="lg:flex order-1 md:order-2 relative items-center justify-center">
            {/* Gold ambient glow */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-gold/10 blur-[90px]" />

            <img
              src={MasterImg}
              alt="مستر محمد خالد"
              className="relative z-10 lg:w-[500px] w-[350px] mx-auto h-auto drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)] translate-y-10"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 82%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 82%, transparent 100%)",
              }}
            />
          </div>

          {/* Master End */}
        </div>
      </div>

      {/* Content End */}
    </section>
  );
}
