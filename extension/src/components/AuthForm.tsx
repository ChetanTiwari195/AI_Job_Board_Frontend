import { useState } from 'react';
import { signIn, signUp, verifyOtp } from '../services/api';

interface AuthFormProps {
  onAuth: () => void;
}

export function AuthForm({ onAuth }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      setMode('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOtp(val);
    
    // Auto-verify when 6 digits are entered
    if (val.length === 6) {
      setError('');
      setLoading(true);
      try {
        await verifyOtp(email, val);
        onAuth();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification is handled by handleOtpChange automatically
  };

  if (mode === 'verify') {
    return (
      <div className="auth-form">
        <h2>Check your email</h2>
        <p className="muted">We sent a 6-digit verification code to {email}.</p>
        <form onSubmit={handleVerifySubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            required
            autoFocus
            style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
          />
          {error && <p className="error">{error}</p>}
          {loading && <p style={{ textAlign: 'center', color: '#666' }}>Verifying...</p>}
        </form>
        <p className="auth-toggle">
          <button onClick={() => { setMode('signup'); setError(''); setOtp(''); }}>
            Use a different email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h1>Resume Optimizer</h1>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
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
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="auth-toggle">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => { setMode('login'); setError(''); }}>Login</button>
          </>
        )}
      </p>
    </div>
  );
}
