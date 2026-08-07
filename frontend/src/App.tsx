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
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen hidden md:block fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          AI Job Board
        </h2>
      </div>
      <nav className="px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-40">
      <Link
        to="/"
        className={`p-2 ${location.pathname === "/" ? "text-blue-400" : "text-gray-500"}`}
      >
        <LayoutDashboard className="w-6 h-6" />
      </Link>
      <Link
        to="/matches"
        className={`p-2 ${location.pathname === "/matches" ? "text-blue-400" : "text-gray-500"}`}
      >
        <Star className="w-6 h-6" />
      </Link>
      <Link
        to="/resumes"
        className={`p-2 ${location.pathname === "/resumes" ? "text-blue-400" : "text-gray-500"}`}
      >
        <FileText className="w-6 h-6" />
      </Link>
      <Link
        to="/saved"
        className={`p-2 ${location.pathname === "/saved" ? "text-blue-400" : "text-gray-500"}`}
      >
        <Bookmark className="w-6 h-6" />
      </Link>
      <Link
        to="/settings"
        className={`p-2 ${location.pathname === "/settings" ? "text-blue-400" : "text-gray-500"}`}
      >
        <SettingsIcon className="w-6 h-6" />
      </Link>
    </nav>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 mb-16 md:mb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
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
