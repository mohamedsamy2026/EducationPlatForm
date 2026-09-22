import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import DashboardSidebar from "./DashboardSidebar";
import Chat from "../Chat";

export default function DashboardLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <Navbar />

      <div className="flex w-full lg:min-h-screen">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Chat />

      <Footer />
    </div>
  );
}