import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Popup } from './pages/Popup';
import { isAuthenticated } from './services/api';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AuthForm onAuth={() => setAuthenticated(true)} />;
  }

  return <Popup />;
}

export default App;
