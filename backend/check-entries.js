// Check what's in the entries collection
require('dotenv').config();
const mongoose = require('mongoose');
const Entry = require('./models/Entry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotracker';
console.log('Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    const entries = await Entry.find().sort({ createdAt: -1 });
    console.log(`\n📊 Found ${entries.length} entries in 'entries' collection:\n`);
    
    entries.forEach((entry, idx) => {
      console.log(`${idx + 1}. Type: ${entry.type}, CO2: ${entry.co2} kg, Date: ${entry.createdAt}`);
      if (entry.type === 'energy') {
        console.log(`   Energy: ${entry.energyType}, ${entry.unitsConsumed} kWh`);
      }
      if (entry.type === 'vehicle') {
        console.log(`   Vehicle: ${entry.vehicleType}, ${entry.fuelType}, ${entry.distance} km`);
      }
      if (entry.type === 'plastics') {
        console.log(`   Plastics: ${entry.itemType}, ${entry.numberOfItems} items`);
      }
      if (entry.type === 'plantation') {
        console.log(`   Trees: ${entry.treeSpecies}, ${entry.numberOfTrees} trees`);
      }
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
