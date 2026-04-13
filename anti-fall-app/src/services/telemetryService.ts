import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Telemetry } from '../types/telemetry';

const COL = 'telemetry';

export async function getLatestTelemetryByLansia(lansiaId: string): Promise<Telemetry | null> {
  const q = query(
    collection(db, COL),
    where('lansiaId', '==', lansiaId),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Telemetry;
}

export async function getTelemetryByLansia(
  lansiaId: string,
  limitCount: number = 20
): Promise<Telemetry[]> {
  const q = query(
    collection(db, COL),
    where('lansiaId', '==', lansiaId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Telemetry));
}

export async function getTelemetryByCustomer(customerId: string): Promise<Telemetry[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Telemetry));
}
