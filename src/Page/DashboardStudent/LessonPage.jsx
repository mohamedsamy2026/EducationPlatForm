import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import LessonVideo from "../../Components/Lesson/LessonVideo";

import LessonMaterials from "../../Components/Lesson/LessonMaterials";

import LessonContentList from "../../Components/Lesson/LessonContentList";

// SERVICES

import { getCurrentStudent } from "../../services/studentService";

import { getCourseById } from "../../services/courseService";

import { getUnitsByCourseId } from "../../services/lessonService";

import { getExamsByCourseId } from "../../services/examService";

import { isStudentEnrolled } from "../../services/enrollmentService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRight,
  faBookOpen,
  faClipboardCheck,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const DEMO_YOUTUBE_URL =
  "https://www.youtube.com/watch?v=Qq7igm8WmX0&pp=ygUN2LTYsditINi52YTZhQ%3D%3D";

const DEMO_DRIVE_URL =
  "https://drive.google.com/file/d/1kTskQwo8hevRYot9cxd4FgLIlppQbWeV/view?usp=drive_link";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();

  const navigate = useNavigate();

  const [course, setCourse] = useState(undefined);

  const [units, setUnits] = useState([]);

  const [exams, setExams] = useState([]);

  const [isEnrolled, setIsEnrolled] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLessonPage() {
      try {
        const [currentCourse, currentStudent] = await Promise.all([
          getCourseById(courseId),
          getCurrentStudent(),
        ]);

        if (cancelled) return;

        if (!currentCourse) {
          setCourse(null);
          setUnits([]);
          setExams([]);
          setIsEnrolled(false);
          return;
        }

        if (!currentStudent) {
          setCourse(currentCourse);
          setUnits([]);
          setExams([]);
          setIsEnrolled(false);
          return;
        }

        const [currentUnits, courseExams, enrolled] = await Promise.all([
          getUnitsByCourseId(courseId),
          getExamsByCourseId(courseId),
          isStudentEnrolled(currentStudent.id, courseId),
        ]);

        if (cancelled) return;

        setCourse(currentCourse);
        setUnits(currentUnits);
        setExams(courseExams);
        setIsEnrolled(enrolled);
      } catch {
        if (cancelled) return;

        setCourse(null);
        setUnits([]);
        setExams([]);
        setIsEnrolled(false);
      }
    }

    loadLessonPage();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (course && isEnrolled === false) {
      navigate(`/courses/${course.id}`, {
        replace: true,
      });
    }
  }, [course, isEnrolled, navigate]);

  const currentLessonInfo = useMemo(() => {
    for (const unit of units) {
      const lesson = unit.lessons.find(
        (lesson) => String(lesson.id) === String(lessonId),
      );

      if (lesson) {
        return {
          lesson,
          unit,
        };
      }
    }

    return null;
  }, [units, lessonId]);

  const currentLesson = currentLessonInfo?.lesson ?? null;

  const currentUnit = currentLessonInfo?.unit ?? null;

  //   من اول هنا هنذاكر بكره

  const relatedExam = useMemo(() => {
    if (!currentUnit) return null;

    return (
      exams.find((exam) => String(exam.unitId) === String(currentUnit.id)) ??
      null
    );
  }, [currentUnit, exams]);

  const isDemoLesson = String(currentLesson?.id) === "ss-prep-lesson-1";

  const videoUrl =
    currentLesson?.videoUrl ?? (isDemoLesson ? DEMO_YOUTUBE_URL : null);

  const materialUrl =
    currentLesson?.materialUrl ?? (isDemoLesson ? DEMO_DRIVE_URL : null);

  // Loading

  if (course === undefined || isEnrolled === null) {
    return null;
  }

  if (!course || !currentLesson) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-midnight px-5 py-16 text-white sm:px-8"
      >
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1a2b] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl text-gold">
            <FontAwesomeIcon icon={faPlay} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-white">
            الدرس غير موجود
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/45">
            لم نتمكن من العثور على الكورس أو الدرس المطلوب.
          </p>

          <Link
            to={courseId ? `/courses/${courseId}` : "/courses"}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
          >
            العودة إلى تفاصيل الكورس
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-midnight px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-10"
      onContextMenu={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-white/80">
          <Link
            to={`/courses/${course.id}`}
            className="transition-colors duration-300 hover:text-gold"
          >
            الكورسات
          </Link>

          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[9px] text-white/20"
          />

          <Link
            to={`/courses/${course.id}`}
            className="max-w-[220px] truncate transition-colors duration-300 hover:text-gold"
          >
            {course.title}
          </Link>

          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-[9px] text-white/20"
          />

          <span className="text-gold">{currentUnit.title}</span>
        </div>

        {/* Lesson Heading */}

        <header className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold">
            <FontAwesomeIcon icon={faPlay} />
            مشاهدة الدرس
          </div>

          <h1 className="max-w-4xl text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
            {currentLesson.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/40">
            <span>{course.title}</span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span>{currentUnit.title}</span>

            {currentLesson.duration && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />

                <span>{currentLesson.duration}</span>
              </>
            )}
          </div>
        </header>

        {/* Video */}

        <LessonVideo videoUrl={videoUrl} />

        {/* Lesson Info */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0c1a2b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-gold">تفاصيل الدرس</p>

              <h2 className="mt-1 text-xl font-black text-white">
                {currentLesson.title}
              </h2>

              {currentLesson.description ? (
                <p className="mt-3 max-w-4xl text-sm leading-8 text-white/55">
                  {currentLesson.description}
                </p>
              ) : (
                <p className="mt-3 max-w-4xl text-sm leading-8 text-white/35">
                  لا توجد تفاصيل إضافية لهذا الدرس حاليًا.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Materials + Exam */}

        {(materialUrl || relatedExam) && (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {materialUrl && (
              <LessonMaterials
                materialUrl={materialUrl}
                materialTitle={currentLesson.materialTitle || "ملزمة الدرس"}
              />
            )}

            {relatedExam && (
              <section className="rounded-2xl border border-gold/15 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.08),transparent_45%),#0c1a2b] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-lg text-gold">
                      <FontAwesomeIcon icon={faClipboardCheck} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gold">
                        اختبار مرتبط بالوحدة
                      </p>

                      <h2 className="mt-1 truncate text-sm font-extrabold text-white sm:text-base">
                        {relatedExam.title}
                      </h2>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard-student/exams/${relatedExam.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
                  >
                    بدء الاختبار
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Course Content */}

        <div className="mt-6">
          <LessonContentList
            units={units}
            courseId={course.id}
            currentLessonId={currentLesson.id}
          />
        </div>
      </div>
    </main>
  );
}
