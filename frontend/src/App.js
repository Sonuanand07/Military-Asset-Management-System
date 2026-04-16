import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import Navigation from './components/Navigation';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  if (!token || !userData) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  return (
    <Router>
{localStorage.getItem('user') && <Navigation user={user} onLogout={() => setUser(null)} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <Transfers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;

