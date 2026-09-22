import { useState } from "react";
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
      path: "/dashboard-courses",
      icon: faBookOpen,
    },
    {
      name: "الاختبارات",
      path: "/dashboard-exams",
      icon: faClipboardCheck,
    },
    {
      name: "النتائج",
      path: "/dashboard-results",
      icon: faChartLine,
    },
    {
      name: "الملف الشخصي",
      path: "/dashboard-profile",
      icon: faUser,
    },
    {
      name: "الدعم",
      path: "/dashboard-support",
      icon: faHeadset,
    },
  ];

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* زرار فتح القائمه */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xl cursor-pointer fixed lg:right-14 right-8 top-25 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-[#071321]/90 text-gold shadow-lg backdrop-blur-md xl:hidden hover:bg-gold duration-300 hover:text-white"
        aria-label="فتح القائمة"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* عامل زي دف عامل تعمييم علي الصفحه كلها */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={`
          fixed right-0 top-0 z-[101] h-screen w-72 flex-col bg-[#0A1828] border-l border-white/10 transition-transform
          ${isOpen ? "translate-x-0" : "translate-x-full"}

          xl:sticky xl:top-0 xl:z-81 xl:w-65 xl:translate-x-0
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 xl:justify-center">
          <div>
            <p className="text-lg font-black text-white">لوحة الطالب</p>
            <p className="mt-1 text-xs text-gray-300">الغازي في التاريخ</p>
          </div>

          {/* زرار إغلاق القائمة (يظهر فقط على الشاشات الأصغر من xl) */}
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
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
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

        <div className="border-t border-white/10 p-4 absolute bottom-0 left-0 right-0">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:text-red-300 lg:mb-0 mb-1"
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
