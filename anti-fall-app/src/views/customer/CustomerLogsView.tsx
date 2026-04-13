import DashboardLayout from '../../components/layout/DashboardLayout';

const logs = [
  {
    id: 1,
    type: 'Fall Detected',
    date: '12 April 2026',
    time: '08:45 WIB',
    status: 'Warning',
  },
  {
    id: 2,
    type: 'Safe Status',
    date: '11 April 2026',
    time: '17:12 WIB',
    status: 'Normal',
  },
  {
    id: 3,
    type: 'Battery Low',
    date: '10 April 2026',
    time: '09:20 WIB',
    status: 'Low',
  },
];

export default function CustomerLogsView() {
  return (
    <DashboardLayout
      role="customer"
      title="Activity Logs"
      subtitle="Riwayat kejadian yang tercatat oleh device"
    >
      <section style={styles.content}>
        {/* HERO */}
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Logs</p>
            <h2 style={styles.heroTitle}>Riwayat Aktivitas</h2>
            <p style={styles.heroText}>
              Semua aktivitas dan kejadian penting dari device tercatat di sini.
            </p>
          </div>

          <div style={styles.countBadge}>
            {logs.length} Recent Logs
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.sectionTitle}>Logs List</h3>
            <span style={styles.sectionBadge}>April 2026</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Tanggal</th>
                  <th style={styles.th}>Waktu</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={styles.tr}>
                    <td style={styles.td}>{log.type}</td>
                    <td style={styles.td}>{log.date}</td>
                    <td style={styles.td}>{log.time}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(log.status === 'Warning'
                            ? styles.statusDanger
                            : log.status === 'Normal'
                            ? styles.statusSafe
                            : styles.statusWarning),
                        }}
                      >
                        {log.status}
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

  // HERO
  heroCard: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
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
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.8)',
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

  countBadge: {
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    padding: '10px 16px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '14px',
  },

  // TABLE CARD
  tableCard: {
    marginTop: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
  },

  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a',
  },

  sectionBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },

  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: '12px',
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 600,
  },

  tr: {
    borderTop: '1px solid #e2e8f0',
  },

  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#0f172a',
  },

  statusBadge: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },

  statusDanger: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },

  statusSafe: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  statusWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
};