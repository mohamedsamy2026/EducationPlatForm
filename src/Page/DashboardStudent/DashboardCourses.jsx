// COMPONENTS
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import DashboardSidebar from "../../Components/DashboardStudent/DashboardSidebar";
import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";

// DATA
import courses from "../../date/courses";
import students from "../../date/students";
import enrollments from "../../date/enrollments";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// ROUTER
import { Link } from "react-router-dom";

export default function DashboardCourses() {
  const student = students[0];

  const studentCourses = courses.filter(
    (course) => course.grade === student.grade,
  );

  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <div className="flex w-full lg:min-h-screen">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          {/* Page Header */}
          <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3 mt-12">
                  <FontAwesomeIcon icon={faBookOpen} />
                  رحلتك التعليمية
                </span>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  الكورسات
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
                  اكتشف الكورسات المناسبة لمرحلتك الدراسية وابدأ رحلتك
                  التعليمية.
                </p>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="relative overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="pointer-events-none absolute right-1/2 top-20 h-80 w-80 translate-x-1/2 rounded-full bg-gold/5 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-7xl">
              {studentCourses.length > 0 ? (
                <>
                  <div className="mb-8">
                    <p className="mb-2 text-xs font-bold text-gold">
                      الكورسات المناسبة لك
                    </p>

                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                      ابدأ التعلم
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {studentCourses.map((course) => {
                      const isEnrolled = enrollments.some(
                        (enrollment) =>
                          enrollment.studentId === student.id &&
                          enrollment.courseId === course.id &&
                          enrollment.status === "active",
                      );

                      return (
                        <article
                          key={course.id}
                          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-2 hover:border-gold/35 hover:shadow-[0_25px_60px_rgba(0,0,0,0.30)]"
                        >
                          {/* Course Image */}
                          <div className="relative aspect-video overflow-hidden bg-[#071321]">
                            <img
                              src={course.image}
                              alt={`صورة ${course.title}`}
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071321]/85 via-[#071321]/10 to-transparent" />

                            <div className="absolute bottom-4 right-4 rounded-lg border border-gold/30 bg-[#071321]/85 px-3 py-2 text-xs font-bold text-gold shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                              {course.grade}
                            </div>
                          </div>

                          {/* Course Content */}
                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-4 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.65)]" />

                              <span className="text-xs font-bold text-gold/75">
                                كورس تعليمي
                              </span>
                            </div>

                            <h3 className="mb-4 min-h-[4rem] text-xl font-extrabold leading-8 text-white transition-colors duration-300 group-hover:text-gold">
                              {course.title}
                            </h3>

                            <p className="mb-6 text-sm leading-7 text-white/55 sm:text-base">
                              {course.description}
                            </p>

                            <div className="mb-5 h-px w-full bg-gradient-to-l from-transparent via-white/10 to-transparent" />

                            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-white/55 sm:text-sm">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10 text-gold">
                                <FontAwesomeIcon icon={faBookOpen} />
                              </span>

                              <span>{course.duration}</span>
                            </div>

                            <Link
                              to={`/courses/${course.id}`}
                              className={`mt-auto flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-extrabold transition-all duration-300 ${
                                isEnrolled
                                  ? "bg-gold text-midnight shadow-[0_8px_25px_rgba(212,175,55,0.10)] hover:gap-5 hover:bg-gold-light hover:shadow-[0_12px_30px_rgba(212,175,55,0.20)]"
                                  : "border border-gold/25 bg-gold/10 text-gold hover:bg-gold hover:text-midnight"
                              }`}
                            >
                              <span>
                                {isEnrolled ? "متابعة الكورس" : "عرض الكورس"}
                              </span>

                              <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                          </div>

                          {/* Bottom Accent */}
                          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-500 group-hover:w-1/2" />
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <DashboardEmptyState
                  icon={faBookOpen}
                  title="لا توجد كورسات مناسبة لمرحلتك الدراسية"
                  description="لم يتم إضافة كورسات مناسبة لمرحلتك الدراسية بعد."
                />
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
