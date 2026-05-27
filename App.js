import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (payload) => setSession(payload);
  const handleLogout = () => setSession(null);

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <DashboardScreen session={session} onLogout={handleLogout} />;
}
