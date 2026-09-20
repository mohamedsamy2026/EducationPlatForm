import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function DashboardEmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonTo,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-xl text-gold">
        <FontAwesomeIcon icon={icon} />
      </div>

      <h3 className="text-lg font-extrabold text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-400">
        {description}
      </p>

      {buttonText && buttonTo && (
        <Link
          to={buttonTo}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-midnight transition-all duration-300 hover:bg-gold-light"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}