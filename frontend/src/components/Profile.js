// Profile component with lifetime statistics and achievements

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/user/profile?userId=${userId}`);
      if (response.data.success) {
        setUser(response.data.user);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getAchievements = () => {
    if (!user) return [];

    const achievements = [];
    const stats = user.lifetimeStats;

    // Trees planted achievements
    if (stats.treesPlanted >= 100) achievements.push({ icon: '🌳🌳🌳', title: 'Forest Creator', desc: 'Planted 100+ trees' });
    else if (stats.treesPlanted >= 50) achievements.push({ icon: '🌳🌳', title: 'Tree Planter', desc: 'Planted 50+ trees' });
    else if (stats.treesPlanted >= 10) achievements.push({ icon: '🌳', title: 'Seedling', desc: 'Planted 10+ trees' });

    // Eco points achievements
    if (stats.ecoPoints >= 1000) achievements.push({ icon: '⭐⭐⭐', title: 'Eco Champion', desc: '1000+ Eco Points' });
    else if (stats.ecoPoints >= 500) achievements.push({ icon: '⭐⭐', title: 'Eco Warrior', desc: '500+ Eco Points' });
    else if (stats.ecoPoints >= 100) achievements.push({ icon: '⭐', title: 'Eco Starter', desc: '100+ Eco Points' });

    // Entries logged achievements
    if (stats.entriesLogged >= 100) achievements.push({ icon: '📊📊📊', title: 'Data Master', desc: '100+ entries logged' });
    else if (stats.entriesLogged >= 50) achievements.push({ icon: '📊📊', title: 'Tracker', desc: '50+ entries logged' });
    else if (stats.entriesLogged >= 10) achievements.push({ icon: '📊', title: 'Beginner', desc: '10+ entries logged' });

    // Carbon offset achievements
    if (stats.totalOffsets > stats.totalEmissions) {
      achievements.push({ icon: '🎉', title: 'Carbon Negative', desc: 'Offset more than emitted!' });
    }

    return achievements;
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Use default user data if not available
  const displayUser = user || {
    name: 'EcoTracker User',
    email: 'user@ecotracker.com',
    joinedDate: new Date(),
    lifetimeStats: {
      entriesLogged: 0,
      totalEmissions: 0,
      totalOffsets: 0,
      ecoPoints: 0,
      treesPlanted: 0
    }
  };

  const achievements = getAchievements();
  const hasData = displayUser.lifetimeStats.entriesLogged > 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Profile</h1>

        {!hasData && (
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)', border: '2px solid #4CAF50' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
              <h2 className="text-green mb-2">Start Your Eco Journey!</h2>
              <p className="mb-3">Begin tracking your carbon footprint to unlock achievements and see your environmental impact.</p>
              <button className="btn btn-success" onClick={() => window.location.hash = '#add-entry'}>
                Add Your First Entry
              </button>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="card mb-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '4rem' }}>👤</div>
            <div>
              <h2>{displayUser.name}</h2>
              <p className="text-gray">{displayUser.email}</p>
              <small>Member since {new Date(displayUser.joinedDate).toLocaleDateString()}</small>
            </div>
          </div>
        </div>

        {/* Lifetime Statistics */}
        <h2 className="mb-3">Lifetime Statistics</h2>
        <div className="grid grid-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{displayUser.lifetimeStats.entriesLogged}</div>
          </div>

          <div className="stat-card negative">
            <div className="stat-icon">🏭</div>
            <div className="stat-label">Total Emissions</div>
            <div className="stat-value">{displayUser.lifetimeStats.totalEmissions.toFixed(2)} kg</div>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">🌳</div>
            <div className="stat-label">Total Offsets</div>
            <div className="stat-value">{displayUser.lifetimeStats.totalOffsets.toFixed(2)} kg</div>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Eco Points</div>
            <div className="stat-value">{displayUser.lifetimeStats.ecoPoints}</div>
          </div>
        </div>

        <div className="grid grid-2 mb-4">
          <div className="card">
            <h3 className="mb-2">🌳 Trees Planted</h3>
            <p className="stat-value text-green">{displayUser.lifetimeStats.treesPlanted}</p>
            <p className="mt-2">
              {hasData ? (
                <>
                  You've planted <strong>{displayUser.lifetimeStats.treesPlanted} trees</strong>, offsetting{' '}
                  <strong>{displayUser.lifetimeStats.totalOffsets.toFixed(2)} kg CO₂</strong>!
                </>
              ) : (
                <>Plant your first tree to start offsetting carbon emissions and earning eco points!</>
              )}
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2">📊 Net Impact</h3>
            <p
              className="stat-value"
              style={{
                color:
                  displayUser.lifetimeStats.totalEmissions - displayUser.lifetimeStats.totalOffsets > 0
                    ? 'var(--error)'
                    : 'var(--success)'
              }}
            >
              {(displayUser.lifetimeStats.totalEmissions - displayUser.lifetimeStats.totalOffsets).toFixed(2)} kg
            </p>
            <p className="mt-2">
              {displayUser.lifetimeStats.totalEmissions - displayUser.lifetimeStats.totalOffsets > 0 ? (
                <>Keep planting trees to offset your emissions!</>
              ) : hasData ? (
                <span className="text-success">🎉 You're carbon negative! Amazing work!</span>
              ) : (
                <>Your net carbon footprint will be calculated as you add entries.</>
              )}
            </p>
          </div>
        </div>

        {/* Achievements */}
        <h2 className="mb-3">🏆 Achievements</h2>
        {achievements.length > 0 ? (
          <div className="grid grid-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="card bg-green">
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                  {achievement.icon}
                </div>
                <h3 className="text-center text-green">{achievement.title}</h3>
                <p className="text-center">{achievement.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <p>Start logging entries and planting trees to earn achievements!</p>
          </div>
        )}

        {/* Next Milestones */}
        <h2 className="mb-3 mt-4">🎯 Next Milestones</h2>
        <div className="card">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {displayUser.lifetimeStats.treesPlanted < 10 && (
              <li className="mb-2">
                🌳 Plant {10 - displayUser.lifetimeStats.treesPlanted} more trees to earn "Seedling" achievement
              </li>
            )}
            {displayUser.lifetimeStats.treesPlanted >= 10 && displayUser.lifetimeStats.treesPlanted < 50 && (
              <li className="mb-2">
                🌳 Plant {50 - displayUser.lifetimeStats.treesPlanted} more trees to earn "Tree Planter" achievement
              </li>
            )}
            {displayUser.lifetimeStats.ecoPoints < 100 && (
              <li className="mb-2">⭐ Earn {100 - displayUser.lifetimeStats.ecoPoints} more Eco Points for "Eco Starter"</li>
            )}
            {displayUser.lifetimeStats.ecoPoints >= 100 && displayUser.lifetimeStats.ecoPoints < 500 && (
              <li className="mb-2">⭐ Earn {500 - displayUser.lifetimeStats.ecoPoints} more Eco Points for "Eco Warrior"</li>
            )}
            {displayUser.lifetimeStats.entriesLogged < 10 && (
              <li className="mb-2">
                📊 Log {10 - displayUser.lifetimeStats.entriesLogged} more entries to earn "Beginner" achievement
              </li>
            )}
            {!hasData && (
              <li className="mb-2" style={{ color: 'var(--medium-green)', fontWeight: 'bold' }}>
                ✨ Start your journey by adding your first entry!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
