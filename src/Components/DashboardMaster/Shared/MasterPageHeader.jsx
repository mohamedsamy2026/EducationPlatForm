import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MasterPageHeader({ title, description, actionLabel, actionTo, actionIcon, backTo, backLabel = "العودة" }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-extrabold text-gold">إدارة المنصة</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-sm font-bold leading-7 text-white/45">{description}</p>}
      </div>
      {backTo ? (
        <Link to={backTo} className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-extrabold text-white/65 transition hover:border-gold/25 hover:text-gold">
          <FontAwesomeIcon icon={faArrowLeft} />
          {backLabel}
        </Link>
      ) : actionLabel && actionTo ? (
        <Link to={actionTo} className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-gold/20 bg-gold/10 px-4 text-sm font-extrabold text-gold transition hover:bg-gold hover:text-midnight">
          {actionIcon && <FontAwesomeIcon icon={actionIcon} />}
          {actionLabel}
        </Link>
      ) : null}
    </header>
  );
}
