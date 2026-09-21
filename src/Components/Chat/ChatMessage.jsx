import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faComments,
  faImage,
  faHeadphones,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatMessage({ message }) {
  const isStudent = message.senderRole === "student";

  return (
    <div className={`flex ${isStudent ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[82%] ${isStudent ? "items-start" : "items-end"}`}>
        {message.type === "text" && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-7 ${isStudent ? "rounded-tr-md bg-gold text-midnight shadow-[0_8px_25px_rgba(212,175,55,0.12)]" : "rounded-tl-md border border-white/10 bg-[#142438] text-white/80"}`}
          >
            {message.text}
          </div>
        )}

        {message.type === "image" && (
          <div
            className={`overflow-hidden rounded-2xl border border-white/10 bg-[#142438] ${isStudent ? "rounded-tr-md" : "rounded-tl-md"}`}
          >
            <div className="flex h-32 items-center justify-center bg-white/[0.03] text-white/20">
              <FontAwesomeIcon icon={faImage} className="text-2xl" />
            </div>

            <div className="px-4 py-3 text-xs text-white/60">
              {message.text}
            </div>
          </div>
        )}

        {message.type === "audio" && (
          <div
            className={`flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-[#142438] px-4 py-3 ${isStudent ? "rounded-tr-md" : "rounded-tl-md"}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faHeadphones} className="text-sm" />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="h-px flex-1 bg-white/10" />
                <span className="h-px w-8 bg-gold/40" />
                <span className="h-px w-5 bg-white/10" />
              </div>

              <span className="text-[9px] text-white/35">
                رسالة صوتية • {message.duration}
              </span>
            </div>
          </div>
        )}

        <div
          className={`mt-1.5 flex items-center gap-1.5 text-[9px] text-white/30 ${isStudent ? "justify-start" : "justify-end"}`}
        >
          <span>{message.createdAt}</span>

          {isStudent && (
            <FontAwesomeIcon icon={faCheck} className="text-[8px] text-gold" />
          )}
        </div>
      </div>
    </div>
  );
}
