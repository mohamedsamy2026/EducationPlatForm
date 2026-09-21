// Import The Landing Page All
import Home from "./Page/Home";

// Components
import Chat from "./Components/Chat";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import CourseDetails from "./Components/CourseDetails";
import ExamResult from "./Components/ExamResult";
import DashboardHome from "./Page/DashboardStudent/DashboardHome";
import DashboardCourses from "./Page/DashboardStudent/DashboardCourses";

// Style App CSS
import "./App.css";

// Import React Router
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/exam-result" element={<ExamResult />} />
        <Route path="/dashboard-student" element={<DashboardHome />} />
        <Route path="/dashboard-courses" element={<DashboardCourses />} />
      </Routes>
      <Chat />
    </>
  );
}

export default App;
