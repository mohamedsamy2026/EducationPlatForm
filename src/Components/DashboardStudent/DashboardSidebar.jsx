import { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faBookOpen,
  faClipboardCheck,
  faChartLine,
  faUser,
  faHeadset,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "الرئيسية",
      path: "/dashboard-student",
      icon: faHouse,
    },
    {
      name: "الكورسات",
      path: "/dashboard-student/courses",
      icon: faBookOpen,
    },
    {
      name: "الاختبارات",
      path: "/dashboard-student/exams",
      icon: faClipboardCheck,
    },
    {
      name: "النتائج",
      path: "/dashboard-student/results",
      icon: faChartLine,
    },
    {
      name: "الملف الشخصي",
      path: "/dashboard-student/profile",
      icon: faUser,
    },
    {
      name: "الدعم",
      path: "/dashboard-student/support",
      icon: faHeadset,
    },
  ];

  // إغلاق القائمة فقط إذا كانت مفتوحة (منع Re-render غير ضروري على الديسك توب)
  const handleNavClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const handleLogout = () => {
    if (isOpen) setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* زر فتح القائمة */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-8 top-25 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gold/20 bg-[#071321]/90 text-xl text-gold shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-gold hover:text-white lg:right-14 xl:hidden"
        aria-label="فتح القائمة"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* خلفية معتمة */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 xl:hidden"
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={`
          fixed right-0 top-0 z-[101] h-screen w-72 flex-col border-l border-white/10 bg-[#0A1828] transition-transform duration-300 ease-in-out will-change-transform
          ${isOpen ? "translate-x-0" : "translate-x-full"}

          xl:sticky xl:top-0 xl:z-[81] xl:w-65 xl:translate-x-0
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 xl:justify-center">
          <div>
            <p className="text-lg font-black text-white">لوحة الطالب</p>
            <p className="mt-1 text-xs text-gray-300">الغازي في التاريخ</p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white xl:hidden"
            aria-label="إغلاق القائمة"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard-student"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                  isActive
                    ? "border border-gold/20 bg-gold/10 text-gold shadow-[0_8px_25px_rgba(212,175,55,0.08)]"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <FontAwesomeIcon icon={item.icon} className="text-sm" />
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="mb-1 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 lg:mb-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
            </span>

            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
