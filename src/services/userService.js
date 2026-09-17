// ==============================================================================
// USER SERVICE (FIRESTORE USERS REPOSITORY)
// ==============================================================================
import {
  firestoreGetDoc,
  firestoreSetDoc,
  firestoreListenDoc,
  COLLECTIONS
} from '../firebase/firestore';

export const userService = {
  // Get user profile by UID
  async getProfile(uid) {
    if (!uid) return null;
    return firestoreGetDoc(COLLECTIONS.USERS, uid);
  },

  // Create or update user profile
  async createOrUpdateProfile(uid, data) {
    if (!uid) throw new Error('User UID is required');
    return firestoreSetDoc(COLLECTIONS.USERS, uid, data);
  },

  // Switch role: PASSENGER, DRIVER, or BOTH
  async updateRole(uid, role) {
    return firestoreSetDoc(COLLECTIONS.USERS, uid, { role });
  },

  // Update ride preferences
  async updatePreferences(uid, preferences) {
    return firestoreSetDoc(COLLECTIONS.USERS, uid, { preferences });
  },

  // Update emergency contacts
  async updateEmergencyContacts(uid, emergencyContacts) {
    return firestoreSetDoc(COLLECTIONS.USERS, uid, { emergencyContacts });
  },

  // Real-time listener for profile changes
  subscribeProfile(uid, callback) {
    return firestoreListenDoc(COLLECTIONS.USERS, uid, callback);
  }
};
