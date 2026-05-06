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

type FirestoreDoc = Record<string, unknown>;

function normalizeIncident(id: string, data: FirestoreDoc): Incident {
  const locationRaw = (data as any).location;
  const location =
    locationRaw && typeof locationRaw === 'object'
      ? {
          latitude:
            typeof locationRaw.latitude === 'number' ? locationRaw.latitude : undefined,
          longitude:
            typeof locationRaw.longitude === 'number' ? locationRaw.longitude : undefined,
          locationName:
            typeof locationRaw.locationName === 'string' ? locationRaw.locationName : undefined,
        }
      : {
          latitude:
            typeof (data as any).latitude === 'number' ? (data as any).latitude : undefined,
          longitude:
            typeof (data as any).longitude === 'number' ? (data as any).longitude : undefined,
          locationName: typeof locationRaw === 'string' ? locationRaw : undefined,
        };

  return {
    id,
    lansiaId: String((data as any).lansiaId ?? ''),
    deviceId: String((data as any).deviceId ?? ''),
    customerId: String((data as any).customerId ?? ''),
    type: (data as any).type,
    severity: (data as any).severity,
    description: String((data as any).description ?? ''),
    location,
    timestamp: (data as any).timestamp,
    isResolved: Boolean((data as any).isResolved ?? false),
    resolvedAt: (data as any).resolvedAt,
  };
}

export async function getAllIncidents(): Promise<Incident[]> {
  const q = query(collection(db, COL), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeIncident(d.id, d.data() as FirestoreDoc));
}

export async function getIncidentsByCustomer(customerId: string): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeIncident(d.id, d.data() as FirestoreDoc));
}

export async function getIncidentsByLansia(lansiaId: string): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    where('lansiaId', '==', lansiaId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeIncident(d.id, d.data() as FirestoreDoc));
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
  return snap.docs.map((d) => normalizeIncident(d.id, d.data() as FirestoreDoc));
}

export async function getRecentIncidents(n: number = 5): Promise<Incident[]> {
  const q = query(
    collection(db, COL),
    orderBy('timestamp', 'desc'),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeIncident(d.id, d.data() as FirestoreDoc));
}
