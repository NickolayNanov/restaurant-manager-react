import { Bell, Settings } from "lucide-react";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-6">
      <h1 className="text-lg font-semibold text-slate-900">Restaurant Manager</h1>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 hover:bg-slate-100" aria-label="Notifications">
          <Bell className="h-5 w-5 text-slate-700" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Settings">
          <Settings className="h-5 w-5 text-slate-700" />
        </button>

        <div className="h-9 w-9 rounded-full bg-slate-200" aria-label="User avatar" />
      </div>
    </header>
  );
}

export default Topbar;