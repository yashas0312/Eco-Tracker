// Calculator functions to compute emissions
// TODO: load emission factors from data/emission_factors.json or DB

const emissionFactors = require('../data/emission_factors.json');

/**
 * Calculate vehicle emissions (kg CO2)
 * @param {number} km
 * @param {string} vehicleType - e.g. 'car', 'motorcycle', 'bus'
 * @param {string} fuelType - e.g. 'petrol', 'diesel'
 */
function calcVehicleEmission(km, vehicleType, fuelType) {
  // Normalize inputs
  if (!km || km <= 0) return 0;
  vehicleType = (vehicleType || '').toLowerCase();
  fuelType = (fuelType || '').toLowerCase();

  // Try to find a matching factor key
  let key = null;

  // Common keys in emissionFactors.vehicle: car_petrol, car_diesel, motorcycle, bus
  if (vehicleType === 'car') {
    if (fuelType === 'petrol' || fuelType === 'gasoline') key = 'car_petrol';
    else if (fuelType === 'diesel') key = 'car_diesel';
  } else if (vehicleType === 'motorcycle' || vehicleType === 'motorbike') {
    key = 'motorcycle';
  } else if (vehicleType === 'bus') {
    key = 'bus';
  }

  // Fallback: if fuelType alone matches a key
  if (!key) {
    const combined = `${vehicleType}_${fuelType}`.trim();
    if (emissionFactors.vehicle[combined]) key = combined;
  }

  // Last resort: pick car_petrol
  if (!key) key = 'car_petrol';

  const factor = emissionFactors.vehicle[key] || 0;
  return factor * km; // kg CO2
}

/**
 * Calculate plastics emissions (kg CO2)
 * @param {number} numItems
 * @param {string} itemType - e.g. 'plastic_bottle'
 */
function calcPlasticsEmission(numItems, itemType) {
  if (!numItems || numItems <= 0) return 0;
  itemType = (itemType || '').toLowerCase();
  let factor = emissionFactors.plastics[itemType];
  if (!factor) {
    // fallback to bottle
    factor = emissionFactors.plastics['plastic_bottle'] || 0;
  }
  return factor * numItems;
}

/**
 * Calculate heating emissions (kg CO2)
 * @param {number} kwh - if using electricity, this is kWh; if using fuels, interpret as liters or m3 depending on fuelType
 * @param {string} fuelType - 'electricity'|'lpg'|'natural_gas'
 * @param {number} days - optional multiplier (e.g., kwh per day * days)
 */
function calcHeatingEmission(kwh, fuelType, days) {
  if (!kwh || kwh <= 0) return 0;
  days = days || 1;
  fuelType = (fuelType || '').toLowerCase();

  if (fuelType === 'electricity') {
    const factor = emissionFactors.heating['electricity_kwh'] || 0;
    return factor * kwh * days; // assume kwh may be per day
  }

  if (fuelType === 'lpg' || fuelType === 'lpg_per_liter') {
    const factor = emissionFactors.heating['lpg_per_liter'] || 0;
    return factor * kwh * days; // interpret kwh as liters when fuelType is lpg
  }

  if (fuelType === 'natural_gas' || fuelType === 'natural_gas_per_m3') {
    const factor = emissionFactors.heating['natural_gas_per_m3'] || 0;
    return factor * kwh * days; // interpret kwh as m3 when fuelType is natural_gas
  }

  // default: treat as electricity
  const factor = emissionFactors.heating['electricity_kwh'] || 0;
  return factor * kwh * days;
}

/**
 * Calculate tree offset (annual offset in kg CO2)
 * @param {number} numTrees
 * @param {string} species
 */
function calcTreeOffset(numTrees, species) {
  if (!numTrees || numTrees <= 0) return 0;
  const perTree = emissionFactors.tree_offset['tree_species_default_annual_offset_kg'] || 0;
  return perTree * numTrees;
}

module.exports = {
  calcVehicleEmission,
  calcPlasticsEmission,
  calcHeatingEmission,
  calcTreeOffset
};
