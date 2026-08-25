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
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Check initial system or local preference
    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setTheme((curr) => {
      const next = curr === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 p-2.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-slate-600 dark:text-slate-300 cursor-pointer"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-amber-400" />
      )}
    </button>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      path: "/matches",
      label: "Resume Matches",
      icon: <Star className="w-4 h-4" />,
    },
    {
      path: "/resumes",
      label: "My Resumes",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      path: "/saved",
      label: "Saved Jobs",
      icon: <Bookmark className="w-4 h-4" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col justify-between fixed left-0 top-0 bg-white dark:bg-[#0e1526] border-r border-slate-200 dark:border-slate-800/80 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              AI Job Board
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Smart Career Match</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                }`}
              >
                <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Jobs" },
    { path: "/matches", icon: <Star className="w-5 h-5" />, label: "Matches" },
    { path: "/resumes", icon: <FileText className="w-5 h-5" />, label: "Resumes" },
    { path: "/saved", icon: <Bookmark className="w-5 h-5" />, label: "Saved" },
    { path: "/settings", icon: <SettingsIcon className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-white/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-2 z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-label={item.label}
            className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-150 ${
              isActive
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 md:ml-64 mb-16 md:mb-0">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeToggle />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ResumeMatches />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Resumes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <SavedJobs />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
