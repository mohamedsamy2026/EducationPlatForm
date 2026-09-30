// COMPONENTS
import Home from "./Page/Home";

import Signup from "./Components/Signup";
import Login from "./Components/Login";
import CourseDetails from "./Components/CourseDetails";
import ExamResult from "./Components/ExamResult";
import Books from "./Page/Books";
import BookPurchase from "./Page/BookPurchase";
import ScrollToTop from "./Components/ScrollToTop";
import DashboardLayout from "./Components/DashboardStudent/DashboardLayout";

import DashboardHome from "./Page/DashboardStudent/DashboardHome";
import DashboardCourses from "./Page/DashboardStudent/DashboardCourses";
import DashboardBooks from "./Page/DashboardStudent/DashboardBooks";
import DashboardExams from "./Page/DashboardStudent/DashboardExams";
import DashboardResults from "./Page/DashboardStudent/DashboardResults";
import DashboardProfile from "./Page/DashboardStudent/DashboardProfile";
import DashboardSupport from "./Page/DashboardStudent/DashboardSupport";
import ExamInterface from "./Page/DashboardStudent/ExamInterface";
import LessonPage from "./Page/DashboardStudent/LessonPage";
import Subscription from "./Page/Subscription";

// Master Dashboard
import MasterLayout from "./Components/DashboardMaster/MasterLayout";
import MasterHome from "./Page/DashboardMaster/MasterHome";
import MasterPlaceholder from "./Page/DashboardMaster/MasterPlaceholder";
import MasterStudents from "./Page/DashboardMaster/MasterStudents";
import MasterStudentDetails from "./Page/DashboardMaster/MasterStudentDetails";

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
        <Route path="/books" element={<Books />} />
        <Route path="/books/:bookId/purchase" element={<BookPurchase />} />
        <Route path="/exam-result/:examId" element={<ExamResult />} />

        <Route path="/dashboard-student/exams/:examId" element={<ExamInterface />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/subscription/:courseId/:planId" element={<Subscription />} />

        {/* Master Dashboard */}
        <Route path="/dashboard-master" element={<MasterLayout />}>
          <Route index element={<MasterHome />} />
          <Route path="students" element={<MasterStudents />} />
          <Route path="students/:studentId" element={<MasterStudentDetails />} />
          {/* Keep the fallback after all implemented Master routes. */}
          <Route path="*" element={<MasterPlaceholder />} />
        </Route>

        {/* Student Dashboard */}
        <Route path="/dashboard-student" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="books" element={<DashboardBooks />} />
          <Route path="exams" element={<DashboardExams />} />
          <Route path="results" element={<DashboardResults />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="support" element={<DashboardSupport />} />
        </Route>
      </Routes>
    </>
  );
}
