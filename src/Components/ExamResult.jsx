import ImgResult from "../assets/Background/Result Exam.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faCircleCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


export default function ExamResult() {
  const result = {
    score: 17,
    total: 20,
  };

  // الدرجه المئويه
  const percentage = Math.round((result.score / result.total) * 100);

  // عدد الاخطاء
  const mistakes = result.total - result.score;

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

  return (
    <section dir="rtl" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={ImgResult}
        alt="نتيجة الامتحان"
        className="absolute inset-0 h-full w-full"
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
              نتيجتك النهائية في الامتحان
            </h2>

            <FontAwesomeIcon
              icon={faTrophy}
              className="text-sm text-[#d7a83d]"
            />
          </div>

          {/* Subtitle */}
          <p className="mb-7 text-xs font-medium text-white/70 sm:text-sm">
            أحسنت! لقد أكملت الامتحان بنجاح
          </p>

          {/* Score */}
          <div className="mb-7 flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-[#c99b3b] bg-[#071824]/80 shadow-[0_0_25px_rgba(201,155,59,0.2)] sm:h-35 sm:w-35 gap-1">
            <span className="text-2xl font-black text-white sm:text-3xl">
              {result.score}/{result.total}
            </span>

            <span className="mt-1 text-lg font-bold text-[#d7a83d]">
              {percentage}%
            </span>
          </div>

          {/* Stats */}
          <div className="mb-8 grid w-full max-w-lg grid-cols-3 items-center gap-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-xs">
                الأسئلة الصحيحة
              </span>

              <span className="text-xl font-black text-white sm:text-3xl">
                {result.score}
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-white px-3">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-xs">
                النتيجة
              </span>

              <span className="text-xl font-black text-[#d7a83d] sm:text-3xl">
                {percentage}%
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-2 text-[10px] font-bold text-gray-300 sm:text-xs">
                الإجابات الخاطئة
              </span>

              <span className="text-xl font-black text-white sm:text-3xl">
                {mistakes}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-white/75 sm:text-sm">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#d7a83d]" />
            {message}
          </div>

          {/* Button */}
          <Link
            to="exams"
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
