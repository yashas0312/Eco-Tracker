// backend/controllers/entryController.js

const Entry = require("../models/Entry");

// emission factor for petrol: approx 2.31 kg CO₂ per litre burned
const PETROL_CO2_FACTOR = 2.31;

exports.createEntry = async (req, res) => {
  try {
    console.log('[createEntry] Received request:', JSON.stringify(req.body, null, 2));
    
    // Handle both formats: direct data or {userId, type, payload}
    let data = req.body;
    
    // If frontend sends {userId, type, payload}, extract payload
    if (data.payload) {
      data = { ...data.payload, type: data.type, userId: data.userId };
    }

    if (!data.type) return res.status(400).json({ error: "Entry type missing" });

    let co2 = 0;

    // VEHICLE ENTRY LOGIC
    if (data.type === "vehicle") {
      const { vehicle_type, fuel_type, year_of_registration, press_std, measured_level, km } = data;

      if (!km || km <= 0) {
        return res.status(400).json({ error: "Distance is required" });
      }

      // Simple CO₂ estimation based on fuel type and distance
      const fuelFactors = {
        petrol: 0.12,  // kg CO2 per km
        diesel: 0.14,
        cng: 0.10,
        electric: 0.05
      };

      const factor = fuelFactors[fuel_type?.toLowerCase()] || 0.12;
      co2 = Number((factor * Number(km)).toFixed(3));

      data.vehicleType = vehicle_type;
      data.fuelType = fuel_type;
      data.distance = km;
      data.co2 = co2;
    }

    // PLASTIC ENTRY LOGIC
    if (data.type === "plastics") {
      const { number_of_items, item_type } = data;
      // Estimate: 0.5 kg CO2 per plastic item
      co2 = Number((0.5 * Number(number_of_items || 0)).toFixed(3));
      data.numberOfItems = number_of_items;
      data.itemType = item_type;
      data.co2 = co2;
    }

    // ENERGY ENTRY LOGIC
    if (data.type === "heating" || data.type === "energy") {
      const { kwh, fuel_type } = data;
      // Electricity: 0.42 kg CO2 per kWh
      co2 = Number((0.42 * Number(kwh || 0)).toFixed(3));
      data.unitsConsumed = kwh;
      data.energyType = fuel_type || 'electricity';
      data.co2 = co2;
      data.type = "energy";
    }

    // PLANTATION ENTRY LOGIC
    if (data.type === "trees" || data.type === "plantation") {
      const { number_of_trees, species } = data;
      
      // CO2 absorption rates per tree per year
      const speciesRates = {
        neem: 30,
        peepal: 28,
        banyan: 21,
        teak: 18
      };
      
      const rate = speciesRates[species?.toLowerCase()] || 22;
      co2 = -Number((rate * Number(number_of_trees || 0)).toFixed(3)); // Negative = offset
      
      data.numberOfTrees = number_of_trees;
      data.treeSpecies = species;
      data.co2 = co2;
      data.type = "plantation";
    }

    const entry = new Entry(data);
    console.log('[createEntry] About to save entry:', entry);
    await entry.save();
    console.log('[createEntry] Entry saved successfully with ID:', entry._id);

    // Return in format frontend expects
    res.status(201).json({
      success: true,
      co2_estimate: Math.abs(co2),
      entry: entry
    });
  } catch (err) {
    console.error('createEntry error:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }).limit(5);
    
    // Format for frontend
    const chart = entries.map(entry => ({
      date: entry.createdAt.toISOString().split('T')[0],
      type: entry.type,
      co2: Math.abs(entry.co2 || 0)
    }));
    
    res.json({
      success: true,
      chart: chart,
      entries: entries
    });
  } catch (err) {
    console.error('getLatest error:', err);
    res.status(500).json({ error: "History fetch error" });
  }
};
