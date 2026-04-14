import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

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
  userCredential: UserCredential;
  role: 'admin' | 'customer';
  redirectTo: string;
};

function setAuthCookies(role: 'admin' | 'customer') {
  if (typeof document === 'undefined') return;

  const maxAge = 60 * 60 * 8;
  document.cookie = `anti_fall_session=active; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  document.cookie = `anti_fall_role=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === 'undefined') return;

  document.cookie = 'anti_fall_session=; Path=/; Max-Age=0; SameSite=Lax';
  document.cookie = 'anti_fall_role=; Path=/; Max-Age=0; SameSite=Lax';
}

async function getUserRoleAndEnsureProfile(
  uid: string,
  fallback: {
    fullName?: string | null;
    email?: string | null;
    role?: 'admin' | 'customer';
  } = {}
) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();

    return userData.role === 'admin' ? 'admin' : 'customer';
  }

  const role = fallback.role === 'admin' ? 'admin' : 'customer';

  await setDoc(
    userRef,
    {
      uid,
      fullName: fallback.fullName || 'User Google',
      email: fallback.email || '',
      role,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return role;
}

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
  const role = await getUserRoleAndEnsureProfile(user.uid, {
    fullName: user.displayName,
    email: user.email,
    role: 'customer',
  });

  setAuthCookies(role);

  return {
    userCredential,
    role,
    redirectTo: role === 'admin' ? '/admin/dashboard' : '/customer/dashboard',
  };
}

export async function loginWithGoogle(): Promise<LoginResult> {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const role = await getUserRoleAndEnsureProfile(user.uid, {
    fullName: user.displayName,
    email: user.email,
    role: 'customer',
  });

  setAuthCookies(role);

  return {
    userCredential,
    role,
    redirectTo: role === 'admin' ? '/admin/dashboard' : '/customer/dashboard',
  };
}

export async function logoutUser() {
  await signOut(auth);
  clearAuthCookies();
}
