import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Military Asset Management</h1>
        <div className="nav-menu">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</button>
          <button onClick={() => navigate('/purchases')} className="nav-link">Purchases</button>
          <button onClick={() => navigate('/transfers')} className="nav-link">Transfers</button>
          <button onClick={() => navigate('/assignments')} className="nav-link">Assignments</button>
          <div className="user-info">
            <span>{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
