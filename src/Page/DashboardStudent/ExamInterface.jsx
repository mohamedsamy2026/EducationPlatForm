import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ExamQuestionCard from "../../Components/DashboardStudent/ExamQuestionCard";
import ExamQuestionNavigator from "../../Components/DashboardStudent/ExamQuestionNavigator";
import ExamTimer from "../../Components/DashboardStudent/ExamTimer";

import exams from "../../date/exams";
import questions from "../../date/questions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faClipboardCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function ExamInterface() {

  const { examId } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const exam = useMemo(
    () => exams.find((exam) => String(exam.id) === String(examId)),
    [examId],
  );

  const examQuestions = useMemo(
    () =>
      questions
        .filter((question) => String(question.examId) === String(examId))
        .sort((a, b) => a.order - b.order),
    [examId],
  );

  const currentQuestion = examQuestions[currentIndex] || null;

  const calculateAutoScore = useCallback(
    (submittedAnswers) => {
      let score = 0;
      let totalAutoScore = 0;
      let essayCount = 0;
      let correctAnswers = 0;
      let incorrectAnswers = 0;

      examQuestions.forEach((question) => {
        if (question.type === "essay") {
          essayCount += 1;
          return;
        }

        totalAutoScore += Number(question.score) || 0;

        const answer = submittedAnswers[question.id];

        if (
          answer !== undefined &&
          String(answer) === String(question.correctAnswer)
        ) {
          score += Number(question.score) || 0;
          correctAnswers += 1;
        } else {
          incorrectAnswers += 1;
        }
      });

      return {
        score,
        totalAutoScore,
        essayCount,
        correctAnswers,
        incorrectAnswers,
      };
    },
    [examQuestions],
  );

  const handleSubmit = useCallback(
    (submittedAnswers = answersRef.current, automatic = false) => {
      if (examQuestions.length === 0) {
        return;
      }

      const autoScore = calculateAutoScore(submittedAnswers);

      const submission = {
        examId,
        answers: submittedAnswers,
        ...autoScore,
        submittedAt: new Date().toISOString(),
        automatic,
      };

      setShowSubmitConfirmation(false);

      sessionStorage.setItem(
        `exam-attempt-${examId}`,
        JSON.stringify(submission),
      );

      navigate(`/exam-result/${examId}`);
    },
    [calculateAutoScore, examId, examQuestions.length, navigate],
  );

  const handleAutoSubmit = useCallback(() => {
    handleSubmit(answersRef.current, true);
  }, [handleSubmit]);

  const handleAnswerChange = (answer) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectQuestion = (index) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentIndex(index);
    }
  };

    
  if (!exam || examQuestions.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1a2b] p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl text-gold">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-white">
            الاختبار غير متاح
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/45">
            لم نتمكن من العثور على الاختبار أو أسئلته حاليًا.
          </p>

          <Link
            to="/dashboard-student/exams"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
          >
            العودة إلى الاختبارات
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Exam Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#091726]">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#10243a]/55 blur-[110px]" />

        <div className="relative z-10 px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs font-bold text-gold">
                  <FontAwesomeIcon icon={faClipboardCheck} />
                  الاختبار
                </span>

                <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                  {exam.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-white/45">
                  <span>{exam.sectionTitle}</span>

                  <span className="h-1 w-1 rounded-full bg-white/20" />

                  <span>{examQuestions.length} سؤال</span>

                  <span className="h-1 w-1 rounded-full bg-white/20" />

                  <span>{exam.durationMinutes} دقيقة</span>
                </div>
              </div>

              <ExamTimer
                durationMinutes={exam.durationMinutes}
                onTimeUp={handleAutoSubmit}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exam Body */}
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
          <div className="min-w-0">
            {/* Progress */}
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0c1a2b] px-4 py-3">
              <span className="text-xs font-bold text-white/40">
                السؤال {currentIndex + 1} من {examQuestions.length}
              </span>

              <span className="text-xs font-bold text-gold">
                {Object.keys(answers).length} مجاب
              </span>
            </div>

            <ExamQuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
            />

            {/* Controls */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-extrabold text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FontAwesomeIcon icon={faArrowRight} />
                السابق
              </button>

              {currentIndex < examQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
                >
                  التالي
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmation(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
                >
                  تسليم الاختبار
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              )}
            </div>
          </div>

          {/* Navigator */}
          <div className="xl:sticky xl:top-28 xl:self-start">
            <ExamQuestionNavigator
              questions={examQuestions}
              currentIndex={currentIndex}
              answers={answers}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1a2b] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-lg text-gold">
              <FontAwesomeIcon icon={faClipboardCheck} />
            </div>

            <h2 className="mt-5 text-xl font-black text-white">
              هل تريد تسليم الاختبار؟
            </h2>

            <p className="mt-2 text-sm leading-7 text-white/45">
              بعد التسليم لن تتمكن من تعديل إجاباتك في هذه المحاولة.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => handleSubmit(answersRef.current, false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
              >
                تأكيد التسليم
                <FontAwesomeIcon icon={faCheck} />
              </button>

              <button
                type="button"
                onClick={() => setShowSubmitConfirmation(false)}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-extrabold text-white/65 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
              >
                متابعة الاختبار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
