/**
 * History Component
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Display historical entries and export CSV
 * TODOs:
 * - Replace userId with auth context
 * - Add pagination for large datasets
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAnalytics, exportCSV } from '../services/api';

export default function History({ userId }) {
  const navigate = useNavigate();
  // TODO: Replace with auth context
  const currentUserId = userId || 1;

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(currentUserId);
      setEntries(data.chart || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      toast.error('Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleExport = async () => {
    try {
      const blob = await exportCSV(currentUserId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ecotracker-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export CSV');
    }
  };

  const filteredEntries = activeFilter === 'all' 
    ? entries 
    : entries.filter(e => e.type?.toLowerCase() === activeFilter);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="page-header">History & Analytics</h1>
          <div className="fallback">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#2E7D32', margin: 0 }}>
            History & Analytics
          </h1>
          <button 
            className="btn btn-secondary" 
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #E0E0E0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              color: '#2E7D32'
            }}
          >
            📥 Export CSV
          </button>
        </div>

        <div style={{
          background: '#E8F5E9',
          border: '2px solid #C8E6C9',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#2E7D32',
            marginBottom: '0.5rem'
          }}>
            No History Data Yet
          </h2>
          <p style={{ 
            color: '#666',
            fontSize: '1rem',
            marginBottom: '1.5rem'
          }}>
            Start adding entries to see your carbon footprint trends over time.
          </p>
          <button 
            onClick={() => navigate('/add-entry')}
            style={{
              padding: '12px 24px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Add Your First Entry
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={activeFilter === 'all' ? 'history-filter-active' : 'history-filter'}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={activeFilter === 'vehicle' ? 'history-filter-active' : 'history-filter'}
            onClick={() => setActiveFilter('vehicle')}
          >
            🚗 Vehicles
          </button>
          <button 
            className={activeFilter === 'plastic' ? 'history-filter-active' : 'history-filter'}
            onClick={() => setActiveFilter('plastic')}
          >
            ♻️ Plastics
          </button>
          <button 
            className={activeFilter === 'energy' ? 'history-filter-active' : 'history-filter'}
            onClick={() => setActiveFilter('energy')}
          >
            🔥 Energy
          </button>
          <button 
            className={activeFilter === 'plantation' ? 'history-filter-active' : 'history-filter'}
            onClick={() => setActiveFilter('plantation')}
          >
            🌳 Plantations
          </button>
        </div>
      </div>
    </div>
  );
}
