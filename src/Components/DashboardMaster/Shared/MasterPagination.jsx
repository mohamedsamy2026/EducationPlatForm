import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default function MasterPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  itemLabel = "طالب",
}) {
  if (pageCount <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const first = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = [];
  for (let current = first; current <= Math.min(pageCount, first + 4); current += 1)
    pages.push(current);
  return (
    <nav
      aria-label="التنقل بين الصفحات"
      className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-xs font-bold text-white/40">
        عرض {start}–{end} من {total} {itemLabel}
      </p>
      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="الصفحة السابقة"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/55 transition hover:border-gold/25 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            aria-current={number === page ? "page" : undefined}
            className={
              "h-9 min-w-9 rounded-lg px-2 text-xs font-extrabold transition " +
              (number === page
                ? "bg-gold text-midnight"
                : "border border-white/10 text-white/55 hover:border-gold/25 hover:text-gold")
            }
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="الصفحة التالية"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/55 transition hover:border-gold/25 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
    </nav>
  );
}
