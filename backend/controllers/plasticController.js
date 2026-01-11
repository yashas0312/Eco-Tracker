const PlasticEntry = require('../models/PlasticEntry');

exports.create = async (req, res) => {
  try {
    console.log('[plastic:create] body', req.body);
    const { itemType, numberOfItems, notes } = req.body;
    if (!itemType || numberOfItems == null) return res.status(400).json({ error: 'itemType and numberOfItems required' });

    // simple factor: 0.01 kg CO2 per plastic item (example)
    const co2 = +(Number(numberOfItems) * 0.01).toFixed(3);

    const doc = new PlasticEntry({ itemType, numberOfItems, co2, notes });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('plastic create err', err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.listLatest = async (req, res) => {
  try {
    const docs = await PlasticEntry.find().sort({ createdAt: -1 }).limit(5);
    res.json(docs);
  } catch (err) {
    console.error('plastic list err', err);
    res.status(500).json({ error: 'server error' });
  }
};
