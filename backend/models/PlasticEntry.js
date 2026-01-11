const mongoose = require('mongoose');

const PlasticEntrySchema = new mongoose.Schema({
  itemType: { type: String, required: true },
  numberOfItems: { type: Number, required: true },
  co2: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlasticEntry', PlasticEntrySchema, 'plastics');
