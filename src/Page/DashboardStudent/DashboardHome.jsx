// COMPONENTS
import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";

// DATA
import courses from "../../date/courses";
import exams from "../../date/exams";
import results from "../../date/results";
import { getCurrentStudent } from "../../services/studentService";
import enrollments from "../../date/enrollments";

// IMGS
import HeroImg from "../../assets/Background/coureses.webp";

// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faClipboardCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

// HOOKS
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  // الطالب الحالي مؤقتًا
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    getCurrentStudent().then(setCurrentStudent);
  }, []);

  // استخراج الكورسات المشترك فيها الطالب
  const enrolledCourseIds = enrollments
    .filter(
      (enrollment) =>
        enrollment.studentId === currentStudent?.id &&
        enrollment.status === "active",
    )
    .map((enrollment) => enrollment.courseId);

  // عرض كورسات الطالب فقط
  const studentCourses = courses.filter((course) =>
    enrolledCourseIds.includes(course.id),
  );

  // تحديد الاختبارات المتاحة للطالب فقط
  const now = new Date();

  const availableExams = exams
    .filter((exam) => enrolledCourseIds.includes(exam.courseId))
    .filter((exam) => {
      const startDate = new Date(exam.startsAt);
      const endDate = new Date(exam.endsAt);

      return now >= startDate && now <= endDate;
    })
    .filter(
      (exam) =>
        !results.some(
          (result) =>
            result.studentId === currentStudent?.id &&
            result.examId === exam.id,
        ),
    )
    .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))
    .slice(0, 3);

  // استخراج نتائج الطالب وترتيبها من الأحدث للأقدم
  const studentResults = results
    .filter((result) => result.studentId === currentStudent?.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  // أحدث نتيجة فقط
  const latestResult = studentResults[0] || null;

  // حساب النسبة بشكل آمن
  const percentage = latestResult
    ? Math.round((latestResult.score / latestResult.total) * 100)
    : 0;

  // استخراج اسم الامتحان المرتبط بأحدث نتيجة
  const latestResultExam = latestResult
    ? exams.find((exam) => exam.id === latestResult.examId)
    : null;

  return (
    <>
      {/* Welcome */}
      <section className="relative overflow-hidden border-b border-white/10 pt-20 lg:pt-24">
        <img
          src={HeroImg}
          alt="لوحة الطالب"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#061522]/15" />

        <div className="absolute inset-0 bg-gradient-to-l from-[#061522]/53 via-[#061522]/53 to-transparent" />

        <div className="relative z-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <span className="mb-3 mt-6 inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold md:mt-0">
              لوحة الطالب
            </span>

            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              مرحبًا {currentStudent?.name || "بك"} 
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white sm:text-base">
              استمر في التعلم، وكل خطوة جديدة تقربك من هدفك.
            </p>
          </div>
        </div>
      </section>

      <div className="px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* Courses */}
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

            <Link
              to="/#courses"
              className="hidden cursor-pointer items-center gap-2 text-sm font-bold text-gray-300 transition-colors hover:text-gold sm:flex"
            >
              عرض الكل
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>

          {studentCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {studentCourses.map((course) => (
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

                    <Link
                      to={`/courses/${course.id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
                    >
                      متابعة الكورس
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              icon={faBookOpen}
              title="لم تشترك في أي كورس بعد"
              description="استكشف الكورسات المتاحة وابدأ رحلتك التعليمية."
              buttonText="استكشف الكورسات"
              buttonTo="/courses"
            />
          )}
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

            {availableExams.length > 0 ? (
              <div className="space-y-3">
                {availableExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {exam.title}
                      </h3>

                      <p className="mt-1 text-xs text-white/40">
                        {exam.sectionTitle}
                      </p>
                    </div>

                    <Link
                      to={`/dashboard-student/exams/${exam.id}`}
                      className="shrink-0 rounded-lg bg-gold/10 px-6 py-2.5 text-xs font-bold text-gold transition-colors hover:bg-gold hover:text-midnight"
                    >
                      بدء الاختبار
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                icon={faClipboardCheck}
                title="لا توجد اختبارات متاحة حاليًا"
                description="اشترك في كورس لتظهر الاختبارات الخاصة بك."
                buttonText="استكشف الكورسات"
                buttonTo="/courses"
              />
            )}
          </div>

          {/* Latest Result */}
          <div className="rounded-2xl border border-gold/15 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.10),transparent_40%),#0c1a2b] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.15)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <FontAwesomeIcon icon={faTrophy} />
              </span>

              <div>
                <p className="text-xs font-bold text-gold">آخر نتيجة</p>

                <h2 className="mt-1 text-xl font-black text-white">
                  آخر امتحان
                </h2>
              </div>
            </div>

            {latestResult ? (
              <>
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {latestResultExam?.title || "امتحان غير معروف"}
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

                <Link
                  to={`/exam-result/${latestResult.examId}`}
                  className="mt-14 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                >
                  عرض النتيجة
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
              </>
            ) : (
              <DashboardEmptyState
                icon={faTrophy}
                title="لا توجد نتائج حتى الآن"
                description="بعد أداء أول اختبار ستظهر نتيجتك هنا."
                buttonText="استعرض الاختبارات"
                buttonTo="/dashboard-student/exams"
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
