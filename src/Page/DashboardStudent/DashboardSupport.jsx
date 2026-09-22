// COMPONENTS
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import DashboardSidebar from "../../Components/DashboardStudent/DashboardSidebar";

// IMGS
import MasterFooter from "../../assets/Master/master no transparent.jpeg";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faEnvelope,
  faLaptopCode,
  faMessage,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

import {
  faTelegram as faTelegramBrand,
  faWhatsapp as faWhatsappBrand,
} from "@fortawesome/free-brands-svg-icons";

export default function DashboardSupport() {
  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <div className="flex w-full lg:min-h-screen">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

            <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
              <div className="mx-auto max-w-7xl">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3 mt-12">
                    <FontAwesomeIcon icon={faMessage} />
                    الدعم والمساعدة
                  </span>

                  <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    إحنا هنا عشان نساعدك
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                    اختار نوع الدعم المناسب لمشكلتك وتواصل مع الشخص المختص
                    مباشرة.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Support Content */}
          <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
            <section>
              <div className="mb-8 max-w-2xl">
                <p className="text-xs font-bold text-gold">اختر نوع المساعدة</p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  محتاج مساعدة في إيه؟
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  سواء عندك سؤال في المادة أو مشكلة تقنية، اختار القسم المناسب
                  وتواصل بسهولة.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Scientific Support */}
                <SupportCard
                  type="الدعم العلمي"
                  title="مساعدة في المحتوى الدراسي"
                  description="لأي سؤال متعلق بالدرس أو مادة التاريخ والدراسات الاجتماعية، تواصل مع الدعم العلمي."
                  icon={faBookOpen}
                  image={MasterFooter}
                  imageAlt="مستر محمد خالد"
                >
                  <div className="mt-6 flex flex-wrap gap-3">
                    <SupportLink
                      href="https://wa.me/201006254308"
                      icon={faWhatsappBrand}
                      label="تواصل عبر واتساب"
                      variant="whatsapp"
                    />

                    <SupportLink
                      href="https://t.me/mohamed25721"
                      icon={faTelegramBrand}
                      label="تواصل عبر تليجرام"
                      variant="telegram"
                    />
                  </div>
                </SupportCard>

                {/* Technical Support */}
                <SupportCard
                  type="الدعم الفني"
                  title="مساعدة في المنصة والحساب"
                  description="لو واجهتك مشكلة في المنصة أو الحساب أو أي جزء تقني، تواصل مع الدعم الفني."
                  icon={faLaptopCode}
                >
                  <div className="mt-6 flex flex-wrap gap-3">
                    <SupportLink
                      href="https://wa.me/201115083459"
                      icon={faWhatsappBrand}
                      label="تواصل عبر واتساب"
                      variant="whatsapp"
                    />

                    <SupportLink
                      href="https://t.me/mohamed1_2_3_4"
                      icon={faTelegramBrand}
                      label="تواصل عبر تليجرام"
                      variant="telegram"
                    />

                    <SupportLink
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=mohamedeng747@gmail.com"
                      icon={faEnvelope}
                      label="راسلنا بالبريد"
                      variant="email"
                    />
                  </div>
                </SupportCard>
              </div>
            </section>

            {/* Help Guide */}
            <section className="mt-10 rounded-2xl border border-white/10 bg-[#0c1a2b] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.14)] sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-lg text-gold">
                  <FontAwesomeIcon icon={faUserGraduate} />
                </span>

                <div>
                  <h3 className="text-lg font-black text-white">
                    اختار القسم المناسب
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-white/45">
                    سؤال في المنهج أو محتوى دراسي؟ استخدم الدعم العلمي. مشكلة في
                    الحساب أو المنصة؟ استخدم الدعم الفني.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function SupportCard({
  type,
  title,
  description,
  icon,
  image,
  imageAlt,
  children,
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/20 hover:shadow-[0_22px_55px_rgba(0,0,0,0.22)] sm:p-7">
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-lg text-gold">
              <FontAwesomeIcon icon={icon} />
            </span>

            <div>
              <p className="text-xs font-bold text-gold">{type}</p>

              <h2 className="mt-1 text-lg font-black text-white sm:text-xl">
                {title}
              </h2>
            </div>
          </div>

          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="h-14 w-14 shrink-0 rounded-full border-2 border-gold/40 object-cover shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
            />
          )}
        </div>

        <p className="mt-5 max-w-xl text-sm leading-8 text-white/50">
          {description}
        </p>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-xs font-bold text-white/30">وسائل التواصل</p>

          {children}
        </div>
      </div>
    </article>
  );
}

function SupportLink({ href, icon, label, variant }) {
  const styles = {
    whatsapp:
      "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white",
    telegram:
      "border-white/10 bg-white/[0.03] text-white/70 hover:border-[#229ED9] hover:bg-[#229ED9] hover:text-white",
    email:
      "border-gold/20 bg-gold/10 text-gold hover:bg-gold hover:text-midnight",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-extrabold transition-all duration-300 hover:-translate-y-0.5 ${styles[variant]}`}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </a>
  );
}
