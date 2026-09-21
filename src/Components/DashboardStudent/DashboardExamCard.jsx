import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClipboardCheck,
  faBookOpen,
  faClock,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

export default function DashboardExamCard({
  exam,
  courseTitle,
  status,
  result,
}) {
  const percentage = result
    ? Math.round((result.score / result.total) * 100)
    : null;

  const formattedEndDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(exam.endsAt));

  return (
    <article className="group rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
            <FontAwesomeIcon icon={faClipboardCheck} />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-white transition-colors duration-300 group-hover:text-gold">
              {exam.title}
            </h3>

            <p className="mt-1 text-xs text-white/40">{courseTitle}</p>

            <p className="mt-1 text-xs text-white/35">{exam.sectionTitle}</p>
          </div>
        </div>

        {status === "available" && (
          <span className="shrink-0 rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-[11px] font-bold text-gold">
            متاح الآن
          </span>
        )}

        {status === "completed" && (
          <span className="shrink-0 rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold text-emerald-300">
            تم الحل
          </span>
        )}

        {status === "expired" && (
          <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-white/45">
            انتهى الموعد
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-white/5 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/45">
          <FontAwesomeIcon icon={faBookOpen} className="text-gold" />
          {exam.totalQuestions} سؤال
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-white/45">
          <FontAwesomeIcon icon={faClock} className="text-gold" />
          {exam.durationMinutes} دقيقة
        </div>

        {status === "expired" && (
          <div className="text-xs font-semibold text-white/35">
            انتهى في {formattedEndDate}
          </div>
        )}
      </div>

      {status === "completed" && result && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-xs text-white/40">النتيجة</p>

            <p className="mt-1 text-base font-black text-white">
              {result.score}/{result.total}
            </p>
          </div>

          <div className="text-left">
            <p className="text-lg font-black text-gold">{percentage}%</p>
          </div>
        </div>
      )}

      {status === "available" && (
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 text-sm font-extrabold text-midnight transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
        >
          بدء الاختبار
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}

      {status === "completed" && (
        <Link
          to="/exam-result"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3.5 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
        >
          عرض النتيجة
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      )}

      {status === "expired" && (
        <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3.5 text-sm font-bold text-white/30">
          لا يمكن بدء الاختبار
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
    </article>
  );
}
