import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser, AppUserFormData } from '../types/user';

const COL = 'users';

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ ...d.data() } as AppUser));
}

export async function getUsersByRole(role: 'admin' | 'customer'): Promise<AppUser[]> {
  const q = query(collection(db, COL), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data() } as AppUser));
}

export async function getUserById(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
}

export async function saveUserProfile(
  uid: string,
  data: Partial<AppUser>
): Promise<void> {
  await setDoc(
    doc(db, COL, uid),
    {
      uid,
      ...data,
    },
    { merge: true }
  );
}

export async function updateUserRole(
  uid: string,
  role: AppUser['role']
): Promise<void> {
  await setDoc(
    doc(db, COL, uid),
    {
      uid,
      role,
    },
    { merge: true }
  );
}

export async function addUser(data: AppUserFormData): Promise<void> {
  await setDoc(doc(db, COL, data.uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateUser(
  uid: string,
  data: Partial<AppUserFormData>
): Promise<void> {
  await setDoc(
    doc(db, COL, uid),
    {
      uid,
      ...data,
    },
    { merge: true }
  );
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, COL, uid));
}
