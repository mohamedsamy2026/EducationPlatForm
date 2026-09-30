import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBars,
  faChevronDown,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { faTelegram } from "@fortawesome/free-brands-svg-icons";

export default function MasterTopbar({
  masterName = "المستر",
  telegramUrl = "https://web.telegram.org/",

}) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/90 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ================= Right Side ================= */}

        <div className="flex min-w-0 items-center gap-3">
  
          {/* Master Identity */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-white sm:text-base">
                {masterName}
              </p>

              <p className="truncate text-xs font-semibold text-white/45">
                لوحة تحكم المستر
              </p>
            </div>
          </div>
        </div>

        {/* ================= Left Side ================= */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telegram */}

          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-3 text-sm font-extrabold text-gold transition-all duration-300 hover:bg-gold hover:text-midnight hover:border-gold sm:px-4"
          >
            <FontAwesomeIcon icon={faTelegram} className="text-base" />

            <span className="hidden sm:inline">
              تواصل مع الطلاب على Telegram
            </span>

            <span className="sm:hidden">Telegram</span>
          </a>

          {/* Profile Menu */}

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-white transition-all duration-300 hover:border-gold/20 hover:bg-white/[0.07]"
              aria-label="فتح قائمة الحساب"
              aria-expanded={isProfileOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/70">
                <FontAwesomeIcon icon={faUser} className="text-sm" />
              </span>

              <span className="hidden max-w-24 truncate text-sm font-bold sm:block">
                {masterName}
              </span>

              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-white/45 transition-transform duration-300 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute left-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1828] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <div className="border-b border-white/10 px-3 py-3">
                  <p className="text-sm font-extrabold text-white">
                    {masterName}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white/45">
                    حساب المستر
                  </p>
                </div>

                <div className="mt-2 space-y-1">
                  <Link
                    to="/dashboard-master/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                      <FontAwesomeIcon icon={faGear} className="text-sm" />
                    </span>

                    <span>الإعدادات</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="text-sm"
                      />
                    </span>

                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}