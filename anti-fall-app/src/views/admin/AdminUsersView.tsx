import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Shield, UserCheck, Search } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Cempaka',
    email: 'cempaka@gmail.com',
    role: 'customer',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Lilisya',
    email: 'lilisya@gmail.com',
    role: 'admin',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi@gmail.com',
    role: 'customer',
    status: 'Blocked',
  },
];

export default function AdminUsersView() {
  return (
    <DashboardLayout
      role="admin"
      title="User Management"
      subtitle="Kelola data pengguna dan hak akses"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Users</p>
            <h2 style={styles.heroTitle}>Manajemen Pengguna</h2>
            <p style={styles.heroText}>
              Lihat daftar pengguna, peran akun, dan status akses sistem.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <Users size={18} />
            <span>{users.length} Users</span>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>
              <Users size={18} />
            </span>
            <div>
              <p style={styles.summaryLabel}>Total Users</p>
              <h3 style={styles.summaryValue}>120</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconGreen}>
              <UserCheck size={18} />
            </span>
            <div>
              <p style={styles.summaryLabel}>Active Users</p>
              <h3 style={styles.summaryValue}>110</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconBlue}>
              <Shield size={18} />
            </span>
            <div>
              <p style={styles.summaryLabel}>Admin Accounts</p>
              <h3 style={styles.summaryValue}>2</h3>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Users List</h3>
              <p style={styles.sectionText}>
                Daftar akun yang terdaftar di sistem.
              </p>
            </div>

            <div style={styles.searchBox}>
              <Search size={16} />
              <span>Cari user</span>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          user.role === 'admin'
                            ? styles.roleBadgeAdmin
                            : styles.roleBadgeCustomer
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          user.status === 'Active'
                            ? styles.statusBadgeActive
                            : styles.statusBadgeBlocked
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    padding: '5px',
    minWidth: 0,
  },
  heroCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
    color: '#fff',
    borderRadius: '24px',
    padding: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  heroLabel: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.08em',
  },
  heroTitle: {
    margin: '8px 0 10px',
    fontSize: '32px',
    fontWeight: 800,
  },
  heroText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.92)',
  },
  heroBadge: {
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 800,
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '22px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  summaryIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconGreen: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconBlue: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  summaryValue: {
    margin: '6px 0 0',
    fontSize: '28px',
    fontWeight: 800,
    color: '#0f172a',
  },
  tableCard: {
    marginTop: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
  },
  sectionText: {
    margin: '6px 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  searchBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '680px',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 700,
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '14px 12px',
    fontSize: '14px',
    color: '#0f172a',
  },
  roleBadgeAdmin: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  roleBadgeCustomer: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  statusBadgeActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  statusBadgeBlocked: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
};