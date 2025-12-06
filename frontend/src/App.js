/**
 * Main App Component with React Router
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Top-level routing and navigation for Dashboard, Add Entry, History, Profile
 * TODOs:
 * - Replace hardcoded userId with auth context
 * - Add protected routes when auth is implemented
 */
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './styles.css';
import Dashboard from './components/Dashboard';
import AddEntry from './components/AddEntry';
import History from './components/History';
import Profile from './components/Profile';

export default function App() {
  // TODO: Replace with auth context/redux when authentication is implemented
  const userId = 1;

  return (
    <div className="app-root">
      <header className="nav top-nav">
        <div className="container nav-inner">
          <div className="logo">🌱 EcoTracker</div>
          <nav>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              Dashboard
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Add Entry
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              History
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Profile
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard userId={userId} />} />
          <Route path="/add" element={<AddEntry userId={userId} />} />
          <Route path="/history" element={<History userId={userId} />} />
          <Route path="/profile" element={<Profile userId={userId} />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">© 2025 EcoTracker - Track your carbon footprint</div>
      </footer>
    </div>
  );
}
