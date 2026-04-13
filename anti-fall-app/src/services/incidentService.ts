import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Incident } from '../types/incident';

const COL = 'incidents';

export async function getAllIncidents(): Promise<Incident[]> {
  const q = query(collection(db, COL), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
}

export async function getIncidentsByCustomer(customerId: string): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
}

export async function getIncidentsByLansia(lansiaId: string): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    where('lansiaId', '==', lansiaId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
}

export async function getTodayIncidents(): Promise<Incident[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, COL),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
}

export async function getRecentIncidents(n: number = 5): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    orderBy('timestamp', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
}
