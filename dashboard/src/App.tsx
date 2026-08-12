import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark,
  Settings as SettingsIcon,
  FileText,
} from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Resumes } from "./pages/Resumes";
import { SavedJobs } from "./pages/SavedJobs";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { ResumeMatches } from "./pages/ResumeMatches";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { Star } from "lucide-react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState('light');
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <button onClick={toggle} className="fixed top-4 right-4 z-50 p-2 neo-out rounded-full flex items-center justify-center w-10 h-10 text-lg transition-all hover:neo-in cursor-pointer">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/matches",
      label: "Resume Matches",
      icon: <Star className="w-5 h-5" />,
    },
    {
      path: "/resumes",
      label: "My Resumes",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      path: "/saved",
      label: "Saved Jobs",
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 neo-out h-screen hidden md:block fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          AI Job Board
        </h2>
      </div>
      <nav className="px-4 mt-6 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "neo-in text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:neo-out-sm"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6">
        <button 
          onClick={logout}
          className="neo-btn w-full py-3 px-4 rounded-xl font-semibold cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

const MobileNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 neo-out flex justify-around p-3 z-40 rounded-t-2xl">
      <Link
        to="/"
        className={`p-2 rounded-xl transition-all ${location.pathname === "/" ? "neo-in text-[var(--primary)]" : "text-[var(--text-muted)] hover:neo-out-sm"}`}
      >
        <LayoutDashboard className="w-6 h-6" />
      </Link>
      <Link
        to="/matches"
        className={`p-2 rounded-xl transition-all ${location.pathname === "/matches" ? "neo-in text-[var(--primary)]" : "text-[var(--text-muted)] hover:neo-out-sm"}`}
      >
        <Star className="w-6 h-6" />
      </Link>
      <Link
        to="/resumes"
        className={`p-2 rounded-xl transition-all ${location.pathname === "/resumes" ? "neo-in text-[var(--primary)]" : "text-[var(--text-muted)] hover:neo-out-sm"}`}
      >
        <FileText className="w-6 h-6" />
      </Link>
      <Link
        to="/saved"
        className={`p-2 rounded-xl transition-all ${location.pathname === "/saved" ? "neo-in text-[var(--primary)]" : "text-[var(--text-muted)] hover:neo-out-sm"}`}
      >
        <Bookmark className="w-6 h-6" />
      </Link>
      <Link
        to="/settings"
        className={`p-2 rounded-xl transition-all ${location.pathname === "/settings" ? "neo-in text-[var(--primary)]" : "text-[var(--text-muted)] hover:neo-out-sm"}`}
      >
        <SettingsIcon className="w-6 h-6" />
      </Link>
    </nav>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 mb-16 md:mb-0 bg-transparent">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeToggle />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/matches" element={
            <PrivateRoute>
              <DashboardLayout><ResumeMatches /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/resumes" element={
            <PrivateRoute>
              <DashboardLayout><Resumes /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/saved" element={
            <PrivateRoute>
              <DashboardLayout><SavedJobs /></DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <DashboardLayout><Settings /></DashboardLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
