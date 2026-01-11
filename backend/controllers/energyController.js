const EnergyEntry = require('../models/EnergyEntry');

exports.create = async (req, res) => {
  try {
    console.log('[energy:create] body', req.body);
    const { energyType, unitsConsumed, gridFactor = 0.9, notes } = req.body;
    if (!energyType || unitsConsumed == null) return res.status(400).json({ error: 'energyType and unitsConsumed required' });

    const co2 = +(Number(unitsConsumed) * Number(gridFactor)).toFixed(3);

    const doc = new EnergyEntry({ energyType, unitsConsumed, gridFactor, co2, notes });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('energy create err', err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.listLatest = async (req, res) => {
  try {
    const docs = await EnergyEntry.find().sort({ createdAt: -1 }).limit(5);
    res.json(docs);
  } catch (err) {
    console.error('energy list err', err);
    res.status(500).json({ error: 'server error' });
  }
};
