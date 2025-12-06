class EmissionCalculator {
  static calculateVehicleEmissions(distance, fuelType) {
    if (!distance || distance <= 0) {
      return { co2Emissions: 0, fuelConsumed: 0 };
    }

    const emissionFactors = {
      petrol: { co2PerLiter: 2.31, consumptionPerKm: 0.08 },
      diesel: { co2PerLiter: 2.68, consumptionPerKm: 0.07 },
      electric: { co2PerKwh: 0.42, consumptionPerKm: 0.2 },
      hybrid: { co2PerLiter: 1.5, consumptionPerKm: 0.05 },
      cng: { co2PerKg: 2.75, consumptionPerKm: 0.06 }
    };

    const normalizedFuelType = fuelType.toLowerCase();
    const factor = emissionFactors[normalizedFuelType];

    if (!factor) {
      throw new Error(`Invalid fuel type: ${fuelType}`);
    }

    const fuelConsumed = distance * factor.consumptionPerKm;
    const co2 = fuelConsumed * (factor.co2PerLiter || factor.co2PerKwh || factor.co2PerKg);

    return {
      co2Emissions: parseFloat(co2.toFixed(2)),
      fuelConsumed: parseFloat(fuelConsumed.toFixed(2))
    };
  }

  static calculatePlasticEmissions(quantity, plasticType) {
    if (!quantity || quantity <= 0) {
      return 0;
    }

    const emissionFactors = {
      'single-use': 6.0,
      'bottles': 6.0,
      'bags': 6.0,
      'packaging': 6.0
    };

    const normalizedType = plasticType.toLowerCase();
    const factor = emissionFactors[normalizedType];

    if (!factor) {
      throw new Error(`Invalid plastic type: ${plasticType}`);
    }

    const co2 = quantity * factor;
    return parseFloat(co2.toFixed(2));
  }

  static calculateEnergyEmissions(amount, energySource, isRenewable = false) {
    if (!amount || amount <= 0) {
      return 0;
    }

    if (isRenewable) {
      return 0;
    }

    const emissionFactors = {
      'natural-gas': 0.18,
      'electricity': 0.42,
      'heating-oil': 0.27,
      'coal': 0.34
    };

    const normalizedSource = energySource.toLowerCase();
    const factor = emissionFactors[normalizedSource];

    if (!factor) {
      throw new Error(`Invalid energy source: ${energySource}`);
    }

    const co2 = amount * factor;
    return parseFloat(co2.toFixed(2));
  }

  static calculateTreeOffset(treesPlanted) {
    if (!treesPlanted || treesPlanted <= 0) {
      return { co2Offset: 0, ecoPoints: 0 };
    }

    const co2PerTreePerYear = 22;
    const pointsPerTree = 10;

    const co2Offset = treesPlanted * co2PerTreePerYear;
    const ecoPoints = treesPlanted * pointsPerTree;

    return {
      co2Offset: parseFloat(co2Offset.toFixed(2)),
      ecoPoints: ecoPoints
    };
  }
}

module.exports = EmissionCalculator;
