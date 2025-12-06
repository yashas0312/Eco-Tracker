/**
 * Profile Component
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Display user profile and lifetime statistics
 * TODOs:
 * - Replace userId with auth context
 * - Add edit profile functionality
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile } from '../services/api';

export default function Profile({ userId }) {
  // TODO: Replace with auth context
  const currentUserId = userId || 1;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile(currentUserId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Failed to load profile data');
      // Set default profile on error
      setProfile({
        name: 'EcoTracker User',
        email: 'user@ecotracker.com',
        joined_date: new Date().toISOString(),
        total_entries: 0,
        total_emissions: 0,
        total_offsets: 0,
        eco_points: 0,
        trees_planted: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const netImpact = (profile?.total_emissions || 0) - (profile?.total_offsets || 0);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="fallback">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="profile-header-card">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2 className="profile-name">{profile?.name || 'EcoTracker User'}</h2>
            <p className="profile-email">{profile?.email || 'user@ecotracker.com'}</p>
            <p className="profile-joined">
              Member since {new Date(profile?.joined_date || Date.now()).toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <h2 className="section-heading">Lifetime Statistics</h2>
        
        <div className="stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">📝</div>
            <div className="profile-stat-label">TOTAL ENTRIES</div>
            <div className="profile-stat-value">{profile?.total_entries || 0}</div>
          </div>

          <div className="profile-stat-card border-red">
            <div className="profile-stat-icon">🏭</div>
            <div className="profile-stat-label">TOTAL EMISSIONS</div>
            <div className="profile-stat-value">{(profile?.total_emissions || 0).toFixed(2)} kg</div>
          </div>

          <div className="profile-stat-card border-green">
            <div className="profile-stat-icon">🌳</div>
            <div className="profile-stat-label">TOTAL OFFSETS</div>
            <div className="profile-stat-value">{(profile?.total_offsets || 0).toFixed(2)} kg</div>
          </div>

          <div className="profile-stat-card border-yellow">
            <div className="profile-stat-icon">⭐</div>
            <div className="profile-stat-label">ECO POINTS</div>
            <div className="profile-stat-value">{profile?.eco_points || 0}</div>
          </div>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">🌳</div>
            <div className="impact-label">Trees Planted</div>
            <div className="impact-value">{profile?.trees_planted || 0}</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">📊</div>
            <div className="impact-label">Net Impact</div>
            <div className="impact-value" style={{ color: netImpact > 0 ? '#F44336' : '#4CAF50' }}>
              {netImpact.toFixed(2)} kg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
