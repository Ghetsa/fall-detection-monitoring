import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lansia, LansiaFormData } from '../types/lansia';

const COL = 'lansia';

export async function getLansiaByCustomer(customerId: string): Promise<Lansia[]> {
  const q = query(collection(db, COL), where('customerId', '==', customerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lansia));
}

export async function getAllLansia(): Promise<Lansia[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lansia));
}

export async function addLansia(data: LansiaFormData): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLansia(id: string, data: Partial<LansiaFormData>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data });
}

export async function deleteLansia(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
