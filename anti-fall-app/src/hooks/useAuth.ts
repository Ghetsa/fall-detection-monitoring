import {
  createElement,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { auth, db } from '../lib/firebase';

type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: 'admin' | 'customer';
};

type UseAuthReturn = {
  user: AuthUser | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
};

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null);
  const [firebaseRole, setFirebaseRole] = useState<'admin' | 'customer' | null>(
    null
  );
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          const userData = snap.data();
          const userRole: 'admin' | 'customer' =
            userData?.role === 'admin' ? 'admin' : 'customer';
          setFirebaseRole(userRole);
          setFirebaseUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: userRole,
          });
        } catch {
          setFirebaseUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: 'customer',
          });
          setFirebaseRole('customer');
        }
      } else {
        setFirebaseUser(null);
        setFirebaseRole(null);
      }
      setFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loading = firebaseLoading || status === 'loading';
  const sessionRole =
    session?.user?.role === 'admin' ? 'admin' : session?.user ? 'customer' : null;
  const sessionUser: AuthUser | null =
    status === 'authenticated' && session.user?.email
      ? {
          uid: session.user.uid || session.user.email.toLowerCase(),
          displayName: session.user.fullname || session.user.name || 'User',
          email: session.user.email,
          photoURL: session.user.image || null,
          role: sessionRole || 'customer',
        }
      : null;
  const user = firebaseUser || sessionUser;
  const role = firebaseRole || sessionRole;

  const value = useMemo(
    () => ({ user, role, loading }),
    [loading, role, user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
