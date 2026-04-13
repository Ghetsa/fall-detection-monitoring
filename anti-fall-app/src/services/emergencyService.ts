import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Emergency } from '../types/emergency';

const COL = 'emergency';

export async function getEmergencyByCustomer(customerId: string): Promise<Emergency[]> {
  const q = query(collection(db, COL), where('customerId', '==', customerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Emergency));
}

export async function getEmergencyByLansia(lansiaId: string): Promise<Emergency | null> {
  const q = query(collection(db, COL), where('lansiaId', '==', lansiaId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Emergency;
}

export async function saveEmergencyContact(data: Omit<Emergency, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEmergencyContact(
  id: string,
  data: Partial<Omit<Emergency, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}
