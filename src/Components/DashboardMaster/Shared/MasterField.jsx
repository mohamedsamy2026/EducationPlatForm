import { inputClass, textareaClass } from "./masterStyles";

// حقل نموذج موحّد: label + عنصر الإدخال + رسالة خطأ/تلميح
export default function MasterField({
  label,
  name,
  value,
  onChange,
  type = "text",
  as = "input",
  options = [],
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  rows = 4,
  min,
  max,
  dir,
}) {
  const handleChange = (event) => onChange(name, event.target.value);

  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center gap-1 text-xs font-extrabold text-white/60">
        {label}
        {required && <span className="text-gold">*</span>}
      </span>

      {as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={inputClass}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0c1a2b] text-white">
              {option.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          dir={dir}
          className={textareaClass}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          dir={dir}
          className={inputClass}
        />
      )}

      {error ? (
        <span className="mt-2 block text-xs font-bold text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs font-bold leading-6 text-white/35">{hint}</span>
      ) : null}
    </label>
  );
}
