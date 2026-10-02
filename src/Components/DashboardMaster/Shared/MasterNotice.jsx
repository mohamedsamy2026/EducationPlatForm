// شريط رسالة (نجاح / خطأ) يظهر أعلى الصفحة
export default function MasterNotice({ type = "success", children, onClose }) {
  if (!children) return null;

  const styles =
    type === "error"
      ? "border-danger/25 bg-danger/10 text-danger"
      : "border-success/25 bg-success/10 text-success";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`mb-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-bold leading-7 ${styles}`}
    >
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="إخفاء الرسالة"
          className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
