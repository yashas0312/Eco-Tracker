// AddEntry component with tab-based forms for all entry types

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export default function AddEntry({ userId, onSuccess }) {
  const [activeTab, setActiveTab] = useState('vehicle');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Vehicle form state
  const [vehicleData, setVehicleData] = useState({
    distance: '',
    fuelType: 'petrol',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Plastic form state
  const [plasticData, setPlasticData] = useState({
    plasticType: 'bottles',
    quantity: '',
    unit: 'kg',
    date: new Date().toISOString().split('T')[0]
  });

  // Energy form state
  const [energyData, setEnergyData] = useState({
    energySource: 'electricity',
    amount: '',
    isRenewable: false,
    date: new Date().toISOString().split('T')[0]
  });

  // Plantation form state
  const [plantationData, setPlantationData] = useState({
    treesPlanted: '',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleData.distance || vehicleData.distance <= 0) {
      setError('Please enter a valid distance');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE}/entries/vehicle`, {
        userId,
        ...vehicleData,
        distance: parseFloat(vehicleData.distance)
      });

      if (response.data.success) {
        setSuccess(`Vehicle entry added! CO₂ emissions: ${response.data.entry.co2Emissions} kg`);
        setVehicleData({
          distance: '',
          fuelType: 'petrol',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
        setTimeout(() => {
          setSuccess(null);
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle entry');
    } finally {
      setLoading(false);
    }
  };

  const handlePlasticSubmit = async (e) => {
    e.preventDefault();
    if (!plasticData.quantity || plasticData.quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE}/entries/plastic`, {
        userId,
        ...plasticData,
        quantity: parseFloat(plasticData.quantity)
      });

      if (response.data.success) {
        setSuccess(`Plastic entry added! CO₂ emissions: ${response.data.entry.co2Emissions} kg`);
        setPlasticData({
          plasticType: 'bottles',
          quantity: '',
          unit: 'kg',
          date: new Date().toISOString().split('T')[0]
        });
        setTimeout(() => {
          setSuccess(null);
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add plastic entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEnergySubmit = async (e) => {
    e.preventDefault();
    if (!energyData.amount || energyData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE}/entries/energy`, {
        userId,
        ...energyData,
        amount: parseFloat(energyData.amount)
      });

      if (response.data.success) {
        setSuccess(`Energy entry added! CO₂ emissions: ${response.data.entry.co2Emissions} kg`);
        setEnergyData({
          energySource: 'electricity',
          amount: '',
          isRenewable: false,
          date: new Date().toISOString().split('T')[0]
        });
        setTimeout(() => {
          setSuccess(null);
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add energy entry');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantationSubmit = async (e) => {
    e.preventDefault();
    if (!plantationData.treesPlanted || plantationData.treesPlanted <= 0) {
      setError('Please enter a valid number of trees');
      return;
    }

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
          `🌳 Plantation entry added! CO₂ offset: ${response.data.entry.co2Offset} kg | Eco Points: +${response.data.entry.ecoPointsEarned}`
        );
        setPlantationData({
          treesPlanted: '',
          date: new Date().toISOString().split('T')[0],
          location: ''
        });
        setTimeout(() => {
          setSuccess(null);
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add plantation entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Add Entry</h1>

        {success && (
          <div className="toast success">
            <p className="text-success">{success}</p>
          </div>
        )}

        {error && (
          <div className="card mb-3">
            <p className="text-error">{error}</p>
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
              className={`tab ${activeTab === 'plastic' ? 'active' : ''}`}
              onClick={() => setActiveTab('plastic')}
            >
              ♻️ Plastics
            </button>
            <button
              className={`tab ${activeTab === 'energy' ? 'active' : ''}`}
              onClick={() => setActiveTab('energy')}
            >
              🔥 Energy
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

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleData.description}
                  onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })}
                  placeholder="e.g., Commute to work"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Vehicle Entry'}
              </button>
            </form>
          )}

          {activeTab === 'plastic' && (
            <form onSubmit={handlePlasticSubmit}>
              <div className="form-group">
                <label className="form-label">Plastic Type</label>
                <select
                  className="form-select"
                  value={plasticData.plasticType}
                  onChange={(e) => setPlasticData({ ...plasticData, plasticType: e.target.value })}
                >
                  <option value="single-use">Single-use</option>
                  <option value="bottles">Bottles</option>
                  <option value="bags">Bags</option>
                  <option value="packaging">Packaging</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={plasticData.quantity}
                  onChange={(e) => setPlasticData({ ...plasticData, quantity: e.target.value })}
                  placeholder="Enter quantity in kilograms"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={plasticData.date}
                  onChange={(e) => setPlasticData({ ...plasticData, date: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Plastic Entry'}
              </button>
            </form>
          )}

          {activeTab === 'energy' && (
            <form onSubmit={handleEnergySubmit}>
              <div className="form-group">
                <label className="form-label">Energy Source</label>
                <select
                  className="form-select"
                  value={energyData.energySource}
                  onChange={(e) => setEnergyData({ ...energyData, energySource: e.target.value })}
                >
                  <option value="natural-gas">Natural Gas</option>
                  <option value="electricity">Electricity</option>
                  <option value="heating-oil">Heating Oil</option>
                  <option value="coal">Coal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (kWh)</label>
                <input
                  type="number"
                  className="form-input"
                  value={energyData.amount}
                  onChange={(e) => setEnergyData({ ...energyData, amount: e.target.value })}
                  placeholder="Enter amount in kilowatt-hours"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="renewable"
                    checked={energyData.isRenewable}
                    onChange={(e) => setEnergyData({ ...energyData, isRenewable: e.target.checked })}
                  />
                  <label htmlFor="renewable">Renewable Energy Source (Zero Emissions)</label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={energyData.date}
                  onChange={(e) => setEnergyData({ ...energyData, date: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Energy Entry'}
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

              <div className="form-group">
                <label className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={plantationData.location}
                  onChange={(e) => setPlantationData({ ...plantationData, location: e.target.value })}
                  placeholder="e.g., Local park"
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
  );
}
