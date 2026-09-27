import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function formatPrice(price) {
  if (price === null || price === undefined) {
    return "غير محدد";
  }

  return `${new Intl.NumberFormat("ar-EG").format(price)} جنيه`;
}

export default function BookCard({ book }) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-2 hover:border-gold/35 hover:shadow-[0_25px_60px_rgba(0,0,0,0.30)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#071321]">
        <img
          src={book.image}
          alt={`صورة ${book.title}`}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071321]/75 via-[#071321]/10 to-transparent" />

        <div className="absolute bottom-4 right-4 rounded-lg border border-gold/30 bg-[#071321]/85 px-3 py-2 text-xs font-bold text-gold shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm">
          {book.grade}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.65)]" />
          <span className="text-xs font-bold text-gold/75">كتاب تعليمي</span>
        </div>

        <h3 className="mb-4 min-h-[4rem] text-xl font-extrabold leading-8 text-warm-white transition-colors duration-300 group-hover:text-gold sm:text-2xl">
          {book.title}
        </h3>

        <p className="mb-6 min-h-[5.25rem] text-sm leading-7 text-white/55 sm:text-base">
          {book.description}
        </p>

        <div className="mb-5 h-px w-full bg-gradient-to-l from-transparent via-white/10 to-transparent" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/55 sm:text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faGraduationCap} />
            </span>
            <span>{book.grade}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-extrabold text-gold sm:text-base">
            <span>{formatPrice(book.price)}</span>
          </div>
        </div>

        <Link
          to={`/books/${book.id}/purchase`}
          className="mt-auto flex w-full items-center justify-center gap-3 rounded-xl bg-gold px-5 py-3.5 text-sm font-extrabold text-midnight shadow-[0_8px_25px_rgba(212,175,55,0.10)] transition-all duration-300 hover:gap-5 hover:bg-gold-light hover:shadow-[0_12px_30px_rgba(212,175,55,0.20)]"
        >
          <span>شراء الكتاب</span>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      </div>

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-500 group-hover:w-1/2" />
    </article>
  );
}
