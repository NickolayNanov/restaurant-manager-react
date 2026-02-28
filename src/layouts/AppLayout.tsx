import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex min-h-screen w-full px-4 py-4">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
          <Sidebar />
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <Topbar />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout