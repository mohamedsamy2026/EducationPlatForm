// COMPONENTS

import DashboardEmptyState from "../../Components/DashboardStudent/EmptyState";

import DashboardExamCard from "../../Components/DashboardStudent/DashboardExamCard";

// SERVICES

import { getCurrentStudent } from "../../services/studentService";

import { getExamsByCourseId } from "../../services/examService";

import { getResultsByStudentId } from "../../services/resultService";

import { getEnrollmentsByStudentId } from "../../services/enrollmentService";

import { getCourses } from "../../services/courseService";

// ICONS

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

// HOOKS

import { useEffect, useState } from "react";

export default function DashboardExams() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentExams, setStudentExams] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      try {
        const student = await getCurrentStudent();

        if (cancelled) return;

        setCurrentStudent(student);

        if (!student) {
          setStudentExams([]);
          return;
        }

        const [studentEnrollments, studentResults, allCourses] =
          await Promise.all([
            getEnrollmentsByStudentId(student.id),
            getResultsByStudentId(student.id),
            getCourses(),
          ]);

        if (cancelled) return;

        const enrolledCourseIds = studentEnrollments
          .filter(
            (enrollment) =>
              enrollment.studentId === student.id &&
              enrollment.status === "active",
          )
          .map((enrollment) => enrollment.courseId);

        const examGroups = await Promise.all(
          enrolledCourseIds.map((courseId) => getExamsByCourseId(courseId)),
        );

        if (cancelled) return;

        const exams = examGroups.flat();

        const now = new Date();

        const formattedExams = exams
          .map((exam) => {
            const result = studentResults.find(
              (result) =>
                result.studentId === student.id && result.examId === exam.id,
            );

            let status = "available";

            const startDate = new Date(exam.startsAt);
            const endDate = new Date(exam.endsAt);

            if (result) {
              status = "completed";
            } else if (now > endDate) {
              status = "expired";
            } else if (now < startDate) {
              return null;
            }

            const course = allCourses.find(
              (course) => course.id === exam.courseId,
            );

            return {
              exam,
              result,
              status,
              courseTitle: course?.title || "كورس غير معروف",
            };
          })
          .filter(Boolean);

        setStudentExams(formattedExams);
      } catch {
        if (cancelled) return;

        setCurrentStudent(null);
        setStudentExams([]);
      }
    }

    loadExams();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableExams = studentExams.filter(
    (item) => item.status === "available",
  );

  const completedExams = studentExams.filter(
    (item) => item.status === "completed",
  );

  const expiredExams = studentExams.filter((item) => item.status === "expired");

  return (
    <>
      {/* Page Header */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#091726] pt-20 lg:pt-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />

        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold lg:mt-3">
              <FontAwesomeIcon icon={faClipboardCheck} />
              اختباراتك
            </span>

            <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              الاختبارات
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
              تابع اختبارات الكورسات المشترك فيها واعرف نتائجك بعد كل اختبار.
            </p>
          </div>
        </div>
      </section>

      {/* Exams Content */}

      <section className="relative overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="pointer-events-none absolute right-1/2 top-20 h-80 w-80 translate-x-1/2 rounded-full bg-gold/5 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
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
    </>
  );
}
