import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Popup } from './pages/Popup';
import { isAuthenticated } from './services/api';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
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
