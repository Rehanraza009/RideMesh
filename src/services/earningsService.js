// ==============================================================================
// DRIVER EARNINGS SERVICE
// ==============================================================================

export const earningsService = {
  getDriverEarnings(driverId, period = 'weekly') {
    if (period === 'monthly') {
      return {
        period: 'monthly',
        totalEarnings: 11450,
        rideEarnings: 10100,
        incentives: 1350,
        totalRides: 48,
        passengersServed: 124,
        chartData: [
          { label: 'W1', amount: 2600 },
          { label: 'W2', amount: 3100 },
          { label: 'W3', amount: 2850 },
          { label: 'W4', amount: 2900 }
        ]
      };
    }

    if (period === 'yearly') {
      return {
        period: 'yearly',
        totalEarnings: 134200,
        rideEarnings: 119500,
        incentives: 14700,
        totalRides: 560,
        passengersServed: 1480,
        chartData: [
          { label: 'Q1', amount: 31000 },
          { label: 'Q2', amount: 34500 },
          { label: 'Q3', amount: 33800 },
          { label: 'Q4', amount: 34900 }
        ]
      };
    }

    // Default: Weekly
    return {
      period: 'weekly',
      totalEarnings: 2840,
      rideEarnings: 2480,
      incentives: 360,
      totalRides: 12,
      passengersServed: 31,
      chartData: [
        { label: 'Mon', amount: 420 },
        { label: 'Tue', amount: 560 },
        { label: 'Wed', amount: 380 },
        { label: 'Thu', amount: 490 },
        { label: 'Fri', amount: 610 },
        { label: 'Sat', amount: 380 },
        { label: 'Sun', amount: 0 }
      ]
    };
  }
};
