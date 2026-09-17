// ==============================================================================
// REAL-TIME CHAT SERVICE (FIRESTORE CHATS & MESSAGES)
// ==============================================================================
import {
  firestoreAddDoc,
  firestoreSetDoc,
  firestoreQueryDocs,
  firestoreListenDoc,
  COLLECTIONS
} from '../firebase/firestore';

const QUICK_REPLIES = [
  "I'm here",
  "5 min away",
  "Please wait",
  "Where are you?"
];

export const chatService = {
  getQuickReplies() {
    return QUICK_REPLIES;
  },

  // Send a new message
  async sendMessage(chatId, senderId, senderRole, text) {
    if (!text || !text.trim()) return null;

    const newMsg = {
      chatId: chatId || 'chat_default',
      senderId: senderId || 'passenger',
      senderRole: senderRole || 'passenger',
      text: text.trim(),
      read: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    // Store in chat messages collection
    const saved = await firestoreAddDoc(`chats_${chatId || 'default'}_messages`, newMsg);
    return saved;
  },

  // Real-time messages listener
  subscribeMessages(chatId, callback) {
    const colName = `chats_${chatId || 'default'}_messages`;
    // Polling / listener for messages
    const fetch = async () => {
      const msgs = await firestoreQueryDocs(colName, [], { field: 'createdAt', dir: 'asc' }, 50);
      if (msgs && msgs.length > 0) {
        callback(msgs);
      } else {
        // Initial defaults
        callback([
          { id: '1', senderRole: 'driver', text: "Hi! I'm near the pickup point", timestamp: '09:01 AM' },
          { id: '2', senderRole: 'passenger', text: 'Okay, coming', timestamp: '09:02 AM' },
          { id: '3', senderRole: 'driver', text: '👍 See you in 2 mins', timestamp: '09:03 AM' }
        ]);
      }
    };

    fetch();
    const interval = setInterval(fetch, 2500);
    return () => clearInterval(interval);
  }
};
