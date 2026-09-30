import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHammer } from "@fortawesome/free-solid-svg-icons";



export default function MasterPlaceholder() {


  return (
    <div className="bg-midnight min-h-screen">
      <div className="mx-auto flex min-h-[60vh] max-w-[1600px] items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="w-full max-w-xl rounded-2xl border border-dashed border-white/10 bg-[#0c1a2b] px-6 py-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-xl text-gold">
            <FontAwesomeIcon icon={faHammer} />
          </span>

          <h1 className="mt-5 text-2xl font-black text-white">الصفحه</h1>

          <p className="mt-3 text-sm font-bold leading-7 text-white/45">
            هذه الصفحة قيد التجهيز وستكون متاحة قريبًا.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-xs font-extrabold text-gold transition hover:bg-gold hover:text-midnight"
          >
            العودة للرئيسية
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
      </div>
    </div>
  );
}
