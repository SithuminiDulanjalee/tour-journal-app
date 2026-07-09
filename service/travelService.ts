import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { TravelEntry } from '@/types';

const entriesRef = collection(db, 'travelEntries');

export async function fetchEntries(userId: string): Promise<TravelEntry[]> {
  const q = query(entriesRef, where('userId', '==', userId), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TravelEntry));
}

export async function createEntry(entry: Omit<TravelEntry, 'id'>) {
  return addDoc(entriesRef, { ...entry, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateEntry(id: string, entry: Partial<TravelEntry>) {
  return updateDoc(doc(db, 'travelEntries', id), { ...entry, updatedAt: serverTimestamp() });
}

export async function deleteEntry(id: string) {
  return deleteDoc(doc(db, 'travelEntries', id));
}

export async function uploadPhoto(localUri: string): Promise<string> {
  const data = new FormData();
  data.append('file', { uri: localUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
  data.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: 'POST', body: data }
  );
  const json = await response.json();
  if (!json.secure_url) throw new Error('Photo upload failed.');
  return json.secure_url;
}
