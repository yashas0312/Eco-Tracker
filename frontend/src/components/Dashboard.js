/**
 * Dashboard Component
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Show welcome screen and summary stats
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ userId }) {
  const navigate = useNavigate();

  // Sample net carbon footprint value (replace with actual data from API)
  const netCarbonFootprint = 0; // kg CO2

  // Function to determine CO2 level and color
  const getCO2Level = (co2) => {
    if (co2 <= 50) {
      return {
        level: 'Excellent',
        color: '#2E7D32',
        bgColor: '#E8F5E9',
        emoji: '😊',
        message: 'Amazing! Your carbon footprint is minimal!'
      };
    } else if (co2 <= 150) {
      return {
        level: 'Good',
        color: '#4CAF50',
        bgColor: '#F1F8E9',
        emoji: '🙂',
        message: 'Great job! Keep up the good work!'
      };
    } else if (co2 <= 300) {
      return {
        level: 'Moderate',
        color: '#FFA726',
        bgColor: '#FFF3E0',
        emoji: '😐',
        message: 'You\'re doing okay, but there\'s room for improvement.'
      };
    } else if (co2 <= 500) {
      return {
        level: 'High',
        color: '#FF7043',
        bgColor: '#FBE9E7',
        emoji: '😟',
        message: 'Your carbon footprint is high. Consider reducing emissions.'
      };
    } else {
      return {
        level: 'Very High',
        color: '#8D6E63',
        bgColor: '#EFEBE9',
        emoji: '😰',
        message: 'Your carbon footprint is very high. Take action now!'
      };
    }
  };

  const co2Status = getCO2Level(netCarbonFootprint);

  return (
    <div className="section">
      <div className="container">
        <h1 className="page-header">Dashboard</h1>

        <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)', border: '2px solid #4CAF50' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
            <h2 className="text-green mb-2">Welcome to EcoTracker!</h2>
            <p className="mb-3">Track your carbon footprint by logging vehicles, plastics, energy usage, and tree plantations.</p>
            <button className="btn btn-success" onClick={() => navigate('/add')}>
              Add Your First Entry
            </button>
          </div>
        </div>

        {/* CO2 Level Indicator */}
        <div className="co2-indicator-card" style={{ backgroundColor: co2Status.bgColor }}>
          <div className="co2-indicator-content">
            <div className="co2-emoji" style={{ fontSize: '6rem' }}>
              {co2Status.emoji}
            </div>
            <div className="co2-level" style={{ color: co2Status.color }}>
              {co2Status.level}
            </div>
            <div className="co2-value">
              <span style={{ fontSize: '3rem', fontWeight: '700', color: co2Status.color }}>
                {netCarbonFootprint.toFixed(1)}
              </span>
              <span style={{ fontSize: '1.5rem', color: '#666' }}> kg CO₂</span>
            </div>
            <div className="co2-message" style={{ color: co2Status.color }}>
              {co2Status.message}
            </div>
          </div>
        </div>

        {/* CO2 Level Legend */}
        <div className="co2-legend">
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2E7D32' }}>
            CO₂ Emission Levels
          </h3>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#2E7D32' }}></div>
              <div className="legend-text">
                <strong>Excellent</strong>
                <span>0-50 kg</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <div className="legend-text">
                <strong>Good</strong>
                <span>51-150 kg</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#FFA726' }}></div>
              <div className="legend-text">
                <strong>Moderate</strong>
                <span>151-300 kg</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#FF7043' }}></div>
              <div className="legend-text">
                <strong>High</strong>
                <span>301-500 kg</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#8D6E63' }}></div>
              <div className="legend-text">
                <strong>Very High</strong>
                <span>500+ kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          <div className="stat-card negative">
            <div className="stat-icon">🏭</div>
            <div className="stat-label">Total CO₂ Emissions</div>
            <div className="stat-value">0 kg</div>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">🌳</div>
            <div className="stat-label">CO₂ Offset</div>
            <div className="stat-value">0 kg</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Net Carbon Footprint</div>
            <div className="stat-value">0 kg</div>
          </div>

          <div className="stat-card positive">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Eco Points</div>
            <div className="stat-value">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
