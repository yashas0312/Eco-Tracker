// Main App component with navigation and routing

import React, { useState } from 'react';
import './styles.css';
import Dashboard from './components/Dashboard';
import AddEntry from './components/AddEntry';
import History from './components/History';
import Profile from './components/Profile';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userId] = useState('675210a1b2c3d4e5f6789012'); // Mock user ID for development

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userId={userId} />;
      case 'add-entry':
        return <AddEntry userId={userId} onSuccess={() => setCurrentView('dashboard')} />;
      case 'history':
        return <History userId={userId} />;
      case 'profile':
        return <Profile userId={userId} />;
      default:
        return <Dashboard userId={userId} />;
    }
  };

  return (
    <div className="app-root">
      <header className="nav">
        <div className="container nav-inner">
          <div className="logo">🌱 EcoTracker</div>
          <nav>
            <a
              href="#dashboard"
              className={currentView === 'dashboard' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('dashboard');
              }}
            >
              Dashboard
            </a>
            <a
              href="#add-entry"
              className={currentView === 'add-entry' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('add-entry');
              }}
            >
              Add Entry
            </a>
            <a
              href="#history"
              className={currentView === 'history' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('history');
              }}
            >
              History
            </a>
            <a
              href="#profile"
              className={currentView === 'profile' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('profile');
              }}
            >
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main>{renderView()}</main>

      <footer className="footer">
        <div className="container">© 2025 EcoTracker - Track your carbon footprint</div>
      </footer>
    </div>
  );
}
