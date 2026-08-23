import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setMessage(""); setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8002/api";
      const res = await fetch(`${API_BASE}/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": isLogin ? "application/x-www-form-urlencoded" : "application/json" },
        body: isLogin ? new URLSearchParams({ username: email, password }) : JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Authentication failed"); }
      const data = await res.json();
      if (data.require_otp) { setOtpToken(data.otp_token); setShowOtpInput(true); setMessage(data.message || "Check your email for the OTP code."); return; }
      login(data.access_token); navigate("/");
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8002/api";
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_token: otpToken, otp_code: otp }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Invalid verification code"); }
      const data = await res.json();
      login(data.access_token); navigate("/");
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", fontSize: 15, fontWeight: 300,
    color: "var(--text-primary)", background: "var(--bg-surface)",
    border: "1px solid var(--s-hairline-input)", borderRadius: 8,
    outline: "none", fontFamily: "inherit", transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 400, color: "var(--text-muted)", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-app)" }}>
      {/* Subtle gradient mesh behind card */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="card animate-modal-scale" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: 36, overflow: "hidden" }}>
        {/* Indigo accent top strip */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--primary), var(--primary-border), var(--primary))" }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}>
            {showOtpInput ? <ShieldCheck size={22} color="white" /> : <Briefcase size={22} color="white" />}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 300, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.4px", fontFeatureSettings: '"ss01"' }}>
            {showOtpInput ? "Security Verification" : (isLogin ? "Sign in to AI Job Board" : "Create your account")}
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: 0 }}>
            {showOtpInput ? "Enter the 6-digit code sent to your email" : (isLogin ? "Welcome back. Enter your details to continue." : "Start discovering AI-matched opportunities.")}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "var(--s-danger-bg)", border: "1px solid var(--s-danger-border)", color: "var(--s-danger-text)", fontSize: 13, fontWeight: 300, marginBottom: 20 }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}
        {message && (
          <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "var(--s-success-bg)", border: "1px solid var(--s-success-border)", color: "var(--s-success-text)", fontSize: 13, fontWeight: 300, marginBottom: 20 }}>
            <CheckCircle2 size={14} style={{ flexShrink: 0 }} /> {message}
          </div>
        )}

        {!showOtpInput ? (
          <>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="name@example.com" autoComplete="email" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--s-hairline-input)"; e.target.style.boxShadow = "none"; }} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete={isLogin ? "current-password" : "new-password"} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--s-hairline-input)"; e.target.style.boxShadow = "none"; }} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, marginTop: 4, borderRadius: 9999 }}>
                {submitting
                  ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in…</>
                  : <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>
                }
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 300, color: "var(--text-muted)", margin: 0 }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 400, fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ ...labelStyle, textAlign: "center" }}>Verification Code</label>
              <input type="text" maxLength={6} placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} autoFocus required
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.4em", fontSize: 22, fontFamily: "monospace", fontWeight: 400 }}
                onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--s-hairline-input)"; e.target.style.boxShadow = "none"; }} />
            </div>
            <button type="submit" disabled={submitting || otp.length < 6} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, borderRadius: 9999 }}>
              {submitting ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Verifying…</> : "Verify Code"}
            </button>
            <button type="button" onClick={() => { setShowOtpInput(false); setOtp(""); setMessage(""); setError(""); }}
              className="btn-ghost" style={{ width: "100%", justifyContent: "center", borderRadius: 9999 }}>
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
