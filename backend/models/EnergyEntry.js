// backend/models/EnergyEntry.js
const mongoose = require('mongoose');

const EnergyEntrySchema = new mongoose.Schema({
  energyType: { type: String, required: true },  // e.g. "Electricity"
  unitsConsumed: { type: Number, required: true }, // kWh
  gridFactor: { type: Number, default: 0.9 }, // kgCO2 per kWh, overrideable
  co2: Number, // calculated kg CO2
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EnergyEntry', EnergyEntrySchema, 'energy');
