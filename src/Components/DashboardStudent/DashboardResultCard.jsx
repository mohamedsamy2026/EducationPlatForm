import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardResultCard({ result, exam, course }) {
  const percentage =
    result && Number(result.total) > 0
      ? Math.round((Number(result.score) / Number(result.total)) * 100)
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
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/20 hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-gold/5 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faTrophy} />
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-gold">
                {course?.title || "كورس غير معروف"}
              </p>

              <h3 className="mt-1 truncate text-base font-extrabold text-white sm:text-lg">
                {exam?.title || "اختبار غير معروف"}
              </h3>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-gold/15 bg-gold/10 px-3 py-2 text-center">
            <p className="text-lg font-black text-gold">{percentage}%</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/40">
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-gold/70" />
            {formatDate(result.submittedAt)}
          </span>

          <span>
            الدرجة:
            <span className="font-bold text-white/65 ps-1">
              {result.score}/{result.total}
            </span>
          </span>
        </div>

        <Link
          to={`/exam-result/${result.examId}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
        >
          عرض النتيجة
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      </div>
    </article>
  );
}
