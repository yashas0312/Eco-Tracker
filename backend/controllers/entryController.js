// Controller for entry management (vehicle, plastic, energy, plantation)

const Entry = require('../models/Entry');
const User = require('../models/User');
const EmissionCalculator = require('../services/calculator');
const mongoose = require('mongoose');

/**
 * Create a vehicle entry
 * POST /api/entries/vehicle
 */
exports.createVehicleEntry = async (req, res) => {
  try {
    const { userId, distance, fuelType, date, description } = req.body;

    // Validation
    if (!userId || !distance || !fuelType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, distance, fuelType'
      });
    }

    if (distance <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Distance must be greater than 0'
      });
    }

    // Calculate emissions
    const { co2Emissions, fuelConsumed } = EmissionCalculator.calculateVehicleEmissions(
      distance,
      fuelType
    );

    try {
      // Create entry
      const entry = new Entry({
        userId,
        type: 'vehicle',
        date: date || new Date(),
        co2Emissions,
        co2Offset: 0,
        ecoPointsEarned: 0,
        details: {
          distance,
          fuelType,
          fuelConsumption: fuelConsumed,
          description: description || ''
        }
      });

      await entry.save();

      // Update user lifetime stats
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'lifetimeStats.totalEmissions': co2Emissions,
          'lifetimeStats.entriesLogged': 1
        }
      });

      return res.status(201).json({
        success: true,
        entry: {
          _id: entry._id,
          type: entry.type,
          co2Emissions: entry.co2Emissions,
          details: entry.details,
          createdAt: entry.createdAt
        }
      });
    } catch (dbErr) {
      // DB not available - return calculated result without saving
      console.log('DB not available, returning calculated result');
      return res.status(201).json({
        success: true,
        entry: {
          _id: 'temp-' + Date.now(),
          type: 'vehicle',
          co2Emissions: co2Emissions,
          details: {
            distance,
            fuelType,
            fuelConsumption: fuelConsumed,
            description: description || ''
          },
          createdAt: new Date()
        },
        warning: 'Entry calculated but not saved (database not connected)'
      });
    }
  } catch (err) {
    console.error('createVehicleEntry error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Create a plastic entry
 * POST /api/entries/plastic
 */
exports.createPlasticEntry = async (req, res) => {
  try {
    const { userId, plasticType, quantity, unit, date } = req.body;

    // Validation
    if (!userId || !plasticType || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, plasticType, quantity'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0'
      });
    }

    // Calculate emissions
    const co2Emissions = EmissionCalculator.calculatePlasticEmissions(
      quantity,
      plasticType
    );

    try {
      // Create entry
      const entry = new Entry({
        userId,
        type: 'plastic',
        date: date || new Date(),
        co2Emissions,
        co2Offset: 0,
        ecoPointsEarned: 0,
        details: {
          plasticType,
          quantity,
          unit: unit || 'kg'
        }
      });

      await entry.save();

      // Update user lifetime stats
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'lifetimeStats.totalEmissions': co2Emissions,
          'lifetimeStats.entriesLogged': 1
        }
      });

      return res.status(201).json({
        success: true,
        entry: {
          _id: entry._id,
          type: entry.type,
          co2Emissions: entry.co2Emissions,
          details: entry.details,
          createdAt: entry.createdAt
        }
      });
    } catch (dbErr) {
      // DB not available - return calculated result without saving
      return res.status(201).json({
        success: true,
        entry: {
          _id: 'temp-' + Date.now(),
          type: 'plastic',
          co2Emissions: co2Emissions,
          details: {
            plasticType,
            quantity,
            unit: unit || 'kg'
          },
          createdAt: new Date()
        },
        warning: 'Entry calculated but not saved (database not connected)'
      });
    }
  } catch (err) {
    console.error('createPlasticEntry error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Create an energy entry
 * POST /api/entries/energy
 */
exports.createEnergyEntry = async (req, res) => {
  try {
    const { userId, energySource, amount, isRenewable, date } = req.body;

    // Validation
    if (!userId || !energySource || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, energySource, amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Calculate emissions
    const co2Emissions = EmissionCalculator.calculateEnergyEmissions(
      amount,
      energySource,
      isRenewable || false
    );

    try {
      // Create entry
      const entry = new Entry({
        userId,
        type: 'energy',
        date: date || new Date(),
        co2Emissions,
        co2Offset: 0,
        ecoPointsEarned: 0,
        details: {
          energySource,
          amount,
          isRenewable: isRenewable || false
        }
      });

      await entry.save();

      // Update user lifetime stats
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'lifetimeStats.totalEmissions': co2Emissions,
          'lifetimeStats.entriesLogged': 1
        }
      });

      return res.status(201).json({
        success: true,
        entry: {
          _id: entry._id,
          type: entry.type,
          co2Emissions: entry.co2Emissions,
          details: entry.details,
          createdAt: entry.createdAt
        }
      });
    } catch (dbErr) {
      // DB not available - return calculated result without saving
      return res.status(201).json({
        success: true,
        entry: {
          _id: 'temp-' + Date.now(),
          type: 'energy',
          co2Emissions: co2Emissions,
          details: {
            energySource,
            amount,
            isRenewable: isRenewable || false
          },
          createdAt: new Date()
        },
        warning: 'Entry calculated but not saved (database not connected)'
      });
    }
  } catch (err) {
    console.error('createEnergyEntry error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Create a plantation entry
 * POST /api/entries/plantation
 */
exports.createPlantationEntry = async (req, res) => {
  try {
    const { userId, treesPlanted, date, location } = req.body;

    // Validation
    if (!userId || !treesPlanted) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, treesPlanted'
      });
    }

    if (treesPlanted <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Trees planted must be greater than 0'
      });
    }

    // Calculate offset and eco points
    const { co2Offset, ecoPoints } = EmissionCalculator.calculateTreeOffset(treesPlanted);

    try {
      // Create entry
      const entry = new Entry({
        userId,
        type: 'plantation',
        date: date || new Date(),
        co2Emissions: 0,
        co2Offset,
        ecoPointsEarned: ecoPoints,
        details: {
          treesPlanted,
          location: location || '',
          notes: ''
        }
      });

      await entry.save();

      // Update user lifetime stats
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'lifetimeStats.totalOffsets': co2Offset,
          'lifetimeStats.ecoPoints': ecoPoints,
          'lifetimeStats.treesPlanted': treesPlanted,
          'lifetimeStats.entriesLogged': 1
        }
      });

      return res.status(201).json({
        success: true,
        entry: {
          _id: entry._id,
          type: entry.type,
          co2Offset: entry.co2Offset,
          ecoPointsEarned: entry.ecoPointsEarned,
          details: entry.details,
          createdAt: entry.createdAt
        }
      });
    } catch (dbErr) {
      // DB not available - return calculated result without saving
      return res.status(201).json({
        success: true,
        entry: {
          _id: 'temp-' + Date.now(),
          type: 'plantation',
          co2Offset: co2Offset,
          ecoPointsEarned: ecoPoints,
          details: {
            treesPlanted,
            location: location || '',
            notes: ''
          },
          createdAt: new Date()
        },
        warning: 'Entry calculated but not saved (database not connected)'
      });
    }
  } catch (err) {
    console.error('createPlantationEntry error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Get entry history
 * GET /api/entries/history?userId=...&weeks=12&type=all
 */
exports.getHistory = async (req, res) => {
  try {
    const { userId, weeks = 12, type = 'all' } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    try {
      // Calculate date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weeks * 7));

      // Build query
      const query = {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      };

      if (type !== 'all') {
        query.type = type;
      }

      // Fetch entries
      const entries = await Entry.find(query).sort({ date: -1 });

      // Calculate totals
      const totalEmissions = entries.reduce((sum, entry) => sum + entry.co2Emissions, 0);
      const totalOffsets = entries.reduce((sum, entry) => sum + entry.co2Offset, 0);
      const netFootprint = totalEmissions - totalOffsets;

      return res.json({
        success: true,
        entries: entries.map(entry => ({
          _id: entry._id,
          type: entry.type,
          co2Emissions: entry.co2Emissions,
          co2Offset: entry.co2Offset,
          ecoPointsEarned: entry.ecoPointsEarned,
          date: entry.date,
          details: entry.details
        })),
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        totalOffsets: parseFloat(totalOffsets.toFixed(2)),
        netFootprint: parseFloat(netFootprint.toFixed(2))
      });
    } catch (dbErr) {
      // DB not available - return empty history
      return res.json({
        success: true,
        entries: [],
        totalEmissions: 0,
        totalOffsets: 0,
        netFootprint: 0,
        warning: 'Database not connected'
      });
    }
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

module.exports = exports;
