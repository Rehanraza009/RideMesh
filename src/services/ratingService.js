// ==============================================================================
// RATING SERVICE (FIRESTORE RATINGS & AGGREGATIONS)
// ==============================================================================
import {
  firestoreAddDoc,
  firestoreQueryDocs,
  COLLECTIONS
} from '../firebase/firestore';
import { userService } from './userService';

export const ratingService = {
  // Submit a ride rating
  async submitRating({ rideId, authorId, driverId, rating, tags = [], feedback = '' }) {
    const payload = {
      rideId: rideId || 'ride_1',
      authorId: authorId || 'user_default',
      driverId: driverId || 'driver_default',
      rating: Number(rating),
      tags,
      feedback: feedback.trim()
    };

    const doc = await firestoreAddDoc(COLLECTIONS.RATINGS, payload);

    // Update aggregate driver rating
    try {
      const allRatings = await firestoreQueryDocs(COLLECTIONS.RATINGS, [
        { field: 'driverId', op: '==', value: payload.driverId }
      ]);
      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await userService.createOrUpdateProfile(payload.driverId, {
          rating: Number(avg.toFixed(1))
        });
      }
    } catch {}

    return doc;
  }
};
