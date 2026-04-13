import { ReactNode, useEffect, useState, CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { Loader } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import CustomerSidebar from './CustomerSidebar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';

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
  const router = useRouter();
  const { user, role: userRole, loading: authLoading } = useAuth();
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

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      void router.replace('/auth/login');
      return;
    }

    if (userRole && userRole !== role) {
      const redirectPath =
        userRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
      void router.replace(redirectPath);
    }
  }, [authLoading, user, userRole, role, router]);

  const sidebarWidth = !isMobile && !collapsed ? 260 : 0;

  const pageTitle =
    title || (role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard');

  const pageSubtitle =
    subtitle ||
    (role === 'admin'
      ? 'Monitoring sistem dan aktivitas pengguna'
      : 'Monitoring lansia secara real-time');

  if (authLoading || !user || (userRole !== null && userRole !== role)) {
    return (
      <div style={styles.guardPage}>
        <div style={styles.guardCard}>
          <Loader size={28} color="#2563eb" />
          <p style={styles.guardText}>Memverifikasi akses halaman...</p>
        </div>
      </div>
    );
  }

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
  guardPage: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  guardCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    padding: '24px 28px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  guardText: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
};
