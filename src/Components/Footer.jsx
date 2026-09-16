// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MasterFooter from "../assets/Master/master no transparent.jpeg";

// Icons
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faTelegram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

// Solid Icons
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    // Footer Start
    <footer
      id="footer"
      dir="rtl"
      className="
        relative
        overflow-hidden
        border-t
        border-gold/20
        bg-midnight
        px-4
        pb-6
        pt-20
        sm:px-6
        lg:px-8
      "
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute right-1/2 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#10243a]/40 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Main Footer Start */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Platform Info Start */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/10 blur-xl" />

                <img
                  src={MasterFooter}
                  alt="مستر محمد خالد"
                  className="
                    relative
                    h-16
                    w-16
                    shrink-0
                    rounded-full
                    border-2
                    border-gold/70
                    object-cover
                    shadow-[0_10px_30px_rgba(0,0,0,0.30)]
                  "
                />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-gold">
                  الغازي في التاريخ
                </h2>

                <span className="mt-1 block text-xs font-semibold text-white/40">
                  منصة تعليم التاريخ
                </span>
              </div>
            </div>

            <p className="max-w-lg text-sm leading-8 text-white/60 sm:text-base">
              منصة تعليمية تهدف إلى تقديم شرح مبسط ومميز لمادة التاريخ والدراسات
              الاجتماعية مع مستر محمد خالد.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-10 bg-gold/50" />
              <p className="text-sm font-bold leading-7 text-white/80">
                نتعلم التاريخ لنفهم الحاضر ونصنع المستقبل.
              </p>
            </div>
          </div>
          {/* Platform Info End */}

          {/* Quick Links Start */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-gold" />

              <h3 className="text-xl font-extrabold text-warm-white">
                روابط سريعة
              </h3>
            </div>

            <div className="space-y-4">
              <a
                href="#heroSection"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-white/60
                  transition-colors
                  duration-200
                  hover:text-gold
                "
              >
                <span className="h-1 w-1 rounded-full bg-white/30 transition-all duration-200 group-hover:w-2 group-hover:bg-gold" />
                الرئيسية
              </a>

              <a
                href="#aboutPlatform"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-white/60
                  transition-colors
                  duration-200
                  hover:text-gold
                "
              >
                <span className="h-1 w-1 rounded-full bg-white/30 transition-all duration-200 group-hover:w-2 group-hover:bg-gold" />
                تعرّف على المنصة
              </a>

              <a
                href="#courses"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-white/60
                  transition-colors
                  duration-200
                  hover:text-gold
                "
              >
                <span className="h-1 w-1 rounded-full bg-white/30 transition-all duration-200 group-hover:w-2 group-hover:bg-gold" />
                الكورسات
              </a>

              <a
                href="#StudentOpinions"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-white/60
                  transition-colors
                  duration-200
                  hover:text-gold
                "
              >
                <span className="h-1 w-1 rounded-full bg-white/30 transition-all duration-200 group-hover:w-2 group-hover:bg-gold" />
                آراء الطلاب
              </a>
            </div>
          </div>
          {/* Quick Links End */}

          {/* Follow Us Start */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-gold" />

              <h3 className="text-xl font-extrabold text-warm-white">
                تابعنا
              </h3>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-7 text-white/60">
              تابع مستر محمد خالد على مواقع التواصل الاجتماعي.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* Facebook */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/share/19RrYLGj8s/"
                aria-label="فيسبوك"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-charcoal
                  text-lg
                  text-white/70
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-gold
                  hover:bg-gold
                  hover:text-midnight
                "
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>

              {/* Instagram */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/mhmdkhldltnyn?stkn=MXhzM3ludzB1MzVzdg=="
                aria-label="إنستجرام"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-charcoal
                  text-lg
                  text-white/70
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-gold
                  hover:bg-gold
                  hover:text-midnight
                "
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              {/* TikTok */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.tiktok.com/@mr..mohamed.khaled?_r=1&_t=ZS-99VfIpXBVsj"
                aria-label="تيك توك"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-charcoal
                  text-lg
                  text-white/70
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-gold
                  hover:bg-gold
                  hover:text-midnight
                "
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
          {/* Follow Us End */}

          {/* Support Area Start */}
          <div className="grid grid-cols-1 gap-10 border-t border-white/5 pt-10 sm:col-span-2 lg:col-span-12 lg:grid-cols-2 lg:gap-16">
            {/* Scientific Support Start */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-gold" />

                <h3 className="text-xl font-extrabold text-warm-white">
                  الدعم العلمي
                </h3>
              </div>

              <p className="mb-5 max-w-md text-sm leading-7 text-white/60">
                لديك سؤال عن درس أو محتوى دراسي ؟ تواصل معنا وسنساعدك.
              </p>

              <div className="flex items-center gap-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/201006254308"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساب"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-charcoal
                    text-lg
                    text-white/70
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#25D366]
                    hover:bg-[#25D366]
                    hover:text-white
                  "
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/mohamed25721"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تليجرام"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-charcoal
                    text-lg
                    text-white/70
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#229ED9]
                    hover:bg-[#229ED9]
                    hover:text-white
                  "
                >
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
              </div>
            </div>
            {/* Scientific Support End */}

            {/* Technical Support Start */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-gold" />

                <h3 className="text-xl font-extrabold text-warm-white">
                  الدعم الفني
                </h3>
              </div>

              <p className="mb-5 max-w-md text-sm leading-7 text-white/60">
                لديك مشكلة تقنية في المنصه أو استفسار عن الحساب ؟ تواصل معنا وسنساعدك.
              </p>

              <div className="flex items-center gap-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/201115083459"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساب"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-charcoal
                    text-lg
                    text-white/70
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#25D366]
                    hover:bg-[#25D366]
                    hover:text-white
                  "
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/mohamed1_2_3_4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تليجرام"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-charcoal
                    text-lg
                    text-white/70
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#229ED9]
                    hover:bg-[#229ED9]
                    hover:text-white
                  "
                >
                  <FontAwesomeIcon icon={faTelegram} />
                </a>

                {/* Email */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mohamedeng747@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="البريد الإلكتروني"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-charcoal
                    text-lg
                    text-white/70
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-gold
                    hover:bg-gold
                    hover:text-midnight
                  "
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
              </div>
            </div>
            {/* Technical Support End */}
          </div>
          {/* Support Area End */}
        </div>
        {/* Main Footer End */}

        {/* Bottom Footer Start */}
        <div
          className="
            mt-14
            flex
            flex-col
            items-center
            justify-between
            gap-5
            border-t
            border-white/10
            pt-6
            text-center
            md:flex-row
            md:text-right
          "
        >
          <p className="order-2 text-xs font-semibold text-white/40 md:order-1 sm:text-sm">
            الغازي في التاريخ - جميع الحقوق محفوظة © 2026
          </p>

          <a
            href="#heroSection"
            className="
              order-1
              flex
              items-center
              gap-2
              text-xs
              font-bold
              text-white/50
              transition-colors
              duration-200
              hover:text-gold
              md:order-2
              sm:text-sm
            "
          >
            <span>العودة إلى الرئيسية</span>

            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
        </div>
        {/* Bottom Footer End */}
      </div>
    </footer>
    // Footer End
  );
}