import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faBookOpen,
  faCheck,
  faClock,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

function formatPrice(price) {
  if (price === null || price === undefined) {
    return "غير محدد";
  }

  return `${new Intl.NumberFormat("ar-EG").format(price)} جنيه`;
}

export default function DashboardBookCard({ book, purchaseStatus = null }) {
  const isPending = purchaseStatus === "pending";
  const isApproved = purchaseStatus === "approved";
  const isRejected = purchaseStatus === "rejected";

  return (
    <article className=" flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_15px_45px_rgba(0,0,0,0.18)] hover:-translate-y-2 duration-300 hover:border-gold/30 hover:shadow-[0_20px_55px_rgba(0,0,0,0.25)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#071321]">
        <img
          src={book.image}
          alt={`صورة ${book.title}`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071321]/80 via-transparent to-transparent" />

        <div className="absolute bottom-4 right-4 rounded-lg border border-gold/20 bg-[#071321]/90 px-3 py-2 text-xs font-bold text-gold backdrop-blur-sm">
          {book.grade}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-gold/75">
          <FontAwesomeIcon icon={faBookOpen} />
          كتاب تعليمي
        </div>

        <h2 className="mb-4 min-h-[4rem] text-xl font-extrabold leading-8 text-warm-white transition-colors duration-300 group-hover:text-gold">
          {book.title}
        </h2>

        <p className="mb-5 text-sm leading-7 text-white/50">
          {book.description}
        </p>

        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
          <span className="text-sm font-bold text-white/40">السعر</span>

          <span className="text-lg font-black text-gold">
            {formatPrice(book.price)}
          </span>
        </div>

        {isApproved ? (
          <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3.5 text-sm font-extrabold text-emerald-300">
            <FontAwesomeIcon icon={faCheck} />
            تم شراء الكتاب
          </div>
        ) : isPending ? (
          <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3.5 text-sm font-extrabold text-gold">
            <FontAwesomeIcon icon={faClock} />
            الطلب قيد المراجعة
          </div>
        ) : isRejected ? (
          <Link
            to={`/books/${book.id}/purchase`}
            className="mt-auto flex w-full items-center justify-center gap-3 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-3.5 text-sm font-extrabold text-red-300 transition-all duration-300 hover:border-red-300/30 hover:bg-red-400/15"
          >
            <FontAwesomeIcon icon={faRotateRight} />
            إعادة طلب الشراء
          </Link>
        ) : (
          <Link
            to={`/books/${book.id}/purchase`}
            className="mt-auto flex w-full items-center justify-center gap-3 rounded-xl bg-gold px-5 py-3.5 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light hover:gap-4"
          >
            <span>شراء الكتاب</span>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        )}
      </div>
    </article>
  );
}
