import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark,
  Settings as SettingsIcon,
  FileText,
  Star,
  Moon,
  Sun,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Resumes } from "./pages/Resumes";
import { SavedJobs } from "./pages/SavedJobs";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { ResumeMatches } from "./pages/ResumeMatches";
import { Landing } from "./pages/Landing";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ── Auth guard ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

// ── Global theme toggle (dashboard only) ───────────────────────────────────
const ThemeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(
    () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-(--bg-surface) border `border-(--border-subtle) cursor-pointer text-(--text-muted) hover:text-(--text-primary) transition-colors duration-150 shrink-0"
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV = [
  { path: "/dashboard", label: "Job Feed", icon: LayoutDashboard },
  { path: "/matches", label: "Resume Matches", icon: Star },
  { path: "/resumes", label: "My Resumes", icon: FileText },
  { path: "/saved", label: "Saved Jobs", icon: Bookmark },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 flex flex-col justify-between bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-30 transition-colors duration-200">
      {/* Brand */}
      <div>
        <div className="px-5 py-4 pb-4 border-b border-[var(--sidebar-border)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-blue-600 flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.2)] shrink-0">
            <Briefcase size={16} color="white" />
          </div>
          <div>
            <div className="text-sm font-normal text-[var(--text-primary)] tracking-tight leading-none">
              Linkbay
            </div>
            <div className="text-[11px] font-light text-[var(--text-muted)] mt-0.5">
              Smart Career Match
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="p-3 pt-3" aria-label="Dashboard navigation">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 no-underline text-sm transition-colors duration-150 ${active ? "font-normal text-[var(--sidebar-active-text)] bg-[var(--sidebar-active-bg)]" : "font-light text-[var(--sidebar-text)] bg-transparent hover:bg-[var(--sidebar-hover-bg)]"}`}
              >
                <Icon size={16} strokeWidth={active ? 1.75 : 1.5} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 pb-5 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-2 px-3 py-1.5 mb-1.5">
          <ThemeToggle />
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-none cursor-pointer bg-transparent text-sm font-light text-[var(--text-muted)] transition-colors duration-150 hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

// ── Mobile bottom nav ──────────────────────────────────────────────────────
const MobileNav: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Mobile navigation"
      className="flex fixed bottom-0 left-0 right-0 bg-[color-mix(in_srgb,var(--sidebar-bg)_95%,transparent)] backdrop-blur-md border-t border-[var(--sidebar-border)] justify-around items-center px-1 py-2 z-40"
    >
      {NAV.slice(0, 5).map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl no-underline transition-all duration-150 ${active ? "text-blue-600 bg-blue-600/10" : "text-[var(--text-muted)] bg-transparent"}`}
          >
            <Icon size={20} strokeWidth={active ? 1.75 : 1.5} />
            <span
              className={`text-[10px] ${active ? "font-normal" : "font-light"}`}
            >
              {label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// ── Dashboard layout ───────────────────────────────────────────────────────
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen flex bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-200">
    <div className="hidden md:block">
      <Sidebar />
    </div>
    <div className="hidden md:block w-60 shrink-0" />

    <main className="flex-1 min-w-0 pb-16 md:pb-0">
      <div className="animate-fade-in">{children}</div>
    </main>

    <div className="md:hidden">
      <MobileNav />
    </div>
  </div>
);

// ── App ─────────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {[
          { path: "/dashboard", el: <Dashboard /> },
          { path: "/matches", el: <ResumeMatches /> },
          { path: "/resumes", el: <Resumes /> },
          { path: "/saved", el: <SavedJobs /> },
          { path: "/settings", el: <Settings /> },
        ].map(({ path, el }) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <DashboardLayout>{el}</DashboardLayout>
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
