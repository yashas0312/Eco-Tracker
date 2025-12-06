/**
 * AddEntry Component with Quick History and Preview CO2
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Form tabs for logging entries + Quick History
 * TODOs:
 * - Replace userId=1 with auth context
 * - Add real-time validation feedback
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { postLog, calcCO2, getAnalytics } from '../services/api';

export default function AddEntry({ userId }) {
  // TODO: Replace with auth context
  const currentUserId = userId || 1;

  const [activeTab, setActiveTab] = useState('vehicle');
  const [loading, setLoading] = useState(false);

  // Quick History state
  const [recentEntries, setRecentEntries] = useState([]);

  // Vehicle form state
  const [vehicleData, setVehicleData] = useState({
    km: '',
    vehicle_type: 'car',
    fuel_type: 'petrol',
    // Vehicle fields
    year_of_registration: '',
    press_std: '',
    measured_level: ''
  });

  // Plastics form state
  const [plasticsData, setPlasticsData] = useState({
    number_of_items: '',
    item_type: 'plastic_bottle'
  });

  // Energy form state
  const [energyData, setEnergyData] = useState({
    kwh: '',
    fuel_type: 'electricity',
    heating_days: 1
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Trees form state
  const [treesData, setTreesData] = useState({
    species: 'neem',
    number_of_trees: ''
  });

  // Tree species CO2 absorption rates (kg/year)
  const treeSpecies = {
    neem: { name: 'Neem', co2: 30 },
    peepal: { name: 'Peepal', co2: 28 },
    banyan: { name: 'Banyan', co2: 21 },
    teak: { name: 'Teak', co2: 18 }
  };

  // Load Quick History on mount
  useEffect(() => {
    loadQuickHistory();
  }, [currentUserId]);

  const loadQuickHistory = async () => {
    try {
      const data = await getAnalytics(currentUserId);
      // Show only 5 most recent entries
      const recent = (data.chart || []).slice(-5).reverse();
      setRecentEntries(recent);
    } catch (err) {
      console.error('Failed to load quick history:', err);
      // Fail gracefully - don't show error toast for background load
    }
  };

  const handlePreviewCO2 = async (type, payload) => {
    try {
      setLoading(true);
      const result = await calcCO2(currentUserId, type, payload);
      toast.info(`💨 Estimated CO₂: ${result.co2_estimate.toFixed(2)} kg`, {
        position: 'top-center'
      });
    } catch (err) {
      toast.error('Failed to calculate CO₂ preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (type, payload) => {
    // Basic validation
    if (type === 'vehicle' && (!payload.km || payload.km <= 0)) {
      toast.error('Distance must be greater than 0');
      return;
    }
    if (type === 'plastics' && (!payload.number_of_items || payload.number_of_items <= 0)) {
      toast.error('Number of items must be greater than 0');
      return;
    }
    if (type === 'heating' && (!payload.kwh || payload.kwh <= 0)) {
      toast.error('Electricity units must be greater than 0');
      return;
    }

    if (type === 'trees' && (!payload.number_of_trees || payload.number_of_trees <= 0)) {
      toast.error('Number of trees must be greater than 0');
      return;
    }

    // Confirmation for large tree plantings
    if (type === 'trees' && payload.number_of_trees > 50) {
      if (!window.confirm(`Are you sure you want to log ${payload.number_of_trees} trees? That's amazing! 🌳`)) {
        return;
      }
    }

    try {
      setLoading(true);
      const result = await postLog(currentUserId, type, payload);
      
      toast.success(`✅ Entry logged! CO₂: ${result.co2_estimate?.toFixed(2) || 0} kg`);
      
      // Refresh Quick History
      loadQuickHistory();

      // Reset form
      if (type === 'vehicle') setVehicleData({ km: '', vehicle_type: 'car', fuel_type: 'petrol', year_of_registration: '', press_std: '', measured_level: '' });
      if (type === 'plastics') setPlasticsData({ number_of_items: '', item_type: 'plastic_bottle' });
      if (type === 'heating') setEnergyData({ kwh: '', fuel_type: 'electricity', heating_days: 1 });
      if (type === 'trees') setTreesData({ species: 'neem', number_of_trees: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="page-header">Add Entry</h1>

        <div className="card">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'vehicle' ? 'active' : ''}`} onClick={() => setActiveTab('vehicle')}>
              🚗 Vehicles
            </button>
            <button className={`tab-btn ${activeTab === 'plastics' ? 'active' : ''}`} onClick={() => setActiveTab('plastics')}>
              ♻️ Plastics
            </button>
            <button className={`tab-btn ${activeTab === 'energy' ? 'active' : ''}`} onClick={() => setActiveTab('energy')}>
              🔥 Energy
            </button>
            <button className={`tab-btn ${activeTab === 'trees' ? 'active' : ''}`} onClick={() => setActiveTab('trees')}>
              🌳 Plantations
            </button>
            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              📊 Quick History
            </button>
          </div>

          {/* Vehicle Tab */}
          {activeTab === 'vehicle' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('vehicle', vehicleData); }}>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="form-select"
                  value={vehicleData.vehicle_type}
                  onChange={(e) => {
                    setVehicleData({ 
                      ...vehicleData, 
                      vehicle_type: e.target.value
                    });
                  }}
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bus">Bus</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              {/* Vehicle details - Show 4 boxes in a grid for all vehicle types */}
              <div className="truck-details-grid">
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select
                    className="form-select"
                    value={vehicleData.fuel_type}
                    onChange={(e) => setVehicleData({ ...vehicleData, fuel_type: e.target.value })}
                    required
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year of Registration</label>
                  <input
                    type="number"
                    className="form-input"
                    value={vehicleData.year_of_registration}
                    onChange={(e) => setVehicleData({ ...vehicleData, year_of_registration: e.target.value })}
                    placeholder="Enter year (e.g., 2020)"
                    min="1900"
                    max={new Date().getFullYear()}
                    step="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Petrol Test - Press STD</label>
                  <input
                    type="number"
                    className="form-input"
                    value={vehicleData.press_std}
                    onChange={(e) => setVehicleData({ ...vehicleData, press_std: e.target.value })}
                    placeholder="Enter Press STD"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Petrol Test - Measured Level</label>
                  <input
                    type="number"
                    className="form-input"
                    value={vehicleData.measured_level}
                    onChange={(e) => setVehicleData({ ...vehicleData, measured_level: e.target.value })}
                    placeholder="Enter Measured Level"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Distance field - Always at the end */}
              <div className="form-group">
                <label className="form-label">Distance Travelled (km)</label>
                <input
                  type="number"
                  className="form-input"
                  value={vehicleData.km}
                  onChange={(e) => setVehicleData({ ...vehicleData, km: e.target.value })}
                  placeholder="Enter distance"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handlePreviewCO2('vehicle', vehicleData)}
                  disabled={loading || !vehicleData.km}
                >
                  👁️ Preview CO₂
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Entry'}
                </button>
              </div>
            </form>
          )}

          {/* Plastics Tab */}
          {activeTab === 'plastics' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('plastics', plasticsData); }}>
              <div className="form-group">
                <label className="form-label">Number of Items</label>
                <input
                  type="number"
                  className="form-input"
                  value={plasticsData.number_of_items}
                  onChange={(e) => setPlasticsData({ ...plasticsData, number_of_items: e.target.value })}
                  placeholder="Enter number of items"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Type</label>
                <select
                  className="form-select"
                  value={plasticsData.item_type}
                  onChange={(e) => setPlasticsData({ ...plasticsData, item_type: e.target.value })}
                >
                  <option value="plastic_bottle">Plastic Bottle</option>
                  <option value="plastic_bag">Plastic Bag</option>
                  <option value="plastic_container">Plastic Container</option>
                </select>
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handlePreviewCO2('plastics', plasticsData)}
                  disabled={loading || !plasticsData.number_of_items}
                >
                  👁️ Preview CO₂
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Entry'}
                </button>
              </div>
            </form>
          )}

          {/* Energy Tab */}
          {activeTab === 'energy' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('heating', energyData); }}>
              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select
                  className="form-select"
                  value={energyData.fuel_type}
                  onChange={(e) => {
                    setEnergyData({ ...energyData, fuel_type: e.target.value });
                  }}
                >
                  <option value="electricity">Electricity</option>
                </select>
              </div>

              {/* Electricity Units Consumed */}
              <div className="form-group">
                <label className="form-label">Electricity Units Consumed (kWh)</label>
                <input
                  type="number"
                  className="form-input"
                  value={energyData.kwh}
                  onChange={(e) => setEnergyData({ ...energyData, kwh: e.target.value })}
                  placeholder="Enter units consumed"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handlePreviewCO2('heating', energyData)}
                  disabled={loading || !energyData.kwh}
                >
                  👁️ Preview CO₂
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Entry'}
                </button>
              </div>
            </form>
          )}

          {/* Trees Tab */}
          {activeTab === 'trees' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('trees', treesData); }}>
              <div className="form-group">
                <label className="form-label">Tree Species</label>
                <select
                  className="form-select"
                  value={treesData.species}
                  onChange={(e) => setTreesData({ ...treesData, species: e.target.value })}
                  required
                >
                  <option value="neem">Neem</option>
                  <option value="peepal">Peepal</option>
                  <option value="banyan">Banyan</option>
                  <option value="teak">Teak</option>
                </select>
                <small className="text-green">
                  Avg CO₂ absorption: {treeSpecies[treesData.species].co2} kg per tree per year
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Trees</label>
                <input
                  type="number"
                  className="form-input"
                  value={treesData.number_of_trees}
                  onChange={(e) => setTreesData({ ...treesData, number_of_trees: e.target.value })}
                  placeholder="Enter number of trees"
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handlePreviewCO2('trees', treesData)}
                  disabled={loading || !treesData.number_of_trees}
                >
                  👁️ Preview CO₂
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Submitting...' : '🌳 Plant Trees'}
                </button>
              </div>
            </form>
          )}

          {/* Quick History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="mb-3">Recent Entries (Last 5)</h3>
              {recentEntries.length === 0 ? (
                <div className="fallback">
                  <p>No entries yet. Start logging to see your history!</p>
                </div>
              ) : (
                <table className="card" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>CO₂ (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.map((entry, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                        <td style={{ padding: '0.75rem' }}>{entry.date}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{entry.co2?.toFixed(2) || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
