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
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "https://ai-job-board-backend-6s14.onrender.com/api" : "http://localhost:8002/api");
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? new URLSearchParams({ username: email, password: password })
        : JSON.stringify({ email, password });

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": isLogin
            ? "application/x-www-form-urlencoded"
            : "application/json",
        },
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Authentication failed");
      }

      const data = await res.json();
      
      if (data.require_otp) {
        setOtpToken(data.otp_token);
        setShowOtpInput(true);
        setMessage(data.message || "Please check your email for the OTP verification code.");
        return;
      }

      login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "https://ai-job-board-backend-6s14.onrender.com/api" : "http://localhost:8002/api");
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp_token: otpToken, otp_code: otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid verification code");
      }

      const data = await res.json();
      login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/70 dark:bg-[#090d16] transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-slate-950/60 relative overflow-hidden animate-modal-scale">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
            {showOtpInput ? <ShieldCheck className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {showOtpInput 
              ? "Security Verification" 
              : (isLogin ? "Sign in to AI Job Board" : "Create your account")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {showOtpInput 
              ? "Enter the 6-digit code sent to your email" 
              : (isLogin ? "Welcome back! Enter your details to continue" : "Start discovering AI-matched opportunities")}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-2.5 text-xs font-medium text-rose-700 dark:text-rose-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {!showOtpInput ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setMessage("");
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-widest text-xl font-bold font-mono text-slate-900 dark:text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting || otp.length < 6}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "Verify Code"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
                setMessage("");
                setError("");
              }}
              className="w-full py-2.5 px-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
