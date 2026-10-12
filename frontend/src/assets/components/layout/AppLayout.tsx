import {
  useState,
  type ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({
  children,
}: AppLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* ====================================
            DESKTOP SIDEBAR
        ==================================== */}

        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* ====================================
            MOBILE MENU
        ==================================== */}

        {mobileMenuOpen && (
          <>
            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 cursor-default bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
            />

            {/* DRAWER */}

            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden">

              {/* MOBILE HEADER */}

              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    T
                  </div>

                  <div>
                    <p className="text-sm font-bold tracking-tight text-slate-900">
                      TaskFlow
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Task Management
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>

              </div>

              {/* MOBILE NAVIGATION */}

              <div className="h-[calc(100vh-4rem)] overflow-y-auto">

                <Sidebar
                  onNavigate={closeMobileMenu}
                />

              </div>

            </aside>
          </>
        )}

        {/* ====================================
            MAIN APPLICATION
        ==================================== */}

        <div className="min-w-0 flex-1">

          <Topbar
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="min-w-0">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
};

export default AppLayout;