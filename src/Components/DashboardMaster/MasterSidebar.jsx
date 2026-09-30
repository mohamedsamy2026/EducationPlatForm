import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faHouse,
  faUsers,
  faBookOpen,
  faClipboardCheck,
  faChartLine,
  faCreditCard,
  faCartShopping,
  faBook,
  faKey,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import logoImg from "../../assets/Logo/transparent-Logo.png";

const navItems = [
  {
    name: "الرئيسية",
    path: "/dashboard-master",
    icon: faHouse,
  },
  {
    name: "الطلاب",
    path: "/dashboard-master/students",
    icon: faUsers,
  },
  {
    name: "الكورسات والمحتوى",
    path: "/dashboard-master/courses",
    icon: faBookOpen,
  },
  {
    name: "الامتحانات والأسئلة",
    path: "/dashboard-master/exams",
    icon: faClipboardCheck,
  },
  {
    name: "النتائج",
    path: "/dashboard-master/results",
    icon: faChartLine,
  },
  {
    name: "الاشتراكات وطلبات الاشتراك",
    path: "/dashboard-master/subscriptions",
    icon: faCreditCard,
  },
  {
    name: "طلبات شراء الكتب",
    path: "/dashboard-master/book-requests",
    icon: faCartShopping,
  },
  {
    name: "الكتب والمذكرات",
    path: "/dashboard-master/books",
    icon: faBook,
  },
  {
    name: "صلاحيات الدروس",
    path: "/dashboard-master/lesson-access",
    icon: faKey,
  },
  {
    name: "الإعدادات",
    path: "/dashboard-master/settings",
    icon: faGear,
  },
];

export default function MasterSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/login");
  };

  return createPortal(
    <div dir="rtl">
      {/* زر الهمبرجر في أقصى الشمال للشاشات الصغيرة */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed left-5 top-5 z-[800] flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gold/20 bg-[#071321]/95 text-lg text-gold shadow-[0_8px_25px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:bg-gold hover:text-midnight xl:hidden"
          aria-label="فتح قائمة لوحة التحكم"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {/* الخلفية عند فتح القائمة على الموبايل */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[80] cursor-pointer bg-black/60 backdrop-blur-[2px] xl:hidden"
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[100] flex h-screen xl:w-[290px] flex-col border-l border-white/10 bg-[#0A1828] shadow-[-10px_0_40px_rgba(0,0,0,0.18)] duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } xl:translate-x-0`}
      >
        {/* رأس الـSidebar */}
        <div className="shrink-0 border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                <img
                  src={logoImg}
                  alt="الغازي في التاريخ"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold text-white">
                  لوحة المستر
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-white/45">
                  الغازي في التاريخ
                </p>
              </div>
            </div>

            {/* زر الإغلاق للموبايل */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-white/55 transition-all duration-200 hover:bg-white/10 hover:text-white xl:hidden"
              aria-label="إغلاق القائمة"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* روابط الـSidebar */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard-master"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "border-gold/20 bg-gold/10 text-gold shadow-[0_8px_25px_rgba(212,175,55,0.07)]"
                      : "border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gold/15 text-gold"
                          : "bg-white/[0.04] text-white/45 group-hover:bg-white/[0.06] group-hover:text-white"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-sm" />
                    </span>

                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* تسجيل الخروج */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm font-bold text-red-400 transition-all duration-200 hover:bg-red-500/15 hover:text-red-300"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
            </span>

            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
