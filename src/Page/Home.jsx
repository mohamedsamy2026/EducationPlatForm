// COMPONENTS
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import AboutPlatform from "../Components/AboutPlatform";
import Courses from "../Components/Courses";
import StudentOpinions from "../Components/StudentOpinions";
import Footer from "../Components/Footer";

export default function Home() {
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
