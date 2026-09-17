// ==============================================================================
// RIDE SERVICE (FIRESTORE RIDES REPOSITORY)
// ==============================================================================
import {
  firestoreGetDoc,
  firestoreSetDoc,
  firestoreAddDoc,
  firestoreQueryDocs,
  firestoreListenDoc,
  COLLECTIONS
} from '../firebase/firestore';

export const RIDE_STATUS = {
  SCHEDULED: 'SCHEDULED',
  REQUESTED: 'REQUESTED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const rideService = {
  // Create a new ride offer (by Driver)
  async createRide(rideData) {
    const payload = {
      driverId: rideData.driverId,
      driverName: rideData.driverName || 'Rahul Sharma',
      driverAvatar: rideData.driverAvatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      driverRating: rideData.driverRating || 4.8,
      vehicle: rideData.vehicle || 'Hyundai Creta',
      plate: rideData.plate || 'UP16AB1234',
      from: rideData.from || 'Greater Noida',
      to: rideData.to || 'Delhi',
      pickupPoints: rideData.pickupPoints || [
        { name: 'Pari Chowk Metro', detour: 0.3 },
        { name: 'Alpha 1 Commercial Belt', detour: 0.8 }
      ],
      date: rideData.date || 'Today',
      departureTime: rideData.departureTime || '09:00 AM',
      availableSeats: Number(rideData.availableSeats || 3),
      occupiedSeats: Number(rideData.occupiedSeats || 0),
      pricePerPassenger: Number(rideData.pricePerPassenger || 82),
      maxDetour: Number(rideData.maxDetour || 5), // km
      preferences: {
        ac: rideData.ac ?? true,
        music: rideData.music ?? true,
        noSmoking: rideData.noSmoking ?? true,
        pets: rideData.pets ?? false
      },
      route: {
        origin: rideData.from || 'Greater Noida',
        destination: rideData.to || 'Delhi',
        distanceKm: 28.4,
        durationMins: 42
      },
      status: RIDE_STATUS.SCHEDULED
    };

    return firestoreAddDoc(COLLECTIONS.RIDES, payload);
  },

  // Get ride by ID
  async getRide(rideId) {
    return firestoreGetDoc(COLLECTIONS.RIDES, rideId);
  },

  // Update ride status (e.g. IN_PROGRESS, COMPLETED)
  async updateRideStatus(rideId, status) {
    return firestoreSetDoc(COLLECTIONS.RIDES, rideId, { status });
  },

  // Search available rides
  async searchAvailableRides(from = '', to = '') {
    const rides = await firestoreQueryDocs(COLLECTIONS.RIDES, [
      { field: 'status', op: '==', value: RIDE_STATUS.SCHEDULED }
    ]);

    if (!rides || rides.length === 0) {
      // Return default starter rides if none in database yet
      return [
        {
          id: 'ride_1',
          driverName: 'Rahul Sharma',
          driverAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
          rating: 4.8,
          reviewCount: 120,
          vehicle: 'Hyundai Creta',
          plate: 'UP16AB1234',
          from: 'Greater Noida',
          to: 'Noida Sector 62',
          time: '09:00 AM',
          seatsLeft: 3,
          pickup: 'Pari Chowk Metro',
          cost: 82,
          verified: true,
          matchScore: 94,
          routeMatch: 96,
          timeMatch: 92,
          detourKm: 0.4,
          etaMins: 8
        },
        {
          id: 'ride_2',
          driverName: 'Aakash Verma',
          driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 4.6,
          reviewCount: 84,
          vehicle: 'Honda City',
          plate: 'DL8CA9902',
          from: 'Greater Noida',
          to: 'Noida Sector 62',
          time: '09:10 AM',
          seatsLeft: 2,
          pickup: 'Alpha 1 Commercial Belt',
          cost: 95,
          verified: true,
          matchScore: 89,
          routeMatch: 88,
          timeMatch: 94,
          detourKm: 0.8,
          etaMins: 12
        },
        {
          id: 'ride_3',
          driverName: 'Sameer Khan',
          driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          rating: 4.7,
          reviewCount: 96,
          vehicle: 'Maruti Brezza',
          plate: 'UP14CD5521',
          from: 'Greater Noida',
          to: 'Mayur Vihar',
          time: '09:15 AM',
          seatsLeft: 1,
          pickup: 'Knowledge Park II',
          cost: 90,
          verified: true,
          matchScore: 81,
          routeMatch: 82,
          timeMatch: 85,
          detourKm: 1.2,
          etaMins: 15
        }
      ];
    }

    return rides;
  },

  // Get driver's created rides
  async getDriverRides(driverId) {
    return firestoreQueryDocs(COLLECTIONS.RIDES, [
      { field: 'driverId', op: '==', value: driverId }
    ]);
  },

  // Subscribe to live ride status updates
  subscribeRide(rideId, callback) {
    return firestoreListenDoc(COLLECTIONS.RIDES, rideId, callback);
  }
};
