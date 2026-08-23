import React from "react";
import {
  BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate,
} from "react-router-dom";
import {
  LayoutDashboard, Bookmark, Settings as SettingsIcon, FileText,
  Star, Moon, Sun, LogOut, Briefcase,
} from "lucide-react";
import { Dashboard }     from "./pages/Dashboard";
import { Resumes }       from "./pages/Resumes";
import { SavedJobs }     from "./pages/SavedJobs";
import { Settings }      from "./pages/Settings";
import { Login }         from "./pages/Login";
import { ResumeMatches } from "./pages/ResumeMatches";
import { Landing }       from "./pages/Landing";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ── Auth guard ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

// ── Global theme toggle (dashboard only) ───────────────────────────────────
const ThemeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
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
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 32, height: 32, borderRadius: 9999,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        cursor: "pointer",
        color: "var(--text-muted)",
        transition: "background 0.15s ease, color 0.15s ease",
        touchAction: "manipulation",
        flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV = [
  { path: "/dashboard", label: "Job Feed",       icon: LayoutDashboard },
  { path: "/matches",   label: "Resume Matches", icon: Star },
  { path: "/resumes",   label: "My Resumes",     icon: FileText },
  { path: "/saved",     label: "Saved Jobs",     icon: Bookmark },
  { path: "/settings",  label: "Settings",       icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { logout }   = useAuth();

  return (
    <aside style={{
      width: 240, height: "100vh", position: "fixed", left: 0, top: 0,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--sidebar-border)",
      zIndex: 30,
      transition: "background 0.2s ease, border-color 0.2s ease",
    }}>
      {/* Brand */}
      <div>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--sidebar-border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(37,99,235,0.2)", flexShrink: 0 }}>
            <Briefcase size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.2px", lineHeight: 1 }}>AI Job Board</div>
            <div style={{ fontSize: 11, fontWeight: 300, color: "var(--text-muted)", marginTop: 2 }}>Smart Career Match</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "12px 12px 0" }} aria-label="Dashboard navigation">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link key={path} to={path} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, marginBottom: 2,
                textDecoration: "none", fontSize: 14, fontWeight: active ? 400 : 300,
                color: active ? "var(--sidebar-active-text)" : "var(--sidebar-text)",
                background: active ? "var(--sidebar-active-bg)" : "transparent",
                transition: "background 0.12s ease, color 0.12s ease",
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover-bg)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Icon size={16} strokeWidth={active ? 1.75 : 1.5} />
                {label}
                {active && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", opacity: 0.8 }} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 12px 20px", borderTop: "1px solid var(--sidebar-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", marginBottom: 6 }}>
          <ThemeToggle />
        </div>
        <button onClick={logout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
          background: "transparent", fontSize: 14, fontWeight: 300, color: "var(--text-muted)",
          transition: "background 0.12s ease, color 0.12s ease",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
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
    <nav aria-label="Mobile navigation" style={{
      display: "flex", position: "fixed", bottom: 0, left: 0, right: 0,
      background: "color-mix(in srgb, var(--sidebar-bg) 95%, transparent)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--sidebar-border)",
      justifyContent: "space-around", alignItems: "center",
      padding: "8px 4px", zIndex: 40,
    }}>
      {NAV.slice(0, 5).map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} aria-label={label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "8px 12px", borderRadius: 10, textDecoration: "none",
            color: active ? "var(--primary)" : "var(--text-muted)",
            background: active ? "rgba(37,99,235,0.06)" : "transparent",
            transition: "all 0.15s ease",
          }}>
            <Icon size={20} strokeWidth={active ? 1.75 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: active ? 400 : 300 }}>{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
};

// ── Responsive sidebar styles ─────────────────────────────────────────────
const SIDEBAR_MEDIA_STYLE = `
  .sidebar-desktop { display: none; }
  .mobile-nav { display: flex; }
  .main-pb { padding-bottom: 64px; }
  @media (min-width: 768px) {
    .sidebar-desktop { display: block; }
    .mobile-nav { display: none; }
    .main-pb { padding-bottom: 0; }
  }
`;

// ── Dashboard layout ───────────────────────────────────────────────────────
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-app)", color: "var(--text-primary)", transition: "background 0.2s ease, color 0.2s ease" }}>
    <style>{SIDEBAR_MEDIA_STYLE}</style>
    <div className="sidebar-desktop"><Sidebar /></div>
    <div className="sidebar-desktop" style={{ width: 240, flexShrink: 0 }} />

    <main className="main-pb" style={{ flex: 1, minWidth: 0 }}>
      <div className="animate-fade-in">{children}</div>
    </main>

    <div className="mobile-nav" style={{ bottom: 0, left: 0, right: 0, position: "fixed" }}>
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
          { path: "/matches",   el: <ResumeMatches /> },
          { path: "/resumes",   el: <Resumes /> },
          { path: "/saved",     el: <SavedJobs /> },
          { path: "/settings",  el: <Settings /> },
        ].map(({ path, el }) => (
          <Route key={path} path={path} element={
            <PrivateRoute>
              <DashboardLayout>{el}</DashboardLayout>
            </PrivateRoute>
          } />
        ))}
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
