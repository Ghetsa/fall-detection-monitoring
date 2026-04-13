import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser } from '../types/user';

const COL = 'users';

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ ...d.data() } as AppUser));
}

export async function getUsersByRole(role: 'admin' | 'customer'): Promise<AppUser[]> {
  const q = query(collection(db, COL), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data() } as AppUser));
}
