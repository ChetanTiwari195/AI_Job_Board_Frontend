import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { signIn, signUp } from "../services/api";

interface AuthFormProps {
  onAuth: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function AuthForm({ onAuth, theme, toggleTheme }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      onAuth();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      onAuth();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        style={{ position: "absolute", top: "16px", right: "20px" }}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} color="white" />}
      </button>
      <h1>Resume Optimizer</h1>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="auth-toggle">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
