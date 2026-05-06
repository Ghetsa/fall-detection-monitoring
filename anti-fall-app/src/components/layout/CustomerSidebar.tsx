import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties } from 'react';

import {
  LayoutDashboard,
  MapPin,
  FileText,
  Siren,
  Bell,
  Users,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { label: 'Kelola Lansia', href: '/customer/lansia', icon: Users },
  { label: 'Tracking', href: '/customer/tracking', icon: MapPin },
  { label: 'History', href: '/customer/logs', icon: FileText },
  { label: 'Emergency Contacts', href: '/customer/emergency', icon: Siren },
  { label: 'Notifications', href: '/customer/notifications', icon: Bell },
];

type CustomerSidebarProps = {
  isMobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function CustomerSidebar({
  isMobile = false,
  collapsed = false,
}: CustomerSidebarProps) {
  const router = useRouter();

  if (isMobile) {
    return (
      <nav style={styles.mobileNav}>
        {menuItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.mobileLink,
                ...(isActive ? styles.mobileLinkActive : {}),
              }}
            >
              <Icon size={18} strokeWidth={2} />
              <span style={styles.mobileLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <aside
        style={{
          ...styles.sidebar,
          ...(collapsed ? styles.sidebarCollapsed : {}),
        }}
      >
        {!collapsed && (
          <div style={styles.inner}>
            {/* Top section */}
            <div>
              <div style={styles.brandBox}>
                <div style={styles.logo}>A</div>
                <div>
                  <p style={styles.brandName}>Anti Fall App</p>
                  <p style={styles.brandSubtext}>Customer Panel</p>
                </div>
              </div>

              <nav style={styles.nav}>
                {menuItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        ...styles.link,
                        ...(isActive ? styles.activeLink : {}),
                      }}
                    >

                      <span style={styles.icon}>
                        <Icon size={18} strokeWidth={2} />
                      </span>

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)',
    color: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    transition: 'all 0.25s ease',
    overflow: 'hidden',
  },

  sidebarCollapsed: {
    width: '0',
    padding: '0',
  },

  inner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 14px',
  },

  brandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },

  logo: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
  },

  brandName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
  },

  brandSubtext: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  link: {
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.9)',
    padding: '14px 16px',
    borderRadius: '14px',
    fontWeight: 600,
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: '0.2s ease',
  },

  activeLink: {
    backgroundColor: '#ffffff',
    color: '#1e3a8a',
  },

  icon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconImage: {
    width: '18px',
    height: '18px',
    objectFit: 'contain',
    filter: 'invert(1)', // bikin putih di background gelap
    opacity: 0.9,
  },

  footerBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: '16px',
    borderRadius: '16px',
  },

  footerTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
  },

  footerText: {
    margin: '8px 0 4px',
    fontSize: '22px',
    fontWeight: 800,
  },

  footerSmall: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255,255,255,0.82)',
  },
  mobileNav: {
    position: 'fixed',
    left: '12px',
    right: '12px',
    bottom: 'max(12px, env(safe-area-inset-bottom))',
    zIndex: 110,
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: '8px',
    padding: '10px 10px calc(10px + env(safe-area-inset-bottom))',
    backgroundColor: 'rgba(255,255,255,0.96)',
    border: '1px solid #e2e8f0',
    borderRadius: '22px',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.16)',
    backdropFilter: 'blur(14px)',
  },
  mobileLink: {
    textDecoration: 'none',
    color: '#64748b',
    minHeight: '58px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: 700,
    textAlign: 'center',
    padding: '6px 4px',
  },
  mobileLinkActive: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  mobileLabel: {
    lineHeight: 1.1,
  },
};
