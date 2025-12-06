// Controller for activity logging and analytics
// TODO: validate incoming payloads, compute CO2 with calculator, save logs

const Activity = require('../models/Activity');
const calculator = require('../services/calculator');
const exporter = require('../services/exporter');

/**
 * Create a log entry. This will compute CO2 using calculator functions.
 * If MongoDB is available it will attempt to save; otherwise returns computed result.
 */
exports.createLog = async (req, res) => {
  try {
    const { userId, type, payload } = req.body || {};
    if (!type || !payload) return res.status(400).json({ error: 'Missing type or payload' });

    let co2 = 0;
    if (type === 'vehicle') {
      const { km, vehicle_type, fuel_type } = payload;
      co2 = calculator.calcVehicleEmission(Number(km), vehicle_type, fuel_type);
    } else if (type === 'plastics') {
      const { number_of_items, item_type } = payload;
      co2 = calculator.calcPlasticsEmission(Number(number_of_items), item_type);
    } else if (type === 'heating') {
      const { kwh, fuel_type, heating_days } = payload;
      co2 = calculator.calcHeatingEmission(Number(kwh), fuel_type, Number(heating_days));
    } else if (type === 'trees') {
      const { number_of_trees, species } = payload;
      // tree logs are negative emissions (offsets) — store as negative value to indicate removal
      co2 = -Math.abs(calculator.calcTreeOffset(Number(number_of_trees), species));
    } else {
      return res.status(400).json({ error: 'Unknown type' });
    }

    const entry = {
      userId: userId || null,
      type,
      data: payload,
      co2_estimate: Number(co2),
      timestamp: new Date()
    };

    // Attempt to save to DB, but don't fail if DB is unavailable
    try {
      const saved = await Activity.create(entry);
      return res.json({ saved, co2_estimate: entry.co2_estimate });
    } catch (saveErr) {
      // DB not available or save failed — return computed result
      return res.json({ saved: null, co2_estimate: entry.co2_estimate, warning: 'Could not save to DB' });
    }
  } catch (err) {
    console.error('createLog error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Analytics stub: aggregates recent logs if DB available, otherwise returns empty series.
 */
exports.analytics = async (req, res) => {
  const { userId } = req.query || {};
  try {
    // Try to aggregate from DB
    try {
      const series = await Activity.aggregate([
        { $match: userId ? { userId: require('mongoose').Types.ObjectId(userId) } : {} },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, total: { $sum: '$co2_estimate' } } },
        { $sort: { _id: 1 } }
      ]);
      // Convert to chart-friendly format
      const chart = series.map(s => ({ date: s._id, co2: s.total }));
      return res.json({ chart });
    } catch (dbErr) {
      // DB not available — return placeholder series
      const today = new Date();
      const chart = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return { date: d.toISOString().slice(0, 10), co2: 0 };
      });
      return res.json({ chart, warning: 'DB unavailable - returning empty series' });
    }
  } catch (err) {
    console.error('analytics error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Calculate only endpoint: compute CO2 for given payload without saving
 */
exports.calculateOnly = async (req, res) => {
  try {
    const { type, payload } = req.body || {};
    if (!type || !payload) return res.status(400).json({ error: 'Missing type or payload' });
    let co2 = 0;
    if (type === 'vehicle') {
      const { km, vehicle_type, fuel_type } = payload;
      co2 = calculator.calcVehicleEmission(Number(km), vehicle_type, fuel_type);
    } else if (type === 'plastics') {
      const { number_of_items, item_type } = payload;
      co2 = calculator.calcPlasticsEmission(Number(number_of_items), item_type);
    } else if (type === 'heating') {
      const { kwh, fuel_type, heating_days } = payload;
      co2 = calculator.calcHeatingEmission(Number(kwh), fuel_type, Number(heating_days));
    } else if (type === 'trees') {
      const { number_of_trees, species } = payload;
      co2 = -Math.abs(calculator.calcTreeOffset(Number(number_of_trees), species));
    } else {
      return res.status(400).json({ error: 'Unknown type' });
    }
    return res.json({ co2_estimate: Number(co2) });
  } catch (err) {
    console.error('calculateOnly error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Export data endpoint — uses exporter service. If DB unavailable returns sample JSON.
 */
exports.exportData = async (req, res) => {
  try {
    const { userId, format } = req.query || {};
    try {
      if ((format || '').toLowerCase() === 'csv') {
        const csv = exporter.exportAsCSV(userId);
        res.setHeader('Content-Type', 'text/csv');
        return res.send(csv);
      } else {
        const json = exporter.exportAsJSON(userId);
        res.setHeader('Content-Type', 'application/json');
        return res.json(json);
      }
    } catch (e) {
      // Exporter not implemented — return a stub
      return res.json({ message: 'export stub - implement exporter' });
    }
  } catch (err) {
    console.error('exportData error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
