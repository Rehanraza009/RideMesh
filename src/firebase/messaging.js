// ==============================================================================
// FIREBASE CLOUD MESSAGING (FCM) & PUSH NOTIFICATIONS
// ==============================================================================
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, isFirebaseConfigured } from './config';

/**
 * Requests push notification permission with clear user context.
 * Saves the FCM device token to the user's document.
 */
export const requestPushNotificationPermission = async (vapidKey = null) => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, reason: 'Notifications not supported on this platform' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { granted: false, reason: 'Permission denied by user' };
    }

    if (isFirebaseConfigured && messaging) {
      const token = await getToken(messaging, { vapidKey });
      return { granted: true, token };
    }

    return { granted: true, token: 'mock_fcm_token_' + Date.now() };
  } catch (error) {
    console.warn('[RideMesh FCM Warning]:', error.message);
    return { granted: false, reason: error.message };
  }
};

/**
 * Subscribes to foreground push notifications.
 */
export const subscribeForegroundMessages = (onPayload) => {
  if (isFirebaseConfigured && messaging) {
    return onMessage(messaging, (payload) => {
      onPayload(payload);
    });
  }
  return () => {};
};
