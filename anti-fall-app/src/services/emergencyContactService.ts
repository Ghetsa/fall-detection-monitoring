import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EmergencyContact } from '../types/emergency';
import { getLansiaByCustomer } from './lansiaService';

const COL = 'emergencyContacts';

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function getEmergencyContactsByCustomer(customerId: string): Promise<EmergencyContact[]> {
  // Backward compat:
  // 1) Some environments may still store customerId on emergencyContacts.
  // 2) Some environments may still use the old collection name "emergency".
  const legacyDirect = await getDocs(query(collection(db, COL), where('customerId', '==', customerId)));
  if (!legacyDirect.empty) {
    return legacyDirect.docs.map((d) => ({ id: d.id, ...d.data() } as EmergencyContact));
  }

  const legacyOldCol = await getDocs(query(collection(db, 'emergency'), where('customerId', '==', customerId)));
  if (!legacyOldCol.empty) {
    return legacyOldCol.docs.map((d) => {
      const raw = d.data() as any;
      return {
        id: d.id,
        lansiaId: String(raw.lansiaId ?? ''),
        contactName: String(raw.contactName ?? ''),
        contactPhone: String(raw.contactPhone ?? ''),
        relationship: String(raw.relationship ?? ''),
        isActive: Boolean(raw.isActive ?? true),
        updatedAt: raw.updatedAt,
      } as EmergencyContact;
    });
  }

  // New schema: emergencyContacts does not store customerId; derive by lansia ownership.
  const lansia = await getLansiaByCustomer(customerId);
  const ids = lansia.map((l) => l.id).filter(Boolean);
  return getEmergencyContactsByLansiaIds(ids);
}

export async function getEmergencyContactsByLansiaIds(lansiaIds: string[]): Promise<EmergencyContact[]> {
  const ids = lansiaIds.filter(Boolean);
  if (ids.length === 0) return [];

  const chunks = chunk(ids, 10); // Firestore 'in' supports up to 10 values.
  const snaps = await Promise.all(
    chunks.map((c) => getDocs(query(collection(db, COL), where('lansiaId', 'in', c))))
  );

  const map = new Map<string, EmergencyContact>();
  snaps.forEach((snap) => {
    snap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() } as EmergencyContact));
  });
  return Array.from(map.values());
}

export async function getEmergencyContactByLansia(lansiaId: string): Promise<EmergencyContact | null> {
  const q = query(collection(db, COL), where('lansiaId', '==', lansiaId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as EmergencyContact;
}

export async function saveEmergencyContact(
  data: Omit<EmergencyContact, 'id' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEmergencyContact(
  id: string,
  data: Partial<Omit<EmergencyContact, 'id' | 'updatedAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// Backward-compatible names (old callers)
export const getEmergencyByCustomer = getEmergencyContactsByCustomer;
export const getEmergencyByLansia = getEmergencyContactByLansia;
