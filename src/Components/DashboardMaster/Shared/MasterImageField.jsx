import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import readImageFile from "../../../utils/readImageFile";

// رفع صورة (مؤقت في الـ mock). لما نربط التخزين الحقيقي بيتبدل readImageFile برفع Cloudinary.
export default function MasterImageField({ label, value, onChange, hint, error }) {
  const [localError, setLocalError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";
    setLocalError("");

    try {
      onChange(await readImageFile(file));
    } catch (readError) {
      setLocalError(readError.message);
    }
  };

  const shownError = localError || error;

  return (
    <div>
      <span className="mb-2 block text-xs font-extrabold text-white/60">{label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#091625] p-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#071321] text-white/25">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faImage} className="text-2xl" />
          )}
        </div>
        <div className="min-w-0">
          <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-gold/20 bg-gold/10 px-4 text-xs font-extrabold text-gold transition hover:bg-gold hover:text-midnight">
            {value ? "تغيير الصورة" : "اختيار صورة"}
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
          {hint && <p className="mt-2 text-xs font-bold leading-6 text-white/35">{hint}</p>}
        </div>
      </div>
      {shownError && <span className="mt-2 block text-xs font-bold text-danger">{shownError}</span>}
    </div>
  );
}
