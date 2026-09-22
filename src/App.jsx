// Import The Landing Page All
import Home from "./Page/Home";

// Components
import Chat from "./Components/Chat";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import CourseDetails from "./Components/CourseDetails";
import ExamResult from "./Components/ExamResult";
import ScrollToTop from "./Components/ScrollToTop";

// Dashboard Pages
import DashboardHome from "./Page/DashboardStudent/DashboardHome";
import DashboardCourses from "./Page/DashboardStudent/DashboardCourses";
import DashboardExams from "./Page/DashboardStudent/DashboardExams";
import DashboardResults from "./Page/DashboardStudent/DashboardResults";
import DashboardProfile from "./Page/DashboardStudent/DashboardProfile";
import DashboardSupport from "./Page/DashboardStudent/DashboardSupport";

// Style App CSS
import "./App.css";

// Import React Router
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/exam-result/:examId" element={<ExamResult />} />

        {/* Student Dashboard Routes */}
        <Route path="/dashboard-student" element={<DashboardHome />} />
        <Route path="/dashboard-courses" element={<DashboardCourses />} />
        <Route path="/dashboard-exams" element={<DashboardExams />} />
        <Route path="/dashboard-results" element={<DashboardResults />} />
        <Route path="/dashboard-profile" element={<DashboardProfile />} />
        <Route path="/dashboard-support" element={<DashboardSupport />} />
      </Routes>
      <Chat />
    </>
  );
}