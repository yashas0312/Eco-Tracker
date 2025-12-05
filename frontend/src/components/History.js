// History component with data visualization

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:4000/api';

export default function History({ userId }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    fetchWeeklyData();
  }, [userId]);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/analytics/weekly?userId=${userId}&weeks=12`);
      if (response.data.success) {
        setWeeklyData(response.data.weeklyData);
        setPercentageChange(response.data.percentageChange);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching weekly data:', err);
      setError('Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Week', 'Emissions (kg)', 'Offsets (kg)', 'Net Footprint (kg)'];
    const rows = weeklyData.map(week => [
      week.week,
      week.emissions,
      week.offsets,
      week.netFootprint
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecotracker-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const hasData = weeklyData && weeklyData.length > 0;
  const currentWeek = weeklyData[weeklyData.length - 1] || { netFootprint: 0 };
  const previousWeek = weeklyData[weeklyData.length - 2] || { netFootprint: 0 };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>History & Analytics</h1>
          <button className="btn btn-secondary" onClick={exportToCSV} disabled={!hasData}>
            📥 Export CSV
          </button>
        </div>

        {!hasData && (
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)', border: '2px solid #4CAF50' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h2 className="text-green mb-2">No History Data Yet</h2>
              <p className="mb-3">Start adding entries to see your carbon footprint trends over time.</p>
              <button className="btn btn-success" onClick={() => window.location.hash = '#add-entry'}>
                Add Your First Entry
              </button>
            </div>
          </div>
        )}

        {/* Weekly Comparison Cards */}
        {hasData && (
          <div className="grid grid-3 mb-4">
            <div className="stat-card">
              <div className="stat-label">This Week</div>
              <div className="stat-value">{currentWeek?.netFootprint || 0} kg</div>
              <small>Net Carbon Footprint</small>
            </div>

            <div className="stat-card">
              <div className="stat-label">Last Week</div>
              <div className="stat-value">{previousWeek?.netFootprint || 0} kg</div>
              <small>Net Carbon Footprint</small>
            </div>

            <div className={`stat-card ${percentageChange < 0 ? 'positive' : 'negative'}`}>
              <div className="stat-label">Change</div>
              <div className="stat-value" style={{ color: percentageChange < 0 ? 'var(--success)' : 'var(--error)' }}>
                {percentageChange > 0 ? '+' : ''}{percentageChange}%
              </div>
              <small>{percentageChange < 0 ? '🎉 Improvement!' : '⚠️ Increase'}</small>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="card mb-4">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'vehicle' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('vehicle')}
            >
              🚗 Vehicles
            </button>
            <button
              className={`btn ${filter === 'plastic' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('plastic')}
            >
              ♻️ Plastics
            </button>
            <button
              className={`btn ${filter === 'energy' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('energy')}
            >
              🔥 Energy
            </button>
            <button
              className={`btn ${filter === 'plantation' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('plantation')}
            >
              🌳 Plantations
            </button>
          </div>
        </div>

        {/* 12-Week Trend Chart */}
        {hasData ? (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">12-Week Emission Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="#F44336"
                  strokeWidth={2}
                  name="Emissions"
                />
                <Line
                  type="monotone"
                  dataKey="offsets"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  name="Offsets"
                />
                <Line
                  type="monotone"
                  dataKey="netFootprint"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  name="Net Footprint"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">12-Week Emission Trends</h3>
            </div>
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--medium-gray)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
              <p>Your emission trends will appear here once you start logging entries.</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {hasData && (
          <div className="grid grid-3 mt-4">
            <div className="card">
              <h3 className="text-center mb-2">Total Emissions</h3>
              <p className="stat-value text-center" style={{ color: 'var(--error)' }}>
                {weeklyData.reduce((sum, week) => sum + week.emissions, 0).toFixed(2)} kg
              </p>
            </div>

            <div className="card">
              <h3 className="text-center mb-2">Total Offsets</h3>
              <p className="stat-value text-center" style={{ color: 'var(--success)' }}>
                {weeklyData.reduce((sum, week) => sum + week.offsets, 0).toFixed(2)} kg
              </p>
            </div>

            <div className="card">
              <h3 className="text-center mb-2">Net Footprint</h3>
              <p className="stat-value text-center">
                {weeklyData.reduce((sum, week) => sum + week.netFootprint, 0).toFixed(2)} kg
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
