import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Broadcast } from '../types/broadcast';

const COL = 'broadcasts';

export async function getAllBroadcasts(): Promise<Broadcast[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Broadcast));
}

export async function getBroadcastsForRole(
  role: 'admin' | 'customer'
): Promise<Broadcast[]> {
  const [allSnap, roleSnap] = await Promise.all([
    getDocs(
      query(
        collection(db, COL),
        where('targetRole', '==', 'all'),
        where('isActive', '==', true)
      )
    ),
    getDocs(
      query(
        collection(db, COL),
        where('targetRole', '==', role),
        where('isActive', '==', true)
      )
    ),
  ]);

  const map = new Map<string, Broadcast>();
  [...allSnap.docs, ...roleSnap.docs].forEach((d) => {
    map.set(d.id, { id: d.id, ...d.data() } as Broadcast);
  });

  return Array.from(map.values()).sort(
    (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
  );
}

export async function getBroadcastsForCustomer(): Promise<Broadcast[]> {
  return getBroadcastsForRole('customer');
}

export async function sendBroadcast(
  data: Omit<Broadcast, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
