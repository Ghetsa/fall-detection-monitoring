import { useState, useEffect } from 'react';
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

export function useAuth(): UseAuthReturn {
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

  return { user, role, loading };
}
