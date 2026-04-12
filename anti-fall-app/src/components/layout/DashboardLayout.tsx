import { ReactNode, useEffect, useState, CSSProperties } from 'react';
import Navbar from '../../components/common/Navbar';
import CustomerSidebar from './CustomerSidebar';
import AdminSidebar from './AdminSidebar';

type DashboardRole = 'customer' | 'admin';

type DashboardLayoutProps = {
  children: ReactNode;
  role?: DashboardRole;
  title?: string;
  subtitle?: string;
};

export default function DashboardLayout({
  children,
  role = 'customer',
  title,
  subtitle,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = !isMobile && !collapsed ? 260 : 0;

  const pageTitle =
    title || (role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard');

  const pageSubtitle =
    subtitle ||
    (role === 'admin'
      ? 'Monitoring sistem dan aktivitas pengguna'
      : 'Monitoring lansia secara real-time');

  return (
    <div style={styles.page}>
      {role === 'admin' ? (
        <AdminSidebar
          collapsed={collapsed}
          isMobile={isMobile}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      ) : (
        <CustomerSidebar
          collapsed={collapsed}
          isMobile={isMobile}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      )}

      {isMobile && !collapsed && (
        <div style={styles.backdrop} onClick={() => setCollapsed(true)} />
      )}

      <div
        style={{
          ...styles.mainArea,
          marginLeft: sidebarWidth,
        }}
      >
        <Navbar
          collapsed={collapsed}
          isMobile={isMobile}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          title={pageTitle}
          subtitle={pageSubtitle}
        />

        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  mainArea: {
    minHeight: '100vh',
    transition: 'margin-left 0.25s ease',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    padding: '24px',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    zIndex: 99,
  },
};