import { Link } from "react-router-dom";
import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";
import DashboardResultCard from "../../Components/DashboardStudent/DashboardResultCard";

// SERVICES

import { getCurrentStudent } from "../../services/studentService";
import { getResultsByStudentId } from "../../services/resultService";
import { getExamById } from "../../services/examService";
import { getCourseById } from "../../services/courseService";

// ICONS

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
  faClipboardCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

// HOOKS

import { useEffect, useState } from "react";

export default function DashboardResults() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      try {
        const student = await getCurrentStudent();

        if (cancelled) return;

        setCurrentStudent(student);

        if (!student) {
          setStudentResults([]);
          setExams([]);
          setCourses([]);
          return;
        }

        const results = await getResultsByStudentId(student.id);

        if (cancelled) return;

        const sortedResults = results.sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
        );

        const uniqueExamIds = [
          ...new Set(sortedResults.map((result) => String(result.examId))),
        ];

        const loadedExams = await Promise.all(
          uniqueExamIds.map((examId) => getExamById(examId)),
        );

        if (cancelled) return;

        const validExams = loadedExams.filter(Boolean);

        const uniqueCourseIds = [
          ...new Set(validExams.map((exam) => String(exam.courseId))),
        ];

        const loadedCourses = await Promise.all(
          uniqueCourseIds.map((courseId) => getCourseById(courseId)),
        );

        if (cancelled) return;

        setStudentResults(sortedResults);
        setExams(validExams.filter(Boolean));
        setCourses(loadedCourses.filter(Boolean));
      } catch {
        if (cancelled) return;

        setCurrentStudent(null);
        setStudentResults([]);
        setExams([]);
        setCourses([]);
      }
    }

    loadResults();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestResult = studentResults[0] || null;

  const latestExam = latestResult
    ? exams.find((exam) => String(exam.id) === String(latestResult.examId))
    : null;

  const latestCourse = latestExam
    ? courses.find(
        (course) => String(course.id) === String(latestExam.courseId),
      )
    : null;

  const previousResults = studentResults.slice(1);

  const latestPercentage =
    latestResult && Number(latestResult.total) > 0
      ? Math.round(
          (Number(latestResult.score) / Number(latestResult.total)) * 100,
        )
      : 0;

  const formatDate = (date) => {
    if (!date) return "غير محدد";

    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      {/* Header Section */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />

        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

        <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3">
                <FontAwesomeIcon icon={faClipboardCheck} />
                سجل النتائج
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                نتائج اختباراتك
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                تابع نتائج اختباراتك السابقة وراجع آخر أداء لك في رحلتك
                التعليمية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}

      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {studentResults.length > 0 ? (
          <>
            {/* Latest Result */}

            <section>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <FontAwesomeIcon icon={faTrophy} />
                </span>

                <div>
                  <p className="text-xs font-bold text-gold">آخر نتيجة</p>

                  <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                    أحدث اختبار قمت بحله
                  </h2>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-gold/15 bg-[radial-gradient(circle_at_85%_15%,rgba(212,175,55,0.12),transparent_38%),#0c1a2b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-8">
                <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-bold text-gold">
                        {latestCourse?.title || "كورس غير معروف"}
                      </span>

                      {latestExam?.sectionTitle && (
                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/50">
                          {latestExam.sectionTitle}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-2xl font-black leading-tight text-white sm:text-3xl">
                      {latestExam?.title || "اختبار غير معروف"}
                    </h3>

                    <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/45">
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCalendarCheck}
                          className="text-gold/80"
                        />

                        {formatDate(latestResult.submittedAt)}
                      </span>

                      <span>
                        الدرجة النهائية:{" "}
                        <span className="font-bold text-white/70">
                          {latestResult.total}
                        </span>
                      </span>
                    </div>

                    <Link
                      to={`/exam-result/${latestResult.examId}`}
                      className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-extrabold text-midnight transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_10px_25px_rgba(212,175,55,0.22)]"
                    >
                      عرض النتيجة كاملة
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end">
                    <div className="min-w-[170px] rounded-2xl border border-gold/15 bg-white/[0.03] px-8 py-7 text-center">
                      <p className="text-4xl font-black text-white sm:text-5xl">
                        {latestResult.score}
                        <span className="text-xl text-white/35">
                          /{latestResult.total}
                        </span>
                      </p>

                      <div className="mx-auto mt-4 h-px w-16 bg-gold/30" />

                      <p className="mt-4 text-3xl font-black text-gold">
                        {latestPercentage}%
                      </p>

                      <p className="mt-2 text-xs font-bold text-white/35">
                        نسبة النجاح في الاختبار
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Previous Results */}

            <section className="mt-12">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gold">السجل</p>

                  <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                    النتائج السابقة
                  </h2>
                </div>

                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/45">
                  {previousResults.length} نتيجة
                </span>
              </div>

              {previousResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {previousResults.map((result) => {
                    const exam = exams.find(
                      (exam) => String(exam.id) === String(result.examId),
                    );

                    const course = exam
                      ? courses.find(
                          (course) =>
                            String(course.id) === String(exam.courseId),
                        )
                      : null;

                    return (
                      <DashboardResultCard
                        key={result.id}
                        result={result}
                        exam={exam}
                        course={course}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl text-gold">
                    <FontAwesomeIcon icon={faClipboardCheck} />
                  </div>

                  <h3 className="text-lg font-extrabold text-white">
                    لا توجد نتائج سابقة
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-white/45">
                    هذه أول نتيجة مسجلة لك حتى الآن. استمر في أداء الاختبارات
                    لمتابعة تقدمك.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <DashboardEmptyState
            icon={faTrophy}
            title="لا توجد نتائج حتى الآن"
            description="لم تقم بحل أي اختبار بعد. عند إتمام أول اختبار ستظهر نتيجتك هنا."
            buttonText="استعراض الاختبارات"
            buttonTo="/dashboard-exams"
          />
        )}
      </div>
    </>
  );
}
