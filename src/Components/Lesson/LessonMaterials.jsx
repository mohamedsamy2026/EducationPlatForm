import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

function getGoogleDriveDownloadUrl(url) {
  if (!url) {
    return null;
  }

  const match = url.match(/\/file\/d\/([^/]+)/);

  if (!match) {
    return url;
  }

  const fileId = match[1];

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export default function LessonMaterials({
  materialUrl,
  materialTitle = "ملزمة الدرس",
}) {
  if (!materialUrl) {
    return null;
  }

  const downloadUrl = getGoogleDriveDownloadUrl(materialUrl);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-lg text-gold">
            <FontAwesomeIcon icon={faFilePdf} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-gold">
              ملف الدرس
            </p>

            <h2 className="mt-1 truncate text-sm font-extrabold text-white sm:text-base">
              {materialTitle}
            </h2>
          </div>
        </div>

        <a
          href={downloadUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
        >
          تحميل الملزمة
          <FontAwesomeIcon icon={faArrowDown} />
        </a>
      </div>
    </section>
  );
}