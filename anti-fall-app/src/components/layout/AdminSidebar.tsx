import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties } from 'react';
import {
  LayoutDashboard,
  Users,
  TriangleAlert,
  Megaphone,
  Settings,
  FileBarChart2,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Incidents', href: '/admin/incidents', icon: TriangleAlert },
  { label: 'Broadcasts', href: '/admin/broadcasts', icon: Megaphone },
  { label: 'Reports', href: '/admin/reports', icon: FileBarChart2 },
  // { label: 'Settings', href: '/admin/setting', icon: Settings },
];

type AdminSidebarProps = {
  isMobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function AdminSidebar({
  isMobile = false,
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const router = useRouter();

  return (
    <aside
      style={{
        ...styles.sidebar,
        ...(collapsed ? styles.sidebarCollapsed : {}),
      }}
    >
      {!collapsed && (
        <div style={styles.inner}>
          <div>
            <div style={styles.brandBox}>
              <div style={styles.logo}>A</div>
              <div>
                <p style={styles.brandName}>Anti Fall App</p>
                <p style={styles.brandSubtext}>Admin Panel</p>
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

          <div style={styles.footerBox}>
            <p style={styles.footerTitle}>System Status</p>
            <p style={styles.footerText}>Healthy</p>
            <p style={styles.footerSmall}>All admin services running</p>
          </div>
        </div>
      )}
    </aside>
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
};