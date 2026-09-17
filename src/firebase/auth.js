// ==============================================================================
// FIREBASE AUTHENTICATION WRAPPER
// ==============================================================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

// Local storage key for offline session persistence
const OFFLINE_AUTH_KEY = 'ridemesh_offline_auth_user';

export const firebaseSignUp = async (email, password, fullName) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await updateProfile(userCredential.user, { displayName: fullName });
    }
    return userCredential.user;
  }

  // Graceful offline fallback
  const mockUser = {
    uid: 'user_' + Date.now(),
    email,
    displayName: fullName || 'RideMesh Commuter',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    emailVerified: false
  };
  localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const firebaseSignIn = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Graceful offline fallback
  const existing = localStorage.getItem(OFFLINE_AUTH_KEY);
  const user = existing ? JSON.parse(existing) : {
    uid: 'user_default',
    email,
    displayName: 'Mohd Rehan',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    emailVerified: true
  };
  localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(user));
  return user;
};

export const firebaseSignOut = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(OFFLINE_AUTH_KEY);
};

export const firebaseResetPassword = async (email) => {
  if (isFirebaseConfigured && auth) {
    return sendPasswordResetEmail(auth, email);
  }
  return true;
};

export const firebaseSubscribeAuth = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }

  // Offline subscriber
  const stored = localStorage.getItem(OFFLINE_AUTH_KEY);
  if (stored) {
    try {
      callback(JSON.parse(stored));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }

  return () => {};
};

export const firebaseGoogleSignIn = async () => {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  // Offline fallback
  const mockUser = {
    uid: 'google_user_' + Date.now(),
    email: 'google.user@ridemesh.ai',
    displayName: 'Mohd Rehan',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    emailVerified: true
  };
  localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const firebaseAppleSignIn = async () => {
  return firebaseGoogleSignIn();
};
