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

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function getAllDevices(): Promise<Device[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Device));
}

export async function getDevicesByCustomer(customerId: string): Promise<Device[]> {
  // Backward compat: legacy schema stored customerId directly in devices.
  // Prefer this path if it returns results, then fallback to deriving from lansia ownership.
  const legacySnap = await getDocs(query(collection(db, COL), where('customerId', '==', customerId)));
  if (!legacySnap.empty) {
    return legacySnap.docs.map((d) => ({ id: d.id, ...d.data() } as Device));
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
    snap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() } as Device));
  });
  return Array.from(map.values());
}

export async function getDeviceBySerial(serial: string): Promise<Device | null> {
  const ref = doc(db, COL, serial);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Device;
}

export async function getDeviceByLansiaId(lansiaId: string): Promise<Device | null> {
  const q = query(collection(db, COL), where('lansiaId', '==', lansiaId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Device;
}

export async function addDevice(
  data: Omit<Device, 'id' | 'createdAt'>
): Promise<string> {
  const serial = data.serial.trim();
  await setDoc(
    doc(db, COL, serial),
    {
      ...data,
      serial,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return serial;
}
