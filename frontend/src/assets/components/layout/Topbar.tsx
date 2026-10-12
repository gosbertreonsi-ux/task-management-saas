import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({
  onMenuClick,
}: TopbarProps) => {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={21} />
          </button>

          {/* MOBILE BRAND */}

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-base font-bold tracking-tight text-slate-900">
              TaskFlow
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative hidden md:block">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="h-9 w-48 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-56 lg:w-64"
            />

            <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:block">
              /
            </span>
          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white"
              aria-hidden="true"
            />
          </button>

          {/* DIVIDER */}

          <div className="hidden h-7 w-px bg-slate-200 sm:block" />

          {/* USER INFO */}

          <div className="hidden min-w-0 text-right sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-slate-900 lg:max-w-48">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role === "ADMIN"
                ? "Administrator"
                : "Member"}
            </p>
          </div>

          {/* AVATAR */}

          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm"
            title={user?.name || "User"}
            aria-label={`User: ${user?.name || "User"}`}
          >
            {getInitials(user?.name)}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Topbar;