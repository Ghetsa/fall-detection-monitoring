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

const COL = 'devices';

export async function getAllDevices(): Promise<Device[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Device));
}

export async function getDevicesByCustomer(customerId: string): Promise<Device[]> {
  const q = query(collection(db, COL), where('customerId', '==', customerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Device));
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
