import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Shield, UserCheck, Search, Loader } from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import { AppUser } from '../../types/user';

export default function AdminUsersView() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const totalUsers = users.length;
  const activeUsers = users.length; // all Firestore users are considered active
  const adminCount = users.filter((u) => u.role === 'admin').length;

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
            <span>{loading ? '—' : `${totalUsers} Users`}</span>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}><Users size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Total Users</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : totalUsers}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconGreen}><UserCheck size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Active Users</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : activeUsers}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconBlue}><Shield size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Admin Accounts</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : adminCount}</h3>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Users List</h3>
              <p style={styles.sectionText}>Daftar akun yang terdaftar di sistem.</p>
            </div>

            <div style={styles.searchBox}>
              <Search size={15} color="#94a3b8" />
              <input
                style={styles.searchInput}
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={styles.emptyCell}>
                    <div style={styles.emptyState}><Loader size={24} color="#94a3b8" /></div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={styles.emptyCell}>
                    <div style={styles.emptyState}><p style={styles.emptyText}>Tidak ada pengguna ditemukan.</p></div>
                  </td></tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.uid} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>{user.fullName.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: 700 }}>{user.fullName}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span style={user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeCustomer}>
                          {user.role}
                        </span>
                      </td>
                      <td style={styles.td}>{user.phone ?? '—'}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadgeActive}>Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, display: 'inline-flex', gap: '8px', alignItems: 'center' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center' },
  summaryIcon: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryIconGreen: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryIconBlue: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryLabel: { margin: 0, fontSize: '14px', color: '#64748b' },
  summaryValue: { margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: '#0f172a' },
  tableCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionText: { margin: '6px 0 0', fontSize: '14px', color: '#64748b' },
  searchBox: { display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '42px', backgroundColor: '#f8fafc' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', width: '180px', color: '#0f172a' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '680px' },
  th: { textAlign: 'left', padding: '12px', fontSize: '13px', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px 12px', fontSize: '14px', color: '#0f172a' },
  emptyCell: { padding: '48px 0', textAlign: 'center' },
  emptyState: { display: 'flex', justifyContent: 'center' },
  emptyText: { margin: 0, color: '#94a3b8', fontSize: '15px' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  roleBadgeAdmin: { backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  roleBadgeCustomer: { backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  statusBadgeActive: { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
};