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
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {showOtpInput ? "Enter Verification Code" : (isLogin ? "Login to AI Job Board" : "Create an Account")}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        {!showOtpInput ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-hidden focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-hidden focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-hidden focus:border-blue-500 text-center tracking-widest text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
