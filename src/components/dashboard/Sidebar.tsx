import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";
const linkInactive = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
const linkActive = "bg-slate-100 text-slate-900";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200" />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {user?.username ?? "Guest"}
            </div>
            <div className="text-xs text-slate-500">
              {user?.roles?.length ? user.roles.join(", ") : "Not signed in"}
            </div>
          </div>
        </div>
      </div>

      <nav className="px-2 pb-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <User className="h-4 w-4" />
          Profile
        </NavLink>

        <button
          className={`${linkBase} w-full text-left text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;