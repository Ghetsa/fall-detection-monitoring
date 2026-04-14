import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from '../../lib/auth';
import { User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';
import { useAuth } from '../../hooks/useAuth';

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
  isMobile = false,
  title = 'Customer Dashboard',
  subtitle = 'Monitoring lansia secara real-time',
}: NavbarProps) {
  const router = useRouter();
  const { user: currentUser, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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
      await showSuccessAlert('Logout berhasil');
      void router.push('/');
    } catch (error) {
      console.error('Logout gagal:', error);
      await showErrorAlert('Logout gagal');
    }
  };

  const profile: UserProfile | null = currentUser
    ? {
        fullName: currentUser.displayName || 'User',
        email: currentUser.email || '',
        role: role || 'customer',
        photoURL: currentUser.photoURL || '',
      }
    : null;

  const userName = profile?.fullName || 'User';
  const userEmail = profile?.email || '';
  const userRole = profile?.role || 'customer';

  const profileRoute =
    userRole === 'admin' ? '/admin/profile' : '/customer/profile';

  const photoSrc =
    profile?.photoURL ||
    currentUser?.photoURL ||
    '/images/logo.png';

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
          <div style={styles.titleBox}>
            <h1
              style={{
                ...styles.pageTitle,
                ...(isMobile ? styles.pageTitleMobile : {}),
              }}
            >
              {title}
            </h1>
            {!isMobile && (
              <p
                style={{
                  ...styles.pageSubtitle,
                  ...(isMobile ? styles.pageSubtitleMobile : {}),
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            ...styles.rightSection,
            ...(isMobile ? styles.rightSectionMobile : {}),
          }}
        >
          {currentUser ? (
            <div
              ref={profileMenuRef}
              style={{
                ...styles.profileMenuWrapper,
                ...(isMobile ? styles.profileMenuWrapperMobile : {}),
              }}
            >
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                style={{
                  ...styles.profileButton,
                  ...(isMobile ? styles.profileButtonMobile : {}),
                }}
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

                {!isMobile && (
                  <span style={styles.chevronWrap}>
                    <ChevronDown size={16} />
                  </span>
                )}
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
          ) : (
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
    minHeight: '64px',
    padding: '10px 14px',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    minWidth: 0,
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
    fontSize: '17px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    width: 'auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '8px',
  },
  profileMenuWrapper: {
    position: 'relative',
  },
  profileMenuWrapperMobile: {
    width: 'auto',
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
  profileButtonMobile: {
    minHeight: '44px',
    minWidth: '44px',
    width: '44px',
    padding: '2px',
    borderRadius: '999px',
    justifyContent: 'center',
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
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: '240px',
    maxWidth: 'calc(100vw - 28px)',
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
};
