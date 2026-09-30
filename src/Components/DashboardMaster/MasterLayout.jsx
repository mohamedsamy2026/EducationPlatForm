import { Outlet } from "react-router-dom";
import Sidebar from "./MasterSidebar";
export default function MasterLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-midnight text-white">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-72 shrink-0 border-l border-white/10 bg-[#0A1828] lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <p className="text-xl font-black text-white">
                لوحة المستر
              </p>np

              <p className="mt-1 text-xs text-white/45">
                الغازي في التاريخ
              </p>
            </div>
            <Sidebar/>

            <div className="flex-1" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-midnight/90 px-5 backdrop-blur-md lg:px-8">
            <div>
              <p className="text-sm font-bold text-white/50">
                لوحة التحكم
              </p>

              <h1 className="text-lg font-black text-white">
                مرحبًا بك يا مستر
              </h1>
            </div>
          </header>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}