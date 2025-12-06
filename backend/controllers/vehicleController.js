const VehicleEntry = require('../models/VehicleEntry');

// basic emission factors (examples)
const FACTORS = { petrolPerL: 2.31, dieselPerL: 2.68, cngPerKg: 2.65 };

exports.create = async (req, res) => {
  try {
    console.log('[vehicle:create] body', req.body);
    const {
      vehicleType, fuelType, yearOfRegistration,
      petrolPressStd, petrolMeasured, distance, mileage,
      engineSize, ageYears, notes
    } = req.body;

    if (!vehicleType || !fuelType || distance == null) {
      return res.status(400).json({ error: 'vehicleType, fuelType and distance are required' });
    }

    const payload = { vehicleType, fuelType, yearOfRegistration, petrolPressStd, petrolMeasured, distance, mileage, engineSize, ageYears, notes };

    // Compute CO2:
    // Prefer mileage if provided: fuel_used = distance / mileage
    if (mileage && Number(mileage) > 0) {
      const fuelUsed = Number(distance) / Number(mileage);
      const f = (fuelType || '').toLowerCase();
      const factor = f.includes('diesel') ? FACTORS.dieselPerL : (f.includes('cng') ? FACTORS.cngPerKg : FACTORS.petrolPerL);
      payload.co2 = +(fuelUsed * factor).toFixed(3);
    } else if (fuelType && (petrolPressStd != null || petrolMeasured != null)) {
      // fallback: simple relation from petrol test - this is approximate and optional
      const avg = ((Number(petrolPressStd)||0) + (Number(petrolMeasured)||0)) / ( (petrolPressStd!=null) + (petrolMeasured!=null) || 1 );
      payload.co2 = +( (avg * 0.02 * Number(distance || 0)) ).toFixed(3); // example formula
    } else {
      payload.co2 = undefined;
    }

    const doc = new VehicleEntry(payload);
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error('vehicle create error', err);
    return res.status(500).json({ error: 'server error', details: err.message });
  }
};

exports.listLatest = async (req, res) => {
  try {
    const docs = await VehicleEntry.find().sort({ createdAt: -1 }).limit(5);
    res.json(docs);
  } catch (err) {
    console.error('vehicle list error', err);
    res.status(500).json({ error: 'server error' });
  }
};
