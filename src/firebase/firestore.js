// ==============================================================================
// FIRESTORE COLLECTIONS & REUSABLE HELPERS
// ==============================================================================
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

// Collection references (when Firestore is active)
export const getCol = (name) => {
  if (isFirebaseConfigured && db) {
    return collection(db, name);
  }
  return null;
};

export const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  RIDES: 'rides',
  RIDE_REQUESTS: 'rideRequests',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications',
  RATINGS: 'ratings'
};

// Generic get document
export const firestoreGetDoc = async (colName, docId) => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, colName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  }
  const key = `rm_${colName}_${docId}`;
  const local = localStorage.getItem(key);
  return local ? JSON.parse(local) : null;
};

// Generic set / create document
export const firestoreSetDoc = async (colName, docId, data, merge = true) => {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, colName, docId);
    await setDoc(docRef, { ...payload, serverUpdatedAt: serverTimestamp() }, { merge });
    return { id: docId, ...payload };
  }

  const key = `rm_${colName}_${docId}`;
  const existing = localStorage.getItem(key);
  const updated = existing && merge ? { ...JSON.parse(existing), ...payload } : payload;
  localStorage.setItem(key, JSON.stringify(updated));
  return { id: docId, ...updated };
};

// Generic add document with generated ID
export const firestoreAddDoc = async (colName, data) => {
  const generatedId = `${colName.slice(0, 3)}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const colRef = collection(db, colName);
    const docRef = await addDoc(colRef, { ...payload, serverCreatedAt: serverTimestamp() });
    return { id: docRef.id, ...payload };
  }

  const key = `rm_${colName}_${generatedId}`;
  localStorage.setItem(key, JSON.stringify({ id: generatedId, ...payload }));
  return { id: generatedId, ...payload };
};

// Generic query documents with offline cache support
export const firestoreQueryDocs = async (colName, conditions = [], sortField = null, limitCount = 50) => {
  if (isFirebaseConfigured && db) {
    const colRef = collection(db, colName);
    let q = query(colRef);
    conditions.forEach(cond => {
      q = query(q, where(cond.field, cond.op, cond.value));
    });
    if (sortField) {
      q = query(q, orderBy(sortField.field, sortField.dir || 'desc'));
    }
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Local storage query simulation
  const results = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith(`rm_${colName}_`)) {
      try {
        const item = JSON.parse(localStorage.getItem(k));
        let match = true;
        for (const cond of conditions) {
          if (cond.op === '==' && item[cond.field] !== cond.value) match = false;
        }
        if (match) results.push(item);
      } catch {}
    }
  }
  return results.slice(0, limitCount);
};

// Real-time listener helper
export const firestoreListenDoc = (colName, docId, callback) => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, colName, docId);
    return onSnapshot(docRef, snap => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() });
      } else {
        callback(null);
      }
    });
  }

  // Offline mock stream
  const poll = () => {
    const key = `rm_${colName}_${docId}`;
    const local = localStorage.getItem(key);
    callback(local ? JSON.parse(local) : null);
  };
  poll();
  const interval = setInterval(poll, 3000);
  return () => clearInterval(interval);
};
