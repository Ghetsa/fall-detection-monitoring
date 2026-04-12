import Link from 'next/link';
import { useEffect, useState, CSSProperties } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { logoutUser } from '../../lib/auth';

type UserProfile = {
  fullName?: string;
  email?: string;
  role?: string;
};

type NavbarProps = {
  collapsed?: boolean;
  isMobile?: boolean;
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
};

export default function Navbar({
  collapsed = false,
  isMobile = false,
  onToggleSidebar,
  title = 'Customer Dashboard',
  subtitle = 'Monitoring lansia secara real-time',
}: NavbarProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          setProfile({
            fullName: user.displayName || 'User',
            email: user.email || '',
            role: 'customer',
          });
        }
      } catch (error) {
        console.error('Gagal mengambil profile user:', error);
        setProfile({
          fullName: user.displayName || 'User',
          email: user.email || '',
          role: 'customer',
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert('Logout berhasil');
    } catch (error) {
      console.error('Logout gagal:', error);
      alert('Logout gagal');
    }
  };

  return (
    <header
      style={{
        ...styles.wrapper,
        ...(isMobile ? styles.wrapperMobile : {}),
      }}
    >
      <div
        style={{
          ...styles.inner,
          ...(isMobile ? styles.innerMobile : {}),
        }}
      >
        <div
          style={{
            ...styles.leftSection,
            ...(isMobile ? styles.leftSectionMobile : {}),
          }}
        >
          <button
            onClick={onToggleSidebar}
            style={{
              ...styles.menuButton,
              ...(isMobile ? styles.menuButtonMobile : {}),
            }}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div style={styles.titleBox}>
            <h1
              style={{
                ...styles.pageTitle,
                ...(isMobile ? styles.pageTitleMobile : {}),
              }}
            >
              {title}
            </h1>
            <p
              style={{
                ...styles.pageSubtitle,
                ...(isMobile ? styles.pageSubtitleMobile : {}),
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div
          style={{
            ...styles.rightSection,
            ...(isMobile ? styles.rightSectionMobile : {}),
          }}
        >
          {!loading && currentUser ? (
            <>
              <div
                style={{
                  ...styles.userBox,
                  ...(isMobile ? styles.userBoxMobile : {}),
                }}
              >
                <span style={styles.userName}>
                  {profile?.fullName || currentUser.displayName || 'User'}
                </span>
                <span style={styles.userMeta}>
                  {profile?.email || currentUser.email}
                  {profile?.role ? ` • ${profile.role}` : ''}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  ...styles.logoutButton,
                  ...(isMobile ? styles.logoutButtonMobile : {}),
                }}
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/auth/login"
                style={{
                  ...styles.loginButton,
                  ...(isMobile ? styles.authButtonMobile : {}),
                }}
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                style={{
                  ...styles.registerButton,
                  ...(isMobile ? styles.authButtonMobile : {}),
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <span style={styles.loadingText}>Loading...</span>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 90,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  wrapperMobile: {
    top: 0,
  },
  inner: {
    minHeight: '76px',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  innerMobile: {
    minHeight: 'unset',
    padding: '12px 14px',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: '12px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
    flex: 1,
  },
  leftSectionMobile: {
    width: '100%',
    alignItems: 'flex-start',
  },
  menuButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a',
    flexShrink: 0,
  },
  menuButtonMobile: {
    width: '42px',
    height: '42px',
    fontSize: '16px',
  },
  titleBox: {
    minWidth: 0,
    flex: 1,
  },
  pageTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1.2,
  },
  pageTitleMobile: {
    fontSize: '18px',
  },
  pageSubtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#64748b',
    lineHeight: 1.5,
  },
  pageSubtitleMobile: {
    fontSize: '13px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    flexWrap: 'nowrap',
    flexShrink: 0,
  },
  rightSectionMobile: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: '10px',
  },
  userBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 12px',
    borderRadius: '12px',
    minWidth: '220px',
    maxWidth: '280px',
  },
  userBoxMobile: {
    width: '100%',
    minWidth: '0',
    maxWidth: '100%',
    alignItems: 'flex-start',
    padding: '10px 12px',
  },
  userName: {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  userMeta: {
    color: '#64748b',
    fontSize: '12px',
    marginTop: '4px',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  logoutButton: {
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  logoutButtonMobile: {
    width: '100%',
    textAlign: 'center',
    padding: '12px 16px',
  },
  loginButton: {
    textDecoration: 'none',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    backgroundColor: '#eff6ff',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  registerButton: {
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  authButtonMobile: {
    width: '100%',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },
};