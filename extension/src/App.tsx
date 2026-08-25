import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Popup } from './pages/Popup';
import { isAuthenticated } from './services/api';
import './App.css';

const CONSENT_KEY = 'privacy_consent_v1';

function ConsentGate({ onConsent }: { onConsent: () => void }) {
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <p>Data collection declined. The extension cannot function without processing your resume data on our servers.</p>
        <p style={{ marginTop: '8px' }}>You can re-open the extension at any time to reconsider.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Before you begin — Data &amp; Privacy</h2>
      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        To optimize your resume, this extension sends the following data to the AI Job Board servers over an encrypted (HTTPS) connection:
      </p>
      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <li><strong>Your resume content</strong> (LaTeX or plain text you upload or paste)</li>
        <li><strong>Job descriptions</strong> you paste for comparison</li>
        <li><strong>Your account credentials</strong> (email &amp; hashed password, stored as an auth token in browser storage)</li>
      </ul>
      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        This data is used <strong>solely</strong> to perform ATS analysis and AI-powered resume optimization — the extension's single purpose. It is never sold or used for advertising.
      </p>
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
        Full details in our{' '}
        <a
          href="https://aijobboard.app/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          Privacy Policy
        </a>.
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={() => {
            localStorage.setItem(CONSENT_KEY, '1');
            onConsent();
          }}
        >
          I Agree — Continue
        </button>
        <button
          className="btn-secondary"
          style={{ flex: 1 }}
          onClick={() => setDeclined(true)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consented, setConsented] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setConsented(!!localStorage.getItem(CONSENT_KEY));
    setAuthenticated(isAuthenticated());
    setLoading(false);

    // Set initial theme on body
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!consented) {
    return <ConsentGate onConsent={() => setConsented(true)} />;
  }

  return (
    <>
      {!authenticated ? (
        <AuthForm onAuth={() => setAuthenticated(true)} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <Popup theme={theme} toggleTheme={toggleTheme} />
      )}
    </>
  );
}

export default App;
