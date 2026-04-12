import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminDashboardView() {
  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Monitoring sistem dan aktivitas pengguna"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Admin Panel</p>
            <h2 style={styles.heroTitle}>Admin Dashboard</h2>
            <p style={styles.heroText}>
              Monitoring sistem, perangkat aktif, data pengguna, dan kejadian
              insiden secara global dalam satu dashboard.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            System Healthy
          </div>
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Users</p>
            <h3 style={styles.cardValue}>120</h3>
            <p style={styles.cardDescription}>
              Total seluruh pengguna yang sudah terdaftar di sistem.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Devices Online</p>
            <h3 style={styles.cardValue}>87</h3>
            <p style={styles.cardDescription}>
              Jumlah perangkat yang aktif dan mengirim data saat ini.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Incidents Today</p>
            <h3 style={styles.cardValue}>5</h3>
            <p style={styles.cardDescription}>
              Total kejadian terdeteksi pada hari ini.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>System Status</p>
            <h3 style={{ ...styles.cardValue, color: '#16a34a' }}>Healthy</h3>
            <p style={styles.cardDescription}>
              API, database, dan layanan utama berjalan normal.
            </p>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Incidents</h3>
              <span style={styles.sectionBadge}>Today</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Fall Detected</p>
                <p style={styles.logTime}>User: Nenek Siti • 10:32 WIB</p>
              </div>
              <span style={styles.logStatusDanger}>High</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Battery Low</p>
                <p style={styles.logTime}>User: Pak Budi • 09:10 WIB</p>
              </div>
              <span style={styles.logStatusWarning}>Medium</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Safe Status</p>
                <p style={styles.logTime}>User: Ibu Lina • 08:00 WIB</p>
              </div>
              <span style={styles.logStatusSafe}>Normal</span>
            </div>
          </div>

          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>System Overview</h3>
              <span style={styles.sectionBadgeAlt}>Live</span>
            </div>

            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>API Status</span>
                <span style={styles.summaryValueSuccess}>Online</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Database</span>
                <span style={styles.summaryValueSuccess}>Connected</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Cloud</span>
                <span style={styles.summaryValueSuccess}>Running</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Last Deployment</span>
                <span style={styles.summaryValue}>Today 08:00</span>
              </div>
            </div>
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
    color: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },

  heroContent: {
    flex: 1,
    minWidth: 0,
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
    lineHeight: 1.2,
  },

  heroText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.92)',
    maxWidth: '760px',
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    color: '#166534',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 800,
    fontSize: '15px',
  },

  heroBadgeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
  },

  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '22px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    minWidth: 0,
  },

  cardLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 600,
  },

  cardValue: {
    margin: '12px 0 10px',
    fontSize: '30px',
    fontWeight: 800,
    color: '#0f172a',
    wordBreak: 'break-word',
  },

  cardDescription: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#475569',
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
    marginTop: '24px',
  },

  largeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    minWidth: 0,
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    flexWrap: 'wrap',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '22px',
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

  sectionBadgeAlt: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },

  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
  },

  summaryLabel: {
    color: '#64748b',
    fontSize: '14px',
  },

  summaryValue: {
    color: '#0f172a',
    fontSize: '15px',
    fontWeight: 700,
    wordBreak: 'break-word',
  },

  summaryValueSuccess: {
    color: '#166534',
    backgroundColor: '#dcfce7',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },

  logItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
  },

  logTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },

  logTime: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#64748b',
  },

  logStatusDanger: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },

  logStatusSafe: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },

  logStatusWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
};