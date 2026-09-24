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
   

    if (!window.location.hash) return;

    const scrollToSection = () => {
      const element = document.querySelector(window.location.hash);

      if (element) {
        element.scrollIntoView({
          block: "start",
        });
      }
    };

    setTimeout(scrollToSection, 70);

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
