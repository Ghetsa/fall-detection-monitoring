import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Notification } from '../types/notification';

const COL = 'notifications';

export async function getNotificationsByCustomer(customerId: string): Promise<Notification[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { isRead: true });
}

export async function markAllNotificationsRead(customerId: string): Promise<void> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    where('isRead', '==', false)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { isRead: true })));
}
