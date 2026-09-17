// ==============================================================================
// AUTH SERVICE (REUSABLE AUTH & SESSION MANAGEMENT)
// ==============================================================================
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseResetPassword,
  firebaseSubscribeAuth,
  firebaseGoogleSignIn,
  firebaseAppleSignIn
} from '../firebase/auth';
import { userService } from './userService';

export const authService = {
  // Register with email and password
  async register(email, password, fullName, phone = '', role = 'passenger') {
    try {
      const user = await firebaseSignUp(email, password, fullName);
      // Create user profile in Firestore
      await userService.createOrUpdateProfile(user.uid, {
        uid: user.uid,
        email: user.email,
        fullName: fullName || user.displayName || 'RideMesh User',
        phoneNumber: phone || '',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: role, // 'PASSENGER', 'DRIVER', or 'BOTH'
        rating: 5.0,
        totalRides: 0,
        verified: true,
        preferences: {
          acRequired: true,
          musicAllowed: true,
          noSmoking: true,
          femaleDriverPreferred: false
        },
        emergencyContacts: [
          { name: 'Family', phone: '+91 98111 22334', relation: 'Family' }
        ]
      });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: this._formatError(error) };
    }
  },

  // Log in with email and password
  async login(email, password) {
    try {
      const user = await firebaseSignIn(email, password);
      // Ensure profile exists
      let profile = await userService.getProfile(user.uid);
      if (!profile) {
        profile = await userService.createOrUpdateProfile(user.uid, {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Mohd Rehan',
          phoneNumber: '+91 98765 43210',
          photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          role: 'passenger',
          rating: 4.8,
          totalRides: 24,
          verified: true
        });
      }
      return { success: true, user, profile };
    } catch (error) {
      return { success: false, error: this._formatError(error) };
    }
  },

  // Log in with Google
  async loginWithGoogle() {
    try {
      const user = await firebaseGoogleSignIn();
      const profile = await userService.getProfile(user.uid);
      if (!profile) {
        await userService.createOrUpdateProfile(user.uid, {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          photoURL: user.photoURL,
          role: 'passenger',
          rating: 5.0,
          totalRides: 0,
          verified: true
        });
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: this._formatError(error) };
    }
  },

  // Log in with Apple
  async loginWithApple() {
    return this.loginWithGoogle();
  },

  // Send password reset
  async forgotPassword(email) {
    try {
      await firebaseResetPassword(email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (error) {
      return { success: false, error: this._formatError(error) };
    }
  },

  // Sign out
  async logout() {
    await firebaseSignOut();
    return { success: true };
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback) {
    return firebaseSubscribeAuth(async (user) => {
      if (user) {
        const profile = await userService.getProfile(user.uid);
        callback({ user, profile });
      } else {
        callback(null);
      }
    });
  },

  // Log in with Demo Account (for instant zero-friction presentation & testing)
  async loginWithDemoAccount(emailOrKey) {
    const key = (emailOrKey || '').toLowerCase();
    let account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === key || a.id === key);
    if (!account) {
      account = DEMO_ACCOUNTS[0]; // Fallback to Passenger
    }

    const mockUser = {
      uid: `demo_${account.id}`,
      email: account.email,
      displayName: account.name,
      photoURL: account.avatar
    };

    const mockProfile = {
      uid: mockUser.uid,
      email: account.email,
      fullName: account.name,
      phoneNumber: account.phone,
      photoURL: account.avatar,
      role: account.role,
      activeMode: account.defaultMode,
      rating: account.rating,
      totalRides: account.totalRides,
      verified: true,
      vehicle: account.vehicle || null,
      isDemo: true
    };

    localStorage.setItem('ridemesh_user_session', JSON.stringify({ user: mockUser, profile: mockProfile }));
    return { success: true, user: mockUser, profile: mockProfile };
  },

  // User-friendly error message formatter (never show raw stack traces)
  _formatError(error) {
    if (!error) return 'An unexpected error occurred. Please try again.';
    const code = error.code || '';
    if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
      return 'Incorrect email or password. Please verify your details.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with this email address already exists. Please login.';
    }
    if (code.includes('network-request-failed')) {
      return "Network error. Please check your internet connection and retry.";
    }
    if (code.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (code.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    return error.message || 'Authentication failed. Please try again.';
  }
};

export const DEMO_ACCOUNTS = [
  {
    id: 'passenger',
    email: 'rehan.demo@gmail.com',
    name: 'Mohd Rehan',
    phone: '+91 98765 43210',
    role: 'passenger',
    defaultMode: 'passenger',
    roleLabel: 'Passenger Demo',
    desc: 'Find and join rides daily',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    rating: 4.9,
    totalRides: 28,
    vehicle: null
  },
  {
    id: 'driver',
    email: 'driver.demo@gmail.com',
    name: 'Rahul Sharma',
    phone: '+91 98111 22334',
    role: 'driver',
    defaultMode: 'driver',
    roleLabel: 'Driver Demo',
    desc: 'Offer seats and share fuel costs',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    rating: 4.8,
    totalRides: 142,
    vehicle: 'Hyundai Creta (UP16AB****)'
  },
  {
    id: 'both',
    email: 'both.demo@gmail.com',
    name: 'Sameer Khan',
    phone: '+91 99222 33445',
    role: 'both',
    defaultMode: 'passenger',
    roleLabel: 'Dual Role Demo',
    desc: 'Ride and drive flexibly (Switch anytime)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.9,
    totalRides: 64,
    vehicle: 'Tata Nexon EV (UP16CD****)'
  }
];
