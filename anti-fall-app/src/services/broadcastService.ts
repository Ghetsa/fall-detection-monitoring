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

function toMillis(value: unknown): number {
  if (!value) return 0;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as any).toDate === 'function'
  ) {
    const d = (value as any).toDate();
    return d instanceof Date ? d.getTime() : 0;
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return Number((value as any).seconds ?? 0) * 1000;
  }
  if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
    const d = new Date(value as any);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }
  return 0;
}

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
    (a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)
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
