// HooKs
import { useEffect } from "react";

// COMPONENTS
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import AboutPlatform from "../Components/AboutPlatform";
import Courses from "../Components/Courses";
import StudentOpinions from "../Components/StudentOpinions";
import Footer from "../Components/Footer";

export default function Home() {
  useEffect(() => {
    // 1. إضافة Smooth Scroll للـ html عند فتح صفحة الهوم
    document.documentElement.classList.add("scroll-smooth");

    if (!window.location.hash) return;

    const scrollToSection = () => {
      const element = document.querySelector(window.location.hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    setTimeout(scrollToSection, 70);
    // 2. مسح الكلاس عند الخروج من صفحة الهوم (Cleanup)
    return () => {
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutPlatform />
      <Courses />
      <StudentOpinions />
      <Footer />
    </div>
  );
}
