const mongoose = require('mongoose');

const VehicleEntrySchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  fuelType: { type: String, required: true },
  yearOfRegistration: Number,
  petrolPressStd: Number,
  petrolMeasured: Number,
  distance: { type: Number, required: true }, // km
  mileage: Number,    // optional km/l or km/kWh for EVs
  engineSize: Number,
  ageYears: Number,
  co2: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleEntry', VehicleEntrySchema, 'vehicles');
