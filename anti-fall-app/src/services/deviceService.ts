import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Device } from '../types/device';
import { getLansiaByCustomer } from './lansiaService';

const COL = 'devices';

type FirestoreDoc = Record<string, unknown>;

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function normalizeDevice(id: string, data: FirestoreDoc): Device {
  const raw = data as any;
  const lastLocation = raw.lastLocation && typeof raw.lastLocation === 'object'
    ? {
        latitude: Number(raw.lastLocation.latitude ?? raw.latitude ?? 0),
        longitude: Number(raw.lastLocation.longitude ?? raw.longitude ?? 0),
        locationName: raw.lastLocation.locationName ?? raw.locationName,
        batteryLevel: raw.lastLocation.batteryLevel ?? raw.batteryLevel,
        recordedAt: raw.lastLocation.recordedAt ?? raw.lastSeen,
      }
    : undefined;

  return {
    id,
    deviceId: typeof raw.deviceId === 'string' && raw.deviceId.trim() ? raw.deviceId : (typeof raw.serial === 'string' ? raw.serial : undefined),
    serial: typeof raw.serial === 'string' ? raw.serial : undefined,
    lansiaId: typeof raw.lansiaId === 'string' ? raw.lansiaId : undefined,
    isOnline: Boolean(raw.isOnline ?? false),
    lastSeen: raw.lastSeen,
    firmware: typeof raw.firmware === 'string' ? raw.firmware : undefined,
    model: typeof raw.model === 'string' ? raw.model : undefined,
    lastLocation,
    batteryLevel: typeof raw.batteryLevel === 'number' ? raw.batteryLevel : undefined,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : undefined,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : undefined,
    locationName: typeof raw.locationName === 'string' ? raw.locationName : undefined,
    createdAt: raw.createdAt,
  };
}

export async function getAllDevices(): Promise<Device[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => normalizeDevice(d.id, d.data() as FirestoreDoc));
}

export async function getDevicesByCustomer(customerId: string): Promise<Device[]> {
  // Backward compat: legacy schema stored customerId directly in devices.
  // Prefer this path if it returns results, then fallback to deriving from lansia ownership.
  const legacySnap = await getDocs(query(collection(db, COL), where('customerId', '==', customerId)));
  if (!legacySnap.empty) {
    return legacySnap.docs.map((d) => normalizeDevice(d.id, d.data() as FirestoreDoc));
  }

  const lansia = await getLansiaByCustomer(customerId);
  const ids = lansia.map((l) => l.id).filter(Boolean);
  if (ids.length === 0) return [];

  const chunks = chunk(ids, 10);
  const snaps = await Promise.all(
    chunks.map((c) => getDocs(query(collection(db, COL), where('lansiaId', 'in', c))))
  );

  const map = new Map<string, Device>();
  snaps.forEach((snap) => {
    snap.docs.forEach((d) => map.set(d.id, normalizeDevice(d.id, d.data() as FirestoreDoc)));
  });
  return Array.from(map.values());
}

export async function getDeviceBySerial(serial: string): Promise<Device | null> {
  const ref = doc(db, COL, serial);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalizeDevice(snap.id, snap.data() as FirestoreDoc);
}

export async function getDeviceByLansiaId(lansiaId: string): Promise<Device | null> {
  const q = query(collection(db, COL), where('lansiaId', '==', lansiaId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return normalizeDevice(d.id, d.data() as FirestoreDoc);
}

export async function getDeviceByDeviceId(deviceId: string): Promise<Device | null> {
  const trimmed = deviceId.trim();
  if (!trimmed) return null;

  // Fast path: many datasets use deviceId as the document id.
  const direct = await getDoc(doc(db, COL, trimmed));
  if (direct.exists()) return normalizeDevice(direct.id, direct.data() as FirestoreDoc);

  // New schema: explicit deviceId field.
  const byField = await getDocs(query(collection(db, COL), where('deviceId', '==', trimmed)));
  if (!byField.empty) {
    const d = byField.docs[0];
    return normalizeDevice(d.id, d.data() as FirestoreDoc);
  }

  // Backward compat: some docs still key on serial.
  const bySerial = await getDocs(query(collection(db, COL), where('serial', '==', trimmed)));
  if (!bySerial.empty) {
    const d = bySerial.docs[0];
    return normalizeDevice(d.id, d.data() as FirestoreDoc);
  }

  return null;
}

export async function addDevice(
  data: Omit<Device, 'id' | 'createdAt'>
): Promise<string> {
  const serial = (data.deviceId ?? data.serial ?? '').trim();
  await setDoc(
    doc(db, COL, serial),
    {
      ...data,
      deviceId: serial,
      serial,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return serial;
}
