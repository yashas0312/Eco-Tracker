// Quick test to verify energy API endpoint
const fetch = require('node-fetch');

async function testEnergyAPI() {
  try {
    console.log('Testing POST /api/energy...');
    
    const response = await fetch('http://localhost:4000/api/energy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        energyType: 'Electricity',
        unitsConsumed: 100,
        gridFactor: 0.9,
        notes: 'Test entry from API test'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ SUCCESS! Energy entry created with CO2:', data.co2, 'kg');
    } else {
      console.log('❌ FAILED:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEnergyAPI();
