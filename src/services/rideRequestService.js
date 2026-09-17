// ==============================================================================
// RIDE REQUEST SERVICE (FIRESTORE RIDE REQUESTS REPOSITORY)
// ==============================================================================
import {
  firestoreGetDoc,
  firestoreSetDoc,
  firestoreAddDoc,
  firestoreQueryDocs,
  firestoreListenDoc,
  COLLECTIONS
} from '../firebase/firestore';
import { notificationService } from './notificationService';

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const rideRequestService = {
  // Passenger sends a request to join a ride
  async sendRequest(requestData) {
    const payload = {
      rideId: requestData.rideId || 'ride_1',
      passengerId: requestData.passengerId,
      passengerName: requestData.passengerName || 'Mohd Rehan',
      passengerAvatar: requestData.passengerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      driverId: requestData.driverId || 'driver_default',
      driverName: requestData.driverName || 'Rahul Sharma',
      pickupPoint: requestData.pickupPoint || 'Pari Chowk Metro',
      destination: requestData.destination || 'Noida Sector 62',
      matchScore: requestData.matchScore || 94,
      routeMatch: requestData.routeMatch || 96,
      timeMatch: requestData.timeMatch || 92,
      detour: requestData.detour || 0.4,
      estimatedCost: requestData.estimatedCost || 82,
      status: REQUEST_STATUS.PENDING
    };

    const request = await firestoreAddDoc(COLLECTIONS.RIDE_REQUESTS, payload);

    // Trigger in-app notification for Driver
    await notificationService.createNotification({
      recipientId: payload.driverId,
      title: 'New Ride Request',
      message: `${payload.passengerName} requested to join your ride (${payload.matchScore}% match).`,
      type: 'ride',
      relatedId: request.id
    });

    return request;
  },

  // Driver accepts request
  async acceptRequest(requestId, driverId, passengerId) {
    await firestoreSetDoc(COLLECTIONS.RIDE_REQUESTS, requestId, {
      status: REQUEST_STATUS.ACCEPTED
    });

    // Notify passenger
    await notificationService.createNotification({
      recipientId: passengerId,
      title: 'Ride Request Accepted! 🎉',
      message: 'Your driver accepted the request. Arriving at pickup soon.',
      type: 'ride',
      relatedId: requestId
    });

    return { success: true };
  },

  // Driver declines request
  async declineRequest(requestId, passengerId) {
    await firestoreSetDoc(COLLECTIONS.RIDE_REQUESTS, requestId, {
      status: REQUEST_STATUS.DECLINED
    });

    // Notify passenger
    await notificationService.createNotification({
      recipientId: passengerId,
      title: 'Ride Request Update',
      message: 'The driver could not accommodate this request.',
      type: 'ride',
      relatedId: requestId
    });

    return { success: true };
  },

  // Passenger cancels request
  async cancelRequest(requestId) {
    return firestoreSetDoc(COLLECTIONS.RIDE_REQUESTS, requestId, {
      status: REQUEST_STATUS.CANCELLED
    });
  },

  // Real-time listener for a single request
  subscribeRequest(requestId, callback) {
    return firestoreListenDoc(COLLECTIONS.RIDE_REQUESTS, requestId, callback);
  }
};
