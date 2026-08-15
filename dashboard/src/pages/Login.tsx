import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  
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
        setMessage(data.message || "Please check your email for the OTP.");
        return;
      }

      login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
        throw new Error(data.detail || "Invalid OTP");
      }

      const data = await res.json();
      login(data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
      <div className="neo-out p-8 w-full max-w-md bg-[var(--bg-color)]">
        <h2 className="text-2xl font-bold text-center text-[var(--text-color)] mb-6">
          {showOtpInput ? "Enter Verification Code" : (isLogin ? "Login to AI Job Board" : "Create an Account")}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center font-bold">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center font-bold">{message}</p>}

        {!showOtpInput ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-color)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="neo-input w-full px-4 py-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-color)] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="neo-input w-full px-4 py-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="neo-btn w-full py-3 px-4 mt-4"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--text-muted)] font-bold">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--primary)] hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--text-color)] mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                className="neo-input w-full px-4 py-3 text-center tracking-widest text-lg font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="neo-btn w-full py-3 px-4 mt-4"
            >
              Verify Code
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
                setMessage("");
              }}
              className="w-full bg-transparent border-2 border-[var(--border-color)] text-[var(--text-color)] font-bold py-3 px-4 transition-all hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] mt-2"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
