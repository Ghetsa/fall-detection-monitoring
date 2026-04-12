import DashboardLayout from '../../components/layout/DashboardLayout';

export default function CustomerDashboardView() {
  return (
    <DashboardLayout
      role="customer"
      title="Customer Dashboard"
      subtitle="Monitoring lansia secara real-time"
    >
      <section style={styles.content}>
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeContent}>
            <p style={styles.welcomeLabel}>Selamat Datang</p>
            <h2 style={styles.welcomeTitle}>Monitoring Lansia Hari Ini</h2>
            <p style={styles.welcomeText}>
              Pantau kondisi lansia, lokasi terakhir, baterai device, dan
              notifikasi darurat dalam satu dashboard.
            </p>
          </div>

          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            Safe
          </div>
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Status Saat Ini</p>
            <h3 style={styles.cardValue}>Safe</h3>
            <p style={styles.cardDescription}>
              Tidak ada indikasi jatuh yang terdeteksi.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Battery Device</p>
            <h3 style={styles.cardValue}>87%</h3>
            <p style={styles.cardDescription}>
              Kondisi baterai masih cukup untuk digunakan.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Lokasi Terakhir</p>
            <h3 style={styles.cardValue}>Bandar Lampung</h3>
            <p style={styles.cardDescription}>
              Update lokasi diterima 2 menit yang lalu.
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Logs Bulan Ini</p>
            <h3 style={styles.cardValue}>4</h3>
            <p style={styles.cardDescription}>
              Total histori kejadian yang tersimpan.
            </p>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Ringkasan Monitoring</h3>
              <span style={styles.sectionBadge}>Real-time</span>
            </div>

            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nama Lansia</span>
                <span style={styles.summaryValue}>Nenek Siti</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Serial Device</span>
                <span style={styles.summaryValue}>ESP32-001</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Last Update</span>
                <span style={styles.summaryValue}>10:24 WIB</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Emergency Contact</span>
                <span style={styles.summaryValue}>0812-3456-7890</span>
              </div>
            </div>
          </div>

          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Riwayat Terbaru</h3>
              <span style={styles.sectionBadgeAlt}>Logs</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Fall Detected</p>
                <p style={styles.logTime}>12 April 2026 • 08:45</p>
              </div>
              <span style={styles.logStatusDanger}>Warning</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Safe Status</p>
                <p style={styles.logTime}>11 April 2026 • 17:12</p>
              </div>
              <span style={styles.logStatusSafe}>Normal</span>
            </div>

            <div style={styles.logItem}>
              <div>
                <p style={styles.logTitle}>Battery Low</p>
                <p style={styles.logTime}>10 April 2026 • 09:20</p>
              </div>
              <span style={styles.logStatusWarning}>Low</span>
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
  welcomeCard: {
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
  welcomeContent: {
    flex: 1,
    minWidth: 0,
  },
  welcomeLabel: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeTitle: {
    margin: '8px 0 10px',
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 1.2,
  },
  welcomeText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.92)',
    maxWidth: '700px',
  },
  statusPill: {
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
  statusDot: {
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