import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeroImg from "../../assets/Background/dashbord student home.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronDown,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { faTelegram } from "@fortawesome/free-brands-svg-icons";

// اسم كل قسم يظهر في الشريط الرفيع حسب أول جزء بعد /dashboard-master
const PAGE_TITLES = {
  students: "الطلاب",
  courses: "الكورسات والمحتوى",
  exams: "الامتحانات والأسئلة",
  results: "النتائج",
  subscriptions: "الاشتراكات وطلبات الاشتراك",
  "book-requests": "طلبات شراء الكتب",
  books: "الكتب والمذكرات",
  "lesson-access": "صلاحيات الدروس",
  settings: "الإعدادات",
};

export default function MasterTopbar({
  masterName = "مستر محمد خالد",
  telegramUrl = "https://t.me/mohamed25721",
}) {
  const { pathname } = useLocation();

  // الرئيسية فقط: /dashboard-master أو /dashboard-master/
  const isHome = pathname.replace(/\/+$/, "") === "/dashboard-master";

  if (isHome) {
    return <MasterHero masterName={masterName} telegramUrl={telegramUrl} />;
  }

  const section = pathname.split("/")[2];
  const title = PAGE_TITLES[section] ?? "لوحة التحكم";

  return (
    <MasterSlimBar
      title={title}
      masterName={masterName}
      telegramUrl={telegramUrl}
    />
  );
}

/* =========================================================
   Hero: الرئيسية فقط (نفس الشكل الأصلي بدون تغيير)
========================================================= */

function MasterHero({ masterName, telegramUrl }) {
  return (
    <section
      dir="rtl"
      className="relative border-b border-white/10 py-20 lg:py-24"
    >
      <img
        src={HeroImg}
        alt="لوحة الطالب"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#061522]/14" />

      <div className="absolute inset-0 bg-gradient-to-l from-[#061522]/53 via-[#061522]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/40 via-[#061522]/10 to-transparent" />

      <div className="relative z-10 flex w-full sm:items-center items-start flex-col sm:flex-row sm:justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* ================= Right Side: Identity ================= */}

        <div className="flex min-w-0 items-center gap-4">
          <div className="cursor-pointer flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-black/30 text-xl text-gold backdrop-blur-md">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide text-gold/80 sm:text-sm">
              لوحة التحكم
            </p>

            <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
              مرحبًا بك يا {masterName}
            </h1>
            <p className="mt-4 max-w-xl text-sm font-bold leading-8 text-white/75 sm:text-base">
              لوحة التحكم الرئيسية لمنصة الغازي في التاريخ لإدارة الطلاب
              والكورسات والامتحانات والطلبات بسهولة.
            </p>
          </div>
        </div>

        {/* ================= Left Side: Actions ================= */}

        <MasterTopbarActions
          masterName={masterName}
          telegramUrl={telegramUrl}
        />
      </div>
    </section>
  );
}

/* =========================================================
   Slim Bar: باقي صفحات لوحة المستر
========================================================= */

function MasterSlimBar({ title, masterName, telegramUrl }) {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 border-b border-white/10 bg-midnight/90 backdrop-blur-md"
    >
      {/* pl-20 على الموبايل عشان زر القائمة الثابت (همبرجر) ما يغطيش الأزرار */}
      <div className="flex h-16 items-center justify-between gap-4 pl-20 pr-4 sm:pr-6 xl:pl-10 xl:pr-10">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-wide text-gold/80">
            لوحة التحكم
          </p>

          <h1 className="truncate text-lg font-black text-white sm:text-xl">
            {title}
          </h1>
        </div>

        <MasterTopbarActions
          masterName={masterName}
          telegramUrl={telegramUrl}
          compact
        />
      </div>
    </header>
  );
}

/* =========================================================
   Actions: Telegram + قائمة الحساب (مشتركة بين الشكلين)
========================================================= */

function MasterTopbarActions({ masterName, telegramUrl, compact = false }) {
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

  const wrapperClass = compact
    ? "flex shrink-0 items-center gap-2 sm:gap-3"
    : "flex shrink-0 items-center gap-5 sm:gap-3 pt-3 sm:pt-0";

  const telegramClass = compact
    ? "flex h-10 items-center gap-2 rounded-xl border border-gold/25 bg-gold/10 px-3 text-sm font-extrabold text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight sm:px-4"
    : "flex h-12 items-center gap-2 rounded-xl border border-gold/30 bg-black/30 px-3 text-sm font-extrabold text-gold backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight sm:px-4";

  const profileButtonClass = compact
    ? "flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-white transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.08]"
    : "flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 text-white backdrop-blur-md transition-all duration-300 hover:border-gold/40 hover:bg-black/40";

  return (
    <div className={wrapperClass}>
      {/* Telegram */}

      <a
        href={telegramUrl}
        target="_blank"
        rel="noreferrer"
        className={telegramClass}
      >
        <FontAwesomeIcon icon={faTelegram} className="text-lg" />

        <span className="hidden md:inline">
          تواصل مع الطلاب على Telegram
        </span>
      </a>

      {/* Profile Menu */}

      <div ref={profileRef} className="relative">
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className={profileButtonClass}
          aria-label="فتح قائمة الحساب"
          aria-expanded={isProfileOpen}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80">
            <FontAwesomeIcon icon={faUser} className="text-sm" />
          </span>

          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xs text-white/60 transition-transform duration-300 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 sm:right-auto sm:left-0 top-[calc(100%+10px)] z-[4000] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1828] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
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
  );
}
