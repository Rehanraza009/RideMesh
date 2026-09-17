// ==============================================================================
// NOTIFICATION SERVICE (IN-APP NOTIFICATION CENTER)
// ==============================================================================
import {
  firestoreAddDoc,
  firestoreSetDoc,
  firestoreQueryDocs,
  COLLECTIONS
} from '../firebase/firestore';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Ride Request Accepted',
    message: 'Rahul Sharma accepted your ride to Sector 62.',
    type: 'ride',
    read: false,
    time: '5m ago',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'notif_2',
    title: 'High AI Demand Tomorrow',
    message: '7 commuters traveling along your daily route. Save up to ₹120.',
    type: 'ai',
    read: false,
    time: '1h ago',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 'notif_3',
    title: 'Safety Check Reminder',
    message: 'Remember to verify OTP & driver vehicle number before boarding.',
    type: 'safety',
    read: true,
    time: 'Yesterday',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const notificationService = {
  // Create an in-app notification
  async createNotification({ recipientId, title, message, type = 'ride', relatedId = null }) {
    const payload = {
      recipientId: recipientId || 'user_default',
      title,
      message,
      type, // 'ride' | 'chat' | 'safety' | 'ai' | 'system'
      read: false,
      relatedId,
      time: 'Just now'
    };

    return firestoreAddDoc(COLLECTIONS.NOTIFICATIONS, payload);
  },

  // Mark a notification as read
  async markAsRead(notificationId) {
    return firestoreSetDoc(COLLECTIONS.NOTIFICATIONS, notificationId, { read: true });
  },

  // Mark all notifications as read
  async markAllAsRead(recipientId) {
    const notifs = await this.getNotifications(recipientId);
    for (const n of notifs) {
      if (!n.read) {
        await this.markAsRead(n.id);
      }
    }
  },

  // Get notifications for recipient
  async getNotifications(recipientId) {
    const list = await firestoreQueryDocs(COLLECTIONS.NOTIFICATIONS, [
      { field: 'recipientId', op: '==', value: recipientId || 'user_default' }
    ]);
    return list && list.length > 0 ? list : DEFAULT_NOTIFICATIONS;
  },

  // Real-time listener for notification center
  subscribeNotifications(recipientId, callback) {
    const fetch = async () => {
      const list = await this.getNotifications(recipientId);
      callback(list);
    };
    fetch();
    const interval = setInterval(fetch, 3500);
    return () => clearInterval(interval);
  }
};
