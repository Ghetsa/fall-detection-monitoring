import {
  createElement,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type AuthUser = User & {
  role?: 'admin' | 'customer';
};

type UseAuthReturn = {
  user: AuthUser | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
};

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role from Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          const userData = snap.data();
          const userRole: 'admin' | 'customer' =
            userData?.role === 'admin' ? 'admin' : 'customer';
          setRole(userRole);
          const enriched = Object.assign(firebaseUser, { role: userRole });
          setUser(enriched);
        } catch {
          setUser(firebaseUser);
          setRole('customer');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user, role, loading }),
    [user, role, loading]
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
