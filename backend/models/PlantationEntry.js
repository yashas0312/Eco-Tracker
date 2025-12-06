const mongoose = require('mongoose');

const PlantationEntrySchema = new mongoose.Schema({
  treeSpecies: { type: String, required: true },
  numberOfTrees: { type: Number, required: true },
  survivalProbability: { type: Number, default: 0.7 },
  estimatedCo2PerYearKg: Number, // per-tree rate used
  co2: Number, // negative offset (kg)
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlantationEntry', PlantationEntrySchema, 'plantations');
