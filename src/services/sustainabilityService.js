// ==============================================================================
// SUSTAINABILITY IMPACT SERVICE (GREEN MOBILITY METRICS)
// ==============================================================================

export const sustainabilityService = {
  // Calculate ecological & economic impact from completed shared rides
  calculateImpact(sharedRides = 24, totalDistanceKm = 480) {
    // Emissions factor: ~0.12 kg CO2 per km; sharing saves ~0.089 kg/km
    const co2SavedKg = Number((totalDistanceKm * 0.089).toFixed(1));
    // Fuel saved: ~14 km per liter
    const fuelSavedL = Number((totalDistanceKm / 14 * 0.53).toFixed(1));
    // Money saved: standard cab vs carpool share
    const moneySavedInr = Math.round(totalDistanceKm * 2.6);
    // Vehicles avoided off the road
    const vehiclesAvoided = Math.max(1, Math.round(sharedRides * 0.8));

    return {
      sharedRides,
      totalDistanceKm,
      co2SavedKg,
      fuelSavedL,
      moneySavedInr,
      vehiclesAvoided,
      weeklyChart: [
        { day: 'Mon', val: 6.2 },
        { day: 'Tue', val: 8.5 },
        { day: 'Wed', val: 5.1 },
        { day: 'Thu', val: 9.8 },
        { day: 'Fri', val: 11.2 },
        { day: 'Sat', val: 2.0 },
        { day: 'Sun', val: 0.0 }
      ]
    };
  }
};
