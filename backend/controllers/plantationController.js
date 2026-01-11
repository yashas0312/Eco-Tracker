const PlantationEntry = require('../models/PlantationEntry');

const speciesRates = { Neem:30, Mango:24, Banyan:21, Teak:18 }; // kg CO2 per tree per year (example)

exports.create = async (req, res) => {
  try {
    console.log('[plantation:create] body', req.body);
    const { treeSpecies, numberOfTrees, survivalProbability = 0.7, notes } = req.body;
    if (!treeSpecies || numberOfTrees == null) return res.status(400).json({ error: 'treeSpecies and numberOfTrees required' });

    const perTree = speciesRates[treeSpecies] || 22;
    const est = Number(numberOfTrees) * perTree * Number(survivalProbability);
    const co2 = -Math.round(est * 10) / 10; // negative = offset

    const doc = new PlantationEntry({ treeSpecies, numberOfTrees, survivalProbability, estimatedCo2PerYearKg: perTree, co2, notes });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('plantation create err', err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.listLatest = async (req, res) => {
  try {
    const docs = await PlantationEntry.find().sort({ createdAt: -1 }).limit(5);
    res.json(docs);
  } catch (err) {
    console.error('plantation list err', err);
    res.status(500).json({ error: 'server error' });
  }
};
