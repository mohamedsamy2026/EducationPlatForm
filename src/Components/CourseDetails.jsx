import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPlay,
  faBookOpen,
  faGraduationCap,
  faChalkboardTeacher,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CourseDetails() {
  const location = useLocation();
  const course = location.state?.course;
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function InfoItem({ icon, title, value }) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <FontAwesomeIcon icon={icon} className="mb-3 text-gold" />

        <p className="mb-1 text-xs text-white/40">{title}</p>

        <p className="truncate text-sm font-bold text-white">{value}</p>
      </div>
    );
  }
  if (!course) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-midnight px-4 py-32 text-white"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-black text-white">
            الكورس غير موجود
          </h1>

          <p className="mb-8 text-white/60">لم يتم العثور على بيانات الكورس.</p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-6 py-3 font-bold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.12),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(18,52,78,0.35),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mt-20 md:mt-15 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Course Info */}
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
                <FontAwesomeIcon icon={faBookOpen} />
                تفاصيل الكورس
              </span>

              <h1 className="mb-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoItem
                  icon={faGraduationCap}
                  title="المرحلة"
                  value={course.grade}
                />

                <InfoItem
                  icon={faChalkboardTeacher}
                  title="المدرس"
                  value="مستر محمد خالد"
                />

                <InfoItem
                  icon={faBookOpen}
                  title="الدروس"
                  value={course.lessonsCount}
                />
              </div>

              <button
                type="button"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-gold px-7 py-4 font-black text-midnight shadow-[0_10px_35px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(212,175,55,0.3)]"
              >
                <FontAwesomeIcon icon={faPlay} />
                ابدأ الكورس
              </button>
            </div>

            {/* Course Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-gold/20 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                <div className="aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(212,175,55,0.08)]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent" />
      </section>

      {/* Course Content */}
      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-sm font-bold text-gold">
            محتوى الكورس
          </span>

          <h2 className="text-3xl font-black sm:text-4xl">
            ابدأ رحلتك التعليمية
          </h2>

          <p className="mt-4 text-white/50">
            {course.sections?.length || 0} أقسام تعليمية
          </p>
        </div>

        <div className="space-y-4">
          {course.sections?.map((section, index) => {
            const isOpen = openSection === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-gold/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 font-black text-gold">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="font-black text-white">{section.title}</h3>

                      <p className="mt-1 text-sm text-white/40">
                        {section.lessons?.length || 0} دروس
                      </p>
                    </div>
                  </div>

                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gold transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="space-y-2 pt-4">
                      {section.lessons?.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4 text-sm text-white/70"
                        >
                          <FontAwesomeIcon
                            icon={faPlay}
                            className="text-xs text-gold"
                          />

                          <span>{lesson.title || lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-gold/20 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.15),transparent_35%),linear-gradient(135deg,rgba(18,52,78,0.7),rgba(6,23,40,0.9))] p-8 text-center sm:p-10">
          <h3 className="text-2xl font-black sm:text-3xl">جاهز تبدأ الكورس؟</h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/50">
            ابدأ الآن واستمتع بالمحتوى التعليمي المنظم.
          </p>

          <button
            type="button"
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gold px-7 py-4 font-black text-midnight transition-all duration-300 hover:-translate-y-1"
          >
            <FontAwesomeIcon icon={faPlay} />
            ابدأ الكورس الآن
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
