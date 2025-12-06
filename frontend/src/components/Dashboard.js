/**
 * Dashboard Component
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Show welcome screen and summary stats
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../services/api';

export default function Dashboard({ userId }) {
  const navigate = useNavigate();
  const currentUserId = userId || 1;

  // State for dashboard data
  const [netCarbonFootprint, setNetCarbonFootprint] = useState(0);
  const [vehicleCO2, setVehicleCO2] = useState(0);
  const [energyCO2, setEnergyCO2] = useState(0);
  const [plasticCO2, setPlasticCO2] = useState(0);
  const [treesOffset, setTreesOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, [currentUserId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(currentUserId);
      
      // Calculate totals from entries by type
      let vehicles = 0;
      let energy = 0;
      let plastics = 0;
      let trees = 0;
      
      if (data.chart && data.chart.length > 0) {
        data.chart.forEach(entry => {
          const co2Value = Math.abs(entry.co2 || 0);
          
          if (entry.type === 'vehicle') {
            vehicles += co2Value;
          } else if (entry.type === 'energy' || entry.type === 'heating') {
            energy += co2Value;
          } else if (entry.type === 'plastics') {
            plastics += co2Value;
          } else if (entry.type === 'plantation' || entry.type === 'trees') {
            trees += co2Value;
          }
        });
      }
      
      const totalEmissions = vehicles + energy + plastics;
      
      setVehicleCO2(vehicles);
      setEnergyCO2(energy);
      setPlasticCO2(plastics);
      setTreesOffset(trees);
      setNetCarbonFootprint(totalEmissions - trees);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* CO2 Level Indicator with Side-by-Side Legend */}
        <div className="co2-indicator-card" style={{ backgroundColor: co2Status.bgColor }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left Side - CO2 Level Legend */}
            <div style={{ flex: '0 0 auto', minWidth: '280px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2E7D32', fontSize: '1.1rem' }}>
                CO₂ Emission Levels
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

            {/* Right Side - Emoji Indicator */}
            <div style={{ flex: '1', textAlign: 'center', minWidth: '300px' }}>
              <div className="co2-emoji" style={{ fontSize: '6rem' }}>
                {co2Status.emoji}
              </div>
              <div className="co2-level" style={{ color: co2Status.color }}>
                {co2Status.level}
              </div>
              <div className="co2-value">
                <span style={{ fontSize: '3rem', fontWeight: '700', color: co2Status.color }}>
                  {loading ? '...' : netCarbonFootprint.toFixed(1)}
                </span>
                <span style={{ fontSize: '1.5rem', color: '#666' }}> kg CO₂</span>
              </div>
              <div className="co2-message" style={{ color: co2Status.color }}>
                {co2Status.message}
              </div>
            </div>
          </div>
        </div>

        {/* CO2 Contributions Report - Below the avatar */}
        <div className="co2-contributions-card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2E7D32', marginBottom: '1.5rem', textAlign: 'center' }}>
            CO₂ Contributions
          </h3>

          {/* Emissions Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#666', marginBottom: '1rem' }}>
              🏭 Emissions Generated
            </h4>
            
            <div className="contribution-item">
              <div className="contribution-icon">🚗</div>
              <div className="contribution-info">
                <div className="contribution-label">Vehicles</div>
                <div className="contribution-value" style={{ color: '#F44336' }}>
                  {loading ? '...' : `${vehicleCO2.toFixed(1)} kg CO₂`}
                </div>
              </div>
            </div>

            <div className="contribution-item">
              <div className="contribution-icon">⚡</div>
              <div className="contribution-info">
                <div className="contribution-label">Electricity</div>
                <div className="contribution-value" style={{ color: '#F44336' }}>
                  {loading ? '...' : `${energyCO2.toFixed(1)} kg CO₂`}
                </div>
              </div>
            </div>

            <div className="contribution-item">
              <div className="contribution-icon">♻️</div>
              <div className="contribution-info">
                <div className="contribution-label">Plastics</div>
                <div className="contribution-value" style={{ color: '#F44336' }}>
                  {loading ? '...' : `${plasticCO2.toFixed(1)} kg CO₂`}
                </div>
              </div>
            </div>

            <div className="contribution-total">
              <strong>Total Emissions:</strong>
              <span style={{ color: '#F44336', fontWeight: '700', fontSize: '1.25rem' }}>
                {loading ? '...' : `${(vehicleCO2 + energyCO2 + plasticCO2).toFixed(1)} kg CO₂`}
              </span>
            </div>
          </div>

          {/* Offsets Section */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#666', marginBottom: '1rem' }}>
              🌳 CO₂ Absorbed
            </h4>
            
            <div className="contribution-item">
              <div className="contribution-icon">🌲</div>
              <div className="contribution-info">
                <div className="contribution-label">Tree Plantations</div>
                <div className="contribution-value" style={{ color: '#4CAF50' }}>
                  {loading ? '...' : `${treesOffset.toFixed(1)} kg CO₂`}
                </div>
              </div>
            </div>

            <div className="contribution-total">
              <strong>Total Absorbed:</strong>
              <span style={{ color: '#4CAF50', fontWeight: '700', fontSize: '1.25rem' }}>
                {loading ? '...' : `${treesOffset.toFixed(1)} kg CO₂`}
              </span>
            </div>
          </div>
        </div>

        {/* Future AI Predictions Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ 
              fontSize: '1.1rem', 
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
            }}
            onClick={() => {
              // TODO: Navigate to AI predictions page or show modal
              alert('Future AI Predictions feature coming soon!');
            }}
          >
            🤖 Future AI Predictions
          </button>
        </div>
      </div>
    </div>
  );
}
