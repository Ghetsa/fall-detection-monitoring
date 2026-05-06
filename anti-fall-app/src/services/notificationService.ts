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

type FirestoreDoc = Record<string, unknown>;

function normalizeNotification(id: string, data: FirestoreDoc): Notification {
  return {
    id,
    customerId: String((data as any).customerId ?? ''),
    lansiaId: String((data as any).lansiaId ?? ''),
    incidentId: (data as any).incidentId ? String((data as any).incidentId) : undefined,
    title: String((data as any).title ?? ''),
    description: String((data as any).description ?? ''),
    type: (data as any).type,
    isRead: Boolean((data as any).isRead ?? false),
    createdAt: (data as any).createdAt,
  };
}

export async function getNotificationsByCustomer(customerId: string): Promise<Notification[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeNotification(d.id, d.data() as FirestoreDoc));
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
