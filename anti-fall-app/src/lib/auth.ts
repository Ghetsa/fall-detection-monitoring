import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  updateProfile,
  signOut,
} from 'firebase/auth';
import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  role?: 'admin' | 'customer';
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResult = {
  userCredential: any;
  role: 'admin' | 'customer';
  redirectTo: string;
};

export async function registerWithEmail({
  fullName,
  email,
  password,
  role = 'customer',
}: RegisterPayload) {
  let userCredential;

  try {
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName,
    });

    const userRef = doc(db, 'users', user.uid);

    const userData = {
      uid: user.uid,
      fullName,
      email,
      role,
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, userData, { merge: true });

    const savedDoc = await getDoc(userRef);

    if (!savedDoc.exists()) {
      throw new Error('Data user gagal masuk ke Firestore.');
    }

    return userCredential;
  } catch (error) {
    if (userCredential?.user) {
      try {
        await deleteUser(userCredential.user);
      } catch (deleteError) {
        console.error('Gagal rollback user auth:', deleteError);
      }
    }

    console.error('Register error:', error);
    throw error;
  }
}

export async function loginWithEmail({
  email,
  password,
}: LoginPayload): Promise<LoginResult> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  let role: 'admin' | 'customer' = 'customer';

  if (userSnap.exists()) {
    const userData = userSnap.data();
    role = userData.role === 'admin' ? 'admin' : 'customer';
  }

  return {
    userCredential,
    role,
    redirectTo: role === 'admin' ? '/admin/dashboard' : '/customer/dashboard',
  };
}

export async function logoutUser() {
  await signOut(auth);
}