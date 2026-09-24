import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrophy,
  faCircleCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import ImgResult from "../assets/Background/Result Exam.jpg";

// SERVICES

import { getCurrentStudent } from "../services/studentService";
import { getExamById } from "../services/examService";
import { getResultByExamId } from "../services/resultService";

export default function ExamResult() {
  const { examId } = useParams();

  const [exam, setExam] = useState(undefined);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExamResult() {
      try {
        const [currentStudent, currentExam] = await Promise.all([
          getCurrentStudent(),
          getExamById(examId),
        ]);

        if (cancelled) return;

        setExam(currentExam);

        if (!currentStudent || !currentExam) {
          setResult(null);
          return;
        }

        const studentResult = await getResultByExamId(
          examId,
          currentStudent.id,
        );

        if (cancelled) return;

        setResult(studentResult);
      } catch {
        if (cancelled) return;

        setExam(null);
        setResult(null);
      }
    }

    loadExamResult();

    return () => {
      cancelled = true;
    };
  }, [examId]);

  const [attempt] = useState(() => {
    try {
      const storedAttempt = sessionStorage.getItem(`exam-attempt-${examId}`);

      return storedAttempt ? JSON.parse(storedAttempt) : null;
    } catch {
      return null;
    }
  });

  /*
   * تحديد مصدر النتيجة:
   * - محاولة جديدة محفوظة في sessionStorage
   * - أو النتيجة القديمة من results.jsx
   */

  const hasNewAttempt = Boolean(attempt);

  const displayScore = hasNewAttempt
    ? Number(attempt.score) || 0
    : Number(result?.score) || 0;

  const displayTotal = hasNewAttempt
    ? Number(attempt.totalAutoScore) || 0
    : Number(result?.total) || 0;

  const essayCount = hasNewAttempt ? Number(attempt.essayCount) || 0 : 0;

  const hasPendingEssay = essayCount > 0;

  /*
   * في المحاولة الجديدة:
   * - الصحيحة والخاطئة يتم حسابهم وقت التسليم.
   *
   * في النتيجة القديمة:
   * - نحسبهم من score / total.
   */

  const correctAnswers = hasNewAttempt
    ? Number(attempt.correctAnswers) || 0
    : displayScore;

  const mistakes = hasNewAttempt
    ? Number(attempt.incorrectAnswers) || 0
    : Math.max(0, displayTotal - displayScore);

  const percentage =
    displayTotal > 0 ? Math.round((displayScore / displayTotal) * 100) : 0;

  const getResultMessage = (percentage) => {
    if (percentage >= 90) {
      return "ممتاز جدًا! أداء رائع، استمر في التقدم!";
    }

    if (percentage >= 75) {
      return "أحسنت! نتيجة ممتازة، استمر في التقدم!";
    }

    if (percentage >= 50) {
      return "جيد جدًا! حاول تراجع أخطاءك وتطور مستواك.";
    }

    return "لا بأس! راجع الدروس وحاول مرة أخرى.";
  };

  const message = getResultMessage(percentage);

  // أثناء تحميل بيانات الامتحان والنتيجة

  if (exam === undefined) {
    return null;
  }

  // لو مفيش امتحان أصلًا،
  // أو مفيش محاولة جديدة ولا نتيجة قديمة.

  if (!exam || (!attempt && !result)) {
    return (
      <section dir="rtl" className="relative min-h-screen overflow-hidden">
        <img
          src={ImgResult}
          alt="نتيجة الاختبار"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#03101a]/25" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            <h2 className="mb-4 text-2xl font-black text-white sm:text-3xl">
              لم يتم العثور على نتيجة الاختبار
            </h2>

            <p className="mb-6 text-sm text-white/60 sm:text-base">
              لم يتم العثور على نتيجة مرتبطة بهذا الاختبار والطالب الحالي.
            </p>

            <Link
              to="/dashboard-student/exams"
              className="group flex items-center gap-2 rounded-md border border-[#b98c32] bg-[#091b27]/90 px-5 py-2.5 text-xs font-bold text-[#d7a83d] transition-all duration-300 hover:bg-[#d7a83d] hover:text-[#06131f] sm:px-7 sm:py-3 sm:text-sm"
            >
              <span>العودة إلى الاختبارات</span>

              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[10px] transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}

      <img
        src={ImgResult}
        alt="نتيجة الاختبار"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-[#03101a]/25" />

      {/* Content */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          {/* Title */}

          <div className="mb-3 flex items-center justify-center gap-2">
            <FontAwesomeIcon
              icon={faTrophy}
              className="text-sm text-[#d7a83d]"
            />

            <h2 className="text-base font-extrabold leading-relaxed text-[#d7a83d] sm:text-lg">
              {hasPendingEssay
                ? "نتيجتك الحالية في الاختبار"
                : "نتيجتك النهائية في الاختبار"}
            </h2>

            <FontAwesomeIcon
              icon={faTrophy}
              className="text-sm text-[#d7a83d]"
            />
          </div>

          {/* Subtitle */}

          <p className="mb-7 text-xs font-medium text-gray-200 sm:text-sm">
            {hasPendingEssay
              ? "تم تصحيح الأسئلة الموضوعية، والأسئلة المقالية قيد المراجعة."
              : "أحسنت! لقد أكملت الاختبار بنجاح."}
          </p>

          {/* Score */}

          <div className="mb-7 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-2 border-[#c99b3b] bg-[#071824]/80 shadow-[0_0_25px_rgba(201,155,59,0.2)] sm:h-35 sm:w-35">
            <span className="text-2xl font-black text-white sm:text-3xl">
              {displayScore}/{displayTotal}
            </span>

            <span className="mt-1 text-lg font-bold text-[#d7a83d]">
              {percentage}%
            </span>
          </div>

          {/* Pending Essay Notice */}

          {hasPendingEssay && (
            <div className="mb-7 w-full max-w-lg rounded-xl border border-[#d7a83d]/20 bg-[#071824]/75 px-5 py-4">
              <p className="text-sm font-bold leading-7 text-[#d7a83d]">
                لديك {essayCount} أسئلة مقالية قيد التصحيح.
              </p>

              <p className="mt-1 text-xs font-bold leading-6 text-white/90">
                الدرجة المعروضة حاليًا خاصة بالأسئلة التي تم تصحيحها تلقائيًا،
                وستتحدث النتيجة بعد مراجعة المدرس.
              </p>
            </div>
          )}

          {/* Stats */}

          <div className="mb-8 grid w-full max-w-lg grid-cols-3 items-center gap-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-sm">
                الأسئلة الصحيحة
              </span>

              <span className="text-xl font-black text-white sm:text-3xl">
                {correctAnswers}
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-white px-3">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-sm">
                النتيجة
              </span>

              <span className="text-xl font-black text-[#d7a83d] sm:text-3xl">
                {percentage}%
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-sm">
                الإجابات الخاطئة
              </span>

              <span className="text-xl font-black text-white sm:text-3xl">
                {mistakes}
              </span>
            </div>
          </div>

          {/* Message */}

          {!hasPendingEssay && (
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-white/75 sm:text-sm">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-[#d7a83d]"
              />

              {message}
            </div>
          )}

          {/* Button */}

          <Link
            to="/dashboard-student/exams"
            className="group flex items-center gap-2 rounded-md border border-[#b98c32] bg-[#091b27]/90 px-5 py-2.5 text-xs font-bold text-[#d7a83d] transition-all duration-300 hover:bg-[#d7a83d] hover:text-[#06131f] sm:px-7 sm:py-3 sm:text-sm"
          >
            <span>العودة إلى الاختبارات</span>

            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-[10px] transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
