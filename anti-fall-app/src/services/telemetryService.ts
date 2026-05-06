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

type FirestoreDoc = Record<string, unknown>;

function normalizeTelemetry(id: string, data: FirestoreDoc): Telemetry {
  const locationRaw = data.location as any;
  const location =
    locationRaw && typeof locationRaw === 'object'
      ? {
          latitude: Number(locationRaw.latitude ?? 0),
          longitude: Number(locationRaw.longitude ?? 0),
          locationName:
            typeof locationRaw.locationName === 'string' ? locationRaw.locationName : undefined,
        }
      : {
          latitude: Number((data as any).latitude ?? 0),
          longitude: Number((data as any).longitude ?? 0),
          locationName: typeof (data as any).locationName === 'string' ? (data as any).locationName : undefined,
        };

  return {
    id,
    lansiaId: String((data as any).lansiaId ?? ''),
    deviceId: String((data as any).deviceId ?? ''),
    customerId: String((data as any).customerId ?? ''),
    timestamp: (data as any).timestamp,
    location,
    batteryLevel: Number((data as any).batteryLevel ?? 0),
    accelX: Number((data as any).accelX ?? 0),
    accelY: Number((data as any).accelY ?? 0),
    accelZ: Number((data as any).accelZ ?? 0),
    isFallDetected: Boolean((data as any).isFallDetected ?? false),
    stepCount: Number((data as any).stepCount ?? 0),
  };
}

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
  return normalizeTelemetry(d.id, d.data() as FirestoreDoc);
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
  return snap.docs.map((d) => normalizeTelemetry(d.id, d.data() as FirestoreDoc));
}

export async function getTelemetryByCustomer(customerId: string): Promise<Telemetry[]> {
  const q = query(
    collection(db, COL),
    where('customerId', '==', customerId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeTelemetry(d.id, d.data() as FirestoreDoc));
}
