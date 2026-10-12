import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  UserCircle,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({
  onNavigate,
}: SidebarProps) => {
  const {
    user,
    logout,
  } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Members",
      path: "/members",
      icon: Users,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserCircle,
    },
  ];

  const getInitials = (
    name?: string
  ) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="flex h-full min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">

      {/* BRAND */}
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <FolderKanban size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              TaskFlow
            </h1>

            <p className="text-xs text-slate-500">
              Task Management
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <div className="px-4 pt-6">

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.9
                      }
                      className={
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 transition-colors group-hover:text-slate-600"
                      }
                    />

                    <span>
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* ADMIN */}
          {user?.role === "ADMIN" && (
            <>
              <div className="px-3 pb-2 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Administration
                </p>
              </div>

              <NavLink
                to="/users"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ShieldCheck
                      size={19}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.9
                      }
                      className={
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 transition-colors group-hover:text-slate-600"
                      }
                    />

                    <span>
                      Users
                    </span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            </>
          )}

        </nav>
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* USER AREA */}
      <div className="border-t border-slate-200 p-4">

        <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              {getInitials(user?.name)}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>

            </div>

          </div>

          <div className="mt-3">

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                user?.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user?.role === "ADMIN"
                ? "Administrator"
                : "Member"}
            </span>

          </div>

        </div>

        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut
            size={19}
            className="text-slate-400 transition-colors group-hover:text-red-500"
          />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;