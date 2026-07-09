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
