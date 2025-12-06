import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const API_BASE = 'http://localhost:4000/api';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userId] = useState('675210a1b2c3d4e5f6789012');

  // Add Entry State
  const [activeTab, setActiveTab] = useState('vehicle');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [vehicleData, setVehicleData] = useState({
    distance: '',
    fuelType: 'petrol',
    date: new Date().toISOString().split('T')[0]
  });

  const [plantationData, setPlantationData] = useState({
    treesPlanted: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE}/entries/vehicle`, {
        userId,
        ...vehicleData,
        distance: parseFloat(vehicleData.distance)
      });

      if (response.data.success) {
        setSuccess(`✅ Vehicle entry added! CO₂ emissions: ${response.data.entry.co2Emissions} kg`);
        setVehicleData({ distance: '', fuelType: 'petrol', date: new Date().toISOString().split('T')[0] });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE}/entries/plantation`, {
        userId,
        ...plantationData,
        treesPlanted: parseInt(plantationData.treesPlanted)
      });

      if (response.data.success) {
        setSuccess(
          `🌳 Trees planted! CO₂ offset: ${response.data.entry.co2Offset} kg | Eco Points: +${response.data.entry.ecoPointsEarned}`
        );
        setPlantationData({ treesPlanted: '', date: new Date().toISOString().split('T')[0] });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setLoading(false);
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
              onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
            >
              Dashboard
            </a>
            <a
              href="#add-entry"
              className={currentView === 'add-entry' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setCurrentView('add-entry'); }}
            >
              Add Entry
            </a>
          </nav>
        </div>
      </header>

      <main>
        {currentView === 'dashboard' && (
          <div className="section">
            <div className="container">
              <h1 className="section-title">Dashboard</h1>

              <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #F1F8E9, #E8F5E9)', border: '2px solid #4CAF50' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
                  <h2 className="text-green mb-2">Welcome to EcoTracker!</h2>
                  <p className="mb-3">Track your carbon footprint by logging vehicles, plastics, energy usage, and tree plantations.</p>
                  <button className="btn btn-success" onClick={() => setCurrentView('add-entry')}>
                    Add Your First Entry
                  </button>
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
        )}

        {currentView === 'add-entry' && (
          <div className="section">
            <div className="container">
              <h1 className="section-title">Add Entry</h1>

              {success && (
                <div className="card mb-3" style={{ background: '#E8F5E9', border: '2px solid #4CAF50' }}>
                  <p className="text-success" style={{ textAlign: 'center', fontSize: '1.1rem' }}>{success}</p>
                </div>
              )}

              {error && (
                <div className="card mb-3" style={{ background: '#FFEBEE', border: '2px solid #F44336' }}>
                  <p className="text-error" style={{ textAlign: 'center' }}>{error}</p>
                </div>
              )}

              <div className="card">
                <div className="tabs">
                  <button
                    className={`tab ${activeTab === 'vehicle' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vehicle')}
                  >
                    🚗 Vehicles
                  </button>
                  <button
                    className={`tab ${activeTab === 'plantation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plantation')}
                  >
                    🌳 Plantations
                  </button>
                </div>

                {activeTab === 'vehicle' && (
                  <form onSubmit={handleVehicleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Distance (km)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={vehicleData.distance}
                        onChange={(e) => setVehicleData({ ...vehicleData, distance: e.target.value })}
                        placeholder="Enter distance in kilometers"
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fuel Type</label>
                      <select
                        className="form-select"
                        value={vehicleData.fuelType}
                        onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value })}
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="cng">CNG</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={vehicleData.date}
                        onChange={(e) => setVehicleData({ ...vehicleData, date: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Vehicle Entry'}
                    </button>
                  </form>
                )}

                {activeTab === 'plantation' && (
                  <form onSubmit={handlePlantationSubmit}>
                    <div className="form-group">
                      <label className="form-label">Number of Trees Planted</label>
                      <input
                        type="number"
                        className="form-input"
                        value={plantationData.treesPlanted}
                        onChange={(e) => setPlantationData({ ...plantationData, treesPlanted: e.target.value })}
                        placeholder="Enter number of trees"
                        required
                        min="1"
                        step="1"
                      />
                      <small className="text-green">Each tree offsets 22 kg CO₂ and earns 10 Eco Points!</small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={plantationData.date}
                        onChange={(e) => setPlantationData({ ...plantationData, date: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Adding...' : '🌳 Add Plantation Entry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">© 2025 EcoTracker - Track your carbon footprint</div>
      </footer>
    </div>
  );
}
