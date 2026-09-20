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
      path: "/dashboard",
      icon: faHouse,
    },
    {
      name: "الكورسات",
      path: "/courses",
      icon: faBookOpen,
    },
    {
      name: "الاختبارات",
      path: "/exams",
      icon: faClipboardCheck,
    },
    {
      name: "النتائج",
      path: "/results",
      icon: faChartLine,
    },
    {
      name: "الملف الشخصي",
      path: "/profile",
      icon: faUser,
    },
    {
      name: "الدعم",
      path: "/support",
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
        className="text-xl cursor-pointer fixed right-8 top-23 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-[#071321]/90 text-gold shadow-lg backdrop-blur-md lg:hidden hover:bg-gold duration-300 hover:text-white"
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
        dir="rtl"
        className={`fixed right-0 top-0 z-[101] flex h-screen w-72 flex-col border-l border-white/10 bg-[#061522] shadow-[-15px_0_50px_rgba(0,0,0,0.35)] transition-transform duration-300 lg:sticky lg:top-20 lg:z-30 lg:h-[calc(100vh-80px)] lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 lg:justify-center">
          <div>
            <p className="text-lg font-black text-white">لوحة الطالب</p>
            <p className="mt-1 text-xs text-gray-300">الغازي في التاريخ</p>
          </div>

          {/* زرار اغلاق القائمه */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
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

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 cursor-pointer rounded-xl px-4 py-3 text-sm font-bold duration-300 bg-red-400/10 hover:bg-red-600/75 cursor-pointe hover:gap-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/5">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
            </span>

            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
