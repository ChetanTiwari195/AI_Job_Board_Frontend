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
      login(data.access_token); navigate("/dashboard");
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

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-[var(--bg-app)]">
      {/* Subtle gradient mesh behind card */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(37,99,235,0.06)_0%,transparent_60%)]" />

      <div className="card animate-modal-scale relative z-10 w-full max-w-[420px] p-9 overflow-hidden">
        {/* Indigo accent top strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--primary-border)] to-[var(--primary)]" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-[0_4px_12px_rgba(37,99,235,0.25)]">
            {showOtpInput ? <ShieldCheck size={22} color="white" /> : <Briefcase size={22} color="white" />}
          </div>
          <h1 className="text-[22px] font-light text-[var(--text-primary)] m-0 mb-1.5 tracking-tight [font-feature-settings:'ss01']">
            {showOtpInput ? "Security Verification" : (isLogin ? "Sign in to Linkbay" : "Create your account")}
          </h1>
          <p className="text-sm font-light text-[var(--text-muted)] m-0">
            {showOtpInput ? "Enter the 6-digit code sent to your email" : (isLogin ? "Welcome back. Enter your details to continue." : "Start discovering AI-matched opportunities.")}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[var(--s-danger-bg)] border border-[var(--s-danger-border)] text-[var(--s-danger-text)] text-[13px] font-light mb-5">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}
        {message && (
          <div className="animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[var(--s-success-bg)] border border-[var(--s-success-border)] text-[var(--s-success-text)] text-[13px] font-light mb-5">
            <CheckCircle2 size={14} className="shrink-0" /> {message}
          </div>
        )}

        {!showOtpInput ? (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-normal text-[var(--text-muted)] mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="name@example.com" autoComplete="email" className="s-input w-full px-3.5 py-2.5 text-[15px] font-light text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--s-hairline-input)] rounded-lg outline-none font-sans transition-all duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]" />
              </div>
              <div>
                <label className="block text-xs font-normal text-[var(--text-muted)] mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete={isLogin ? "current-password" : "new-password"} className="s-input w-full px-3.5 py-2.5 text-[15px] font-light text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--s-hairline-input)] rounded-lg outline-none font-sans transition-all duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center p-3 text-[15px] mt-1 rounded-full">
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                  : <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>
                }
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
              <p className="text-[13px] font-light text-[var(--text-muted)] m-0">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
                  className="bg-transparent border-none text-blue-600 font-normal text-[13px] cursor-pointer underline p-0">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-normal text-[var(--text-muted)] mb-1.5 text-center">Verification Code</label>
              <input type="text" maxLength={6} placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} autoFocus required
                className="s-input w-full px-3.5 py-2.5 text-[22px] font-normal text-center tracking-[0.4em] font-mono text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--s-hairline-input)] rounded-lg outline-none transition-all duration-150 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]" />
            </div>
            <button type="submit" disabled={submitting || otp.length < 6} className="btn-primary w-full justify-center p-3 text-[15px] rounded-full">
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</> : "Verify Code"}
            </button>
            <button type="button" onClick={() => { setShowOtpInput(false); setOtp(""); setMessage(""); setError(""); }}
              className="btn-ghost w-full justify-center rounded-full">
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
