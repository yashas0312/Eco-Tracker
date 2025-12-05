// Dashboard component with summary statistics

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export default function Dashboard({ userId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [userId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/dashboard/summary?userId=${userId}`);
      if (response.data.success) {
        setSummary(response.data.summary);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  // Show demo data if no real data available
  const displaySummary = summary || {
    totalEmissions: 0,
    totalOffsets: 0,
    netFootprint: 0,
    ecoPoints: 0,
    entriesCount: 0,
    treesPlanted: 0
  };

  const isEmptyData = displaySummary.entriesCount === 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Dashboard</h1>

        {isEmptyData && (
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)', border: '2px solid #4CAF50' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>🌱</div>
              <div>
                <h3 className="text-green mb-2">Welcome to EcoTracker!</h3>
                <p className="mb-2">Start tracking your carbon footprint by adding your first entry.</p>
                <p>Click on <strong>"Add Entry"</strong> in the navigation to log vehicles, plastics, energy usage, or tree plantations.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-4 mb-4">
          <div className="stat-card negative">
            <div className="stat-icon">🏭</div>
            <div className="stat-label">Total CO₂ Emissions</div>
            <div className="stat-value">{displaySummary.totalEmissions} kg</div>
            <small style={{ color: 'var(--medium-gray)', marginTop: '0.5rem', display: 'block' }}>
              From vehicles, plastics & energy
            </small>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">🌳</div>
            <div className="stat-label">CO₂ Offset</div>
            <div className="stat-value">{displaySummary.totalOffsets} kg</div>
            <small style={{ color: 'var(--medium-gray)', marginTop: '0.5rem', display: 'block' }}>
              From tree plantations
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Net Carbon Footprint</div>
            <div className="stat-value">{displaySummary.netFootprint} kg</div>
            <small style={{ color: 'var(--medium-gray)', marginTop: '0.5rem', display: 'block' }}>
              Emissions - Offsets
            </small>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Eco Points</div>
            <div className="stat-value">{displaySummary.ecoPoints}</div>
            <small style={{ color: 'var(--medium-gray)', marginTop: '0.5rem', display: 'block' }}>
              10 points per tree planted
            </small>
          </div>
        </div>

        <div className="grid grid-2 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Stats</h3>
            </div>
            <div>
              <p className="mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Total Entries:</strong></span>
                <span>{displaySummary.entriesCount}</span>
              </p>
              <p className="mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Trees Planted:</strong></span>
                <span>{displaySummary.treesPlanted} 🌳</span>
              </p>
              <p className="mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>CO₂ Saved:</strong></span>
                <span>{displaySummary.totalOffsets} kg</span>
              </p>
            </div>
          </div>

          <div className="card bg-green">
            <div className="card-header">
              <h3 className="card-title text-green">Environmental Impact</h3>
            </div>
            <div>
              {displaySummary.netFootprint > 0 ? (
                <p>
                  Your net carbon footprint is <strong>{displaySummary.netFootprint} kg CO₂</strong>.
                  Consider planting more trees or reducing emissions to offset your impact!
                </p>
              ) : displaySummary.netFootprint === 0 && isEmptyData ? (
                <p>
                  Start tracking your carbon footprint today! Add entries to see your environmental impact and earn eco points by planting trees.
                </p>
              ) : (
                <p className="text-success">
                  <strong>Great job!</strong> You've offset all your emissions! Keep up the good work.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="grid grid-4" style={{ gap: '1rem' }}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.5rem' }} onClick={() => window.location.hash = '#add-entry'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗</div>
              <div>Log Vehicle</div>
            </button>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.5rem' }} onClick={() => window.location.hash = '#add-entry'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>♻️</div>
              <div>Log Plastic</div>
            </button>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.5rem' }} onClick={() => window.location.hash = '#add-entry'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
              <div>Log Energy</div>
            </button>
            <button className="btn btn-success" style={{ width: '100%', padding: '1.5rem' }} onClick={() => window.location.hash = '#add-entry'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌳</div>
              <div>Plant Trees</div>
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-3 mt-4">
          <div className="card">
            <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚗</span> Vehicle Tracking
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
              Track emissions from petrol, diesel, electric, hybrid, and CNG vehicles. Average car emits ~18 kg CO₂ per 100km.
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>♻️</span> Plastic Monitoring
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
              Log plastic consumption. Each kg of plastic generates ~6 kg CO₂ during production and disposal.
            </p>
          </div>

          <div className="card bg-green">
            <h3 className="mb-2 text-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌳</span> Tree Planting
            </h3>
            <p style={{ fontSize: '0.9rem' }}>
              Each tree absorbs ~22 kg CO₂ per year and earns you 10 eco points! Plant trees to offset your emissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
