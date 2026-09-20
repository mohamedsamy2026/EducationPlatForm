import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import DashboardSidebar from "../../Components/Dashboard/DashboardSidebar";

import HeroImg from "../../assets/Background/dashbord student home.webp";

import Master1 from "../../assets/Master/master 1.webp";
import Master2 from "../../assets/Master/master 2.webp";
import Master3 from "../../assets/Master/master 3.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faClipboardCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardHome() {
  const courses = [
    {
      id: 1,
      title: "الدراسات الاجتماعية للمرحلة الإعدادية",
      grade: "المرحلة الإعدادية",
      image: Master1,
    },
    {
      id: 2,
      title: "التاريخ للمرحلة الثانوية",
      grade: "المرحلة الثانوية",
      image: Master2,
    },
    {
      id: 3,
      title: "التاريخ بطريقة مختلفة",
      grade: "محتوى تعليمي",
      image: Master3,
    },
  ];

  const exams = [
    {
      id: 1,
      title: "اختبار الوحدة الأولى",
      course: "الدراسات الاجتماعية",
      status: "متاح الآن",
    },
    {
      id: 2,
      title: "اختبار الدرس الثاني",
      course: "التاريخ",
      status: "متاح الآن",
    },
  ];

  const latestResult = {
    title: "اختبار الوحدة الأولى",
    score: 17,
    total: 20,
  };

  const percentage = Math.round(
    (latestResult.score / latestResult.total) * 100
  );

  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <div className="flex w-full pt-20 lg:min-h-[calc(100vh-88px)] lg:pt-22">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          {/* Welcome */}
          <section className="relative overflow-hidden border-b border-white/10">
            <img
              src={HeroImg}
              alt="لوحة الطالب"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#061522]/70" />

            <div className="absolute inset-0 bg-gradient-to-l from-[#061522]/95 via-[#061522]/55 to-transparent" />

            <div className="relative z-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold">
                  لوحة الطالب
                </span>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  مرحبًا محمد سامي
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
                  استمر في التعلم، وكل خطوة جديدة تقربك من هدفك.
                </p>
              </div>
            </div>
          </section>

          {/* Dashboard Content */}
          <div className="px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            {/* My Courses */}
            <section>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold text-gold">
                    رحلتك التعليمية
                  </p>

                  <h2 className="text-2xl font-black text-white sm:text-3xl">
                    كورساتي
                  </h2>
                </div>

                <button
                  type="button"
                  className="hidden items-center gap-2 text-sm font-bold text-white/50 transition-colors hover:text-gold sm:flex"
                >
                  عرض الكل
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/30"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#071321]/80 to-transparent" />

                      <span className="absolute bottom-4 right-4 rounded-lg border border-gold/20 bg-[#071321]/85 px-3 py-2 text-xs font-bold text-gold backdrop-blur-sm">
                        {course.grade}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold text-gold/70">
                        <FontAwesomeIcon icon={faBookOpen} />
                        كورس تعليمي
                      </div>

                      <h3 className="min-h-[3.5rem] text-lg font-extrabold leading-7 text-white transition-colors group-hover:text-gold">
                        {course.title}
                      </h3>

                      <button
                        type="button"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
                      >
                        متابعة الكورس
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Exams + Latest Result */}
            <section className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Exams */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.15)]">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <FontAwesomeIcon icon={faClipboardCheck} />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-gold">
                      الاختبارات المتاحة
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      اختباراتك
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {exam.title}
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          {exam.course}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 rounded-lg bg-gold/10 px-3 py-2 text-xs font-bold text-gold transition-colors hover:bg-gold hover:text-midnight"
                      >
                        {exam.status}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Result */}
              <div className="rounded-2xl border border-gold/15 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.10),transparent_40%),#0c1a2b] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.15)]">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <FontAwesomeIcon icon={faTrophy} />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-gold">
                      آخر نتيجة
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      آخر امتحان
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {latestResult.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/45">
                      آخر نتيجة مسجلة لك
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-black text-white">
                      {latestResult.score}/{latestResult.total}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gold">
                      {percentage}%
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                >
                  عرض النتيجة
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}