// backend/models/Entry.js
const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  type: { type: String, required: true }, // vehicle, plastic, energy, plantation

  // VEHICLE FIELDS
  vehicleType: String,
  fuelType: String,
  yearOfRegistration: Number,
  petrolPressStd: Number,
  petrolMeasured: Number,
  distance: Number,             // already needed
  mileage: Number,              // optional if you want
  engineSize: Number,

  // PLASTIC FIELDS
  itemType: String,
  numberOfItems: Number,

  // ENERGY FIELDS
  energyType: String,
  unitsConsumed: Number,

  // PLANTATION FIELDS
  treeSpecies: String,
  numberOfTrees: Number,

  // COMMON
  co2: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Entry", EntrySchema);
