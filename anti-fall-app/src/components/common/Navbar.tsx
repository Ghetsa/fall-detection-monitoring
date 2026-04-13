import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, CSSProperties } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { logoutUser } from '../../lib/auth';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';

type UserProfile = {
  fullName?: string;
  email?: string;
  role?: string;
  photoURL?: string;
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
  const [menuOpen, setMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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
            photoURL: user.photoURL || '',
          });
        }
      } catch (error) {
        console.error('Gagal mengambil profile user:', error);
        setProfile({
          fullName: user.displayName || 'User',
          email: user.email || '',
          role: 'customer',
          photoURL: user.photoURL || '',
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMenuOpen(false);
      alert('Logout berhasil');
    } catch (error) {
      console.error('Logout gagal:', error);
      alert('Logout gagal');
    }
  };

  const userName = profile?.fullName || currentUser?.displayName || 'User';
  const userEmail = profile?.email || currentUser?.email || '';
  const userRole = profile?.role || 'customer';

  const profileRoute =
    userRole === 'admin' ? '/admin/profile' : '/customer/profile';

  const photoSrc =
    profile?.photoURL ||
    currentUser?.photoURL ||
    '/images/logo-kuceng.png';

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
          <button onClick={onToggleSidebar} style={styles.menuButton}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
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
            <div
              ref={profileMenuRef}
              style={{
                ...styles.profileMenuWrapper,
                ...(isMobile ? styles.profileMenuWrapperMobile : {}),
              }}
            >
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                style={styles.profileButton}
                aria-label="Open profile menu"
              >
                <span style={styles.profileImageWrap}>
                  <Image
                    src={photoSrc}
                    alt={userName}
                    width={40}
                    height={40}
                    style={styles.profileImage}
                  />
                </span>

                {!isMobile && (
                  <span style={styles.profileInfo}>
                    <span style={styles.profileName}>{userName}</span>
                    <span style={styles.profileMeta}>
                      {userRole} • {userEmail}
                    </span>
                  </span>
                )}

                <span style={styles.chevronWrap}>
                  <ChevronDown size={16} />
                </span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    ...styles.dropdown,
                    ...(isMobile ? styles.dropdownMobile : {}),
                  }}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownAvatar}>
                      <Image
                        src={photoSrc}
                        alt={userName}
                        width={36}
                        height={36}
                        style={styles.dropdownAvatarImage}
                      />
                    </span>

                    <div style={styles.dropdownUserInfo}>
                      <p style={styles.dropdownName}>{userName}</p>
                      <p style={styles.dropdownEmail}>{userEmail}</p>
                    </div>
                  </div>

                  <Link
                    href={profileRoute}
                    style={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserIcon size={16} />
                    <span>Halaman Profil</span>
                  </Link>

                  <button onClick={handleLogout} style={styles.dropdownLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
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
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
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
    position: 'relative',
  },
  rightSectionMobile: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: '10px',
  },
  profileMenuWrapper: {
    position: 'relative',
  },
  profileMenuWrapperMobile: {
    width: '100%',
  },
  profileButton: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '6px 10px 6px 6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    minHeight: '52px',
  },
  profileImageWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
    maxWidth: '220px',
  },
  profileName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileMeta: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  chevronWrap: {
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: '260px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
    padding: '10px',
    zIndex: 120,
  },
  dropdownMobile: {
    position: 'static',
    width: '100%',
    marginTop: '10px',
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '8px',
  },
  dropdownAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  dropdownUserInfo: {
    minWidth: 0,
  },
  dropdownName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.2,
  },
  dropdownEmail: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#64748b',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#ffffff',
  },
  dropdownLogout: {
    width: '100%',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#fff1f2',
    color: '#be123c',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
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