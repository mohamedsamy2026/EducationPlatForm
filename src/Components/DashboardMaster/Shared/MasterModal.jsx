import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// نافذة عامة للنماذج والتفاصيل (غير نافذة التأكيد)
export default function MasterModal({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
  isBusy = false,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape" && !isBusy) onClose();
    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isBusy, onClose]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

  return createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 z-[4500] flex items-start justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className={`my-6 w-full ${widths[size] ?? widths.md} rounded-2xl border border-white/10 bg-[#0c1a2b] shadow-[0_18px_55px_rgba(0,0,0,0.45)]`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-xs font-bold leading-6 text-white/45">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <div className="px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-start sm:px-6">
            {footer}
          </footer>
        )}
      </section>
    </div>,
    document.body,
  );
}
