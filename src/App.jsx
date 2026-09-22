// COMPONENTS
import Home from "./Page/Home";

import Signup from "./Components/Signup";
import Login from "./Components/Login";
import CourseDetails from "./Components/CourseDetails";
import ExamResult from "./Components/ExamResult";
import ScrollToTop from "./Components/ScrollToTop";
import DashboardLayout from "./Components/DashboardStudent/DashboardLayout";

import DashboardHome from "./Page/DashboardStudent/DashboardHome";
import DashboardCourses from "./Page/DashboardStudent/DashboardCourses";
import DashboardExams from "./Page/DashboardStudent/DashboardExams";
import DashboardResults from "./Page/DashboardStudent/DashboardResults";
import DashboardProfile from "./Page/DashboardStudent/DashboardProfile";
import DashboardSupport from "./Page/DashboardStudent/DashboardSupport";
import ExamInterface from "./Page/DashboardStudent/ExamInterface";

import "./App.css";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/exam-result/:examId" element={<ExamResult />} />

        {/* Dashboard Student */}
        <Route path="/dashboard-student" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="exams" element={<DashboardExams />} />
          <Route path="exams/:examId" element={<ExamInterface />} />
          <Route path="results" element={<DashboardResults />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="support" element={<DashboardSupport />} />
        </Route>
      </Routes>
    </>
  );
}
