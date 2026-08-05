import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Popup } from './pages/Popup';
import { getSession } from './services/supabase';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((session) => setAuthenticated(!!session))
      .finally(() => setLoading(false));
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
