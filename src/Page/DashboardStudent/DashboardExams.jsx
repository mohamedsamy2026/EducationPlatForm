// COMPONENTS
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import DashboardSidebar from "../../Components/DashboardStudent/DashboardSidebar";
import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";
import DashboardExamCard from "../../Components/DashboardStudent/DashboardExamCard";

// DATA
import exams from "../../date/exams";
import results from "../../date/results";
import students from "../../date/students";
import enrollments from "../../date/enrollments";
import courses from "../../date/courses";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

export default function DashboardExams() {
  const currentStudent = students[0];

  const enrolledCourseIds = enrollments
    .filter(
      (enrollment) =>
        enrollment.studentId === currentStudent?.id &&
        enrollment.status === "active",
    )
    .map((enrollment) => enrollment.courseId);

  const studentExams = exams
    .filter((exam) => enrolledCourseIds.includes(exam.courseId))
    .map((exam) => {
      const result = results.find(
        (result) =>
          result.studentId === currentStudent?.id && result.examId === exam.id,
      );

      let status = "available";

      const now = new Date();
      const startDate = new Date(exam.startsAt);
      const endDate = new Date(exam.endsAt);

      if (result) {
        status = "completed";
      } else if (now > endDate) {
        status = "expired";
      } else if (now < startDate) {
        return null;
      }

      const course = courses.find((course) => course.id === exam.courseId);

      return {
        exam,
        result,
        status,
        courseTitle: course?.title || "كورس غير معروف",
      };
    })
    .filter(Boolean);

  const availableExams = studentExams.filter(
    (item) => item.status === "available",
  );

  const completedExams = studentExams.filter(
    (item) => item.status === "completed",
  );

  const expiredExams = studentExams.filter((item) => item.status === "expired");

  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <div className="flex w-full lg:min-h-screen">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          {/* Page Header */}
          <section className="border-b border-white/10 bg-midnight pt-20 lg:pt-24">
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold">
                  <FontAwesomeIcon icon={faClipboardCheck} />
                  اختباراتك
                </span>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  الاختبارات
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
                  تابع اختبارات الكورسات المشترك فيها واعرف نتائجك بعد كل
                  اختبار.
                </p>
              </div>
            </div>
          </section>

          {/* Exams Content */}
          <section className="relative overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="pointer-events-none absolute right-1/2 top-20 h-80 w-80 translate-x-1/2 rounded-full bg-gold/5 blur-[130px]" />

            <div className="relative z-10 max-w-7xl mx-auto">
              {studentExams.length > 0 ? (
                <div className="space-y-12">
                  {/* Available Exams */}
                  {availableExams.length > 0 && (
                    <section>
                      <div className="mb-6">
                        <p className="mb-2 text-xs font-bold text-gold">
                          متاحة حاليًا
                        </p>

                        <h2 className="text-2xl font-black text-white sm:text-3xl">
                          الاختبارات المتاحة
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {availableExams.map((item) => (
                          <DashboardExamCard
                            key={item.exam.id}
                            exam={item.exam}
                            courseTitle={item.courseTitle}
                            status={item.status}
                            result={item.result}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Completed Exams */}
                  {completedExams.length > 0 && (
                    <section>
                      <div className="mb-6">
                        <p className="mb-2 text-xs font-bold text-gold">
                          سجل الاختبارات
                        </p>

                        <h2 className="text-2xl font-black text-white sm:text-3xl">
                          الاختبارات المكتملة
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {completedExams.map((item) => (
                          <DashboardExamCard
                            key={item.exam.id}
                            exam={item.exam}
                            courseTitle={item.courseTitle}
                            status={item.status}
                            result={item.result}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Expired Exams */}
                  {expiredExams.length > 0 && (
                    <section>
                      <div className="mb-6">
                        <p className="mb-2 text-xs font-bold text-white/35">
                          اختبارات سابقة
                        </p>

                        <h2 className="text-2xl font-black text-white sm:text-3xl">
                          انتهى موعدها
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {expiredExams.map((item) => (
                          <DashboardExamCard
                            key={item.exam.id}
                            exam={item.exam}
                            courseTitle={item.courseTitle}
                            status={item.status}
                            result={item.result}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <DashboardEmptyState
                  icon={faClipboardCheck}
                  title="لا توجد اختبارات متاحة حاليًا."
                  description="ستظهر هنا الاختبارات الخاصة بالكورسات التي اشتركت فيها."
                  buttonText="استكشف الكورسات"
                  buttonTo="/dashboard-courses"
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
