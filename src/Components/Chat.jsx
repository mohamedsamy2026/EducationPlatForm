import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faXmark,
  faPaperPlane,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import ChatMessage from "./Chat/ChatMessage";
import { getMessages, sendMessage } from "../services/chatService";

export default function Chat() {
  
  const messagesContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages,isOpen]);

  async function loadMessages() {
    const data = await getMessages();
    setMessages(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = await sendMessage({
      conversationId: "conversation-1",
      senderRole: "student",
      type: "text",
      text: message.trim(),
    });

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح المساعد الدراسي"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-gold/30 bg-midnight text-gold shadow-[0_10px_35px_rgba(0,0,0,0.4),0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-[#13263b] hover:shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_30px_rgba(212,175,55,0.2)]"
      >
        <FontAwesomeIcon icon={faComments} className="text-xl" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-end sm:justify-start sm:p-5"
        >
          <div className="flex h-full w-full flex-col overflow-hidden border border-gold/20 bg-midnight shadow-[0_25px_80px_rgba(0,0,0,0.55)] sm:h-[620px] sm:w-[390px] sm:rounded-2xl">
            {/* Header */}
            <div className="relative flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0d1b2c] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                  <FontAwesomeIcon icon={faComments} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-warm-white">
                    مساعدك الدراسي
                  </h3>

                  <p className="mt-1 text-[11px] text-white/45">
                    اسأل، افهم، وراجع بسهولة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق الشات"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-red-500 text-white outline-0 transition-all duration-300 hover:bg-red-600"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Status */}
            <div className="flex shrink-0 items-center gap-2 border-b border-white/5 bg-[#0b1828] px-5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

              <span className="text-[11px] font-semibold text-white/50">
                الدعم الدراسي متاح
              </span>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.035),transparent_45%)] px-4 py-5"
            >
              <div className="mx-auto mb-5 max-w-[260px] text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                  <FontAwesomeIcon icon={faComments} />
                </div>

                <p className="text-xs font-bold text-white/65">
                  مساعدك في دراسة التاريخ
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/35">
                  ابعت سؤالك أو الجزء اللي محتاج مساعدة فيه.
                </p>
              </div>

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-white/10 bg-[#0d1b2c] p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 transition-all duration-300 focus-within:border-gold/30 focus-within:bg-white/[0.045]">
                <button
                  type="button"
                  aria-label="إرفاق صورة"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/40 transition-all duration-300 hover:bg-gold/10 hover:text-gold"
                >
                  <FontAwesomeIcon icon={faImage} />
                </button>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  rows={1}
                  className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/25"
                />

                <button
                  type="submit"
                  aria-label="إرسال الرسالة"
                  disabled={!message.trim()}
                  className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-midnight shadow-[0_5px_15px_rgba(212,175,55,0.15)] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_7px_20px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                </button>
              </div>

              <p className="mt-2 text-center text-[9px] text-white/20">
                يمكنك إرسال سؤالك أو إرفاق صورة للجزء الذي تحتاج مساعدة فيه
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
