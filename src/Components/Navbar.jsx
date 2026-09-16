import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import logoImg from "../assets/Logo/transparent-Logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "#heroSection" },
    { name: "من نحن", href: "#aboutPlatform" },
    { name: "الكورسات", href: "#courses" },
    { name: "آراء طلابنا", href: "#StudentOpinions" },
    { name: "تواصل معنا", href: "#footer" },
  ];

  // تغيير شكل الـ Navbar عند الـ Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // الانتقال للـ Sections
  const handleScrollTo = (href) => {
    setIsOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-80
        transition-all duration-500
        ${
          isScrolled
            ? "bg-midnight/90 backdrop-blur-xl border-b border-gold/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            : "bg-black/15 backdrop-blur-md border-b border-white/5"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="h-20 lg:h-22 flex items-center justify-between">
          
          {/* ================= Logo ================= */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="shrink-0 group"
          >
            <div className="flex items-center">
              <img
                src={logoImg}
                alt="الغازي في التاريخ"
                className="
                  w-11 h-11
                  lg:w-[77px] lg:h-[77px]
                  object-contain
                  transition-transform duration-300
                  group-hover:scale-105
                "
              />
            </div>
          </Link>

          {/* ================= Desktop Links ================= */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="
                  relative
                  text-warm-white
                  text-sm
                  font-bold
                  py-2
                  transition-colors duration-300
                  hover:text-gold
                  after:absolute
                  after:right-0
                  after:bottom-0
                  after:h-[2px]
                  after:w-0
                  after:bg-gold
                  after:transition-all
                  after:duration-300
                  hover:after:w-full
                "
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* ================= Auth Buttons ================= */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="
                px-5 py-2.5
                rounded-lg
                border border-gold/70
                text-warm-white
                text-sm
                font-bold
                transition-all duration-300
                hover:bg-gold
                hover:text-midnight
                hover:border-gold
              "
            >
              تسجيل الدخول
            </Link>

            <Link
              to="/signup"
              className="
                px-5 py-2.5
                rounded-lg
                bg-gold
                text-midnight
                text-sm
                font-extrabold
                shadow-[0_6px_20px_rgba(212,175,55,0.18)]
                transition-all duration-300
                hover:bg-gold-light
                hover:-translate-y-0.5
                hover:shadow-[0_10px_25px_rgba(212,175,55,0.28)]
              "
            >
              إنشاء حساب
            </Link>
          </div>

          {/* ================= Mobile Button ================= */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className="
              lg:hidden
              w-11 h-11
              flex items-center justify-center
              rounded-lg
              bg-gold
              cursor-pointer
              text-warm-white
              text-[22px]
              transition-all duration-300
              hover:bg-gold/89
            "
          >
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
          </button>
        </div>

        {/* ================= Mobile Menu ================= */}
        <div
          className={`
            lg:hidden
            overflow-hidden
            transition-all duration-500 ease-in-out
            ${
              isOpen
                ? "max-h-[500px] opacity-100 pb-5"
                : "max-h-0 opacity-0 pb-0 pointer-events-none"
            }
          `}
        >
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-midnight/95
              backdrop-blur-xl
              p-3
              shadow-[0_15px_40px_rgba(0,0,0,0.3)]
            "
          >
            {/* Mobile Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleScrollTo(link.href)}
                  className="
                    block
                    w-full
                    text-right
                    px-4 py-3.5
                    rounded-lg
                    text-warm-white
                    font-bold
                    transition-all duration-300
                    hover:bg-gold/10
                    hover:text-gold
                  "
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="
                  text-center
                  px-4 py-3
                  rounded-lg
                  border border-gold/70
                  text-warm-white
                  font-bold
                  text-sm
                  transition-all duration-300
                  hover:bg-gold
                  hover:text-midnight
                "
              >
                تسجيل الدخول
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="
                  text-center
                  px-4 py-3
                  rounded-lg
                  bg-gold
                  text-midnight
                  font-extrabold
                  text-sm
                  transition-all duration-300
                  hover:bg-gold-light
                "
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}