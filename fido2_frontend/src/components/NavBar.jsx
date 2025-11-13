import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NavBar({ theme, onToggleTheme }) {
  /** Top navigation bar with app branding, links and theme toggle. */
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="brand" role="button" onClick={() => navigate('/')} aria-label="Go home">
          <span className="dot" />
          <span>FIDO2 Admin</span>
        </div>
        <div className="nav-links">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard">Dashboard</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/users">Users</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/login">Login</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/register">Register</NavLink>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn ghost" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'} Theme
          </button>
        </div>
      </div>
    </nav>
  );
}
