import DashboardLayout from '../../components/layout/DashboardLayout';
import { TriangleAlert, ShieldAlert, Clock3, Filter } from 'lucide-react';

const incidents = [
  {
    id: 1,
    event: 'Fall Detected',
    user: 'Nenek Siti',
    device: 'ESP32-001',
    time: '12 April 2026 • 08:45',
    level: 'High',
  },
  {
    id: 2,
    event: 'Battery Low',
    user: 'Pak Budi',
    device: 'ESP32-002',
    time: '11 April 2026 • 17:12',
    level: 'Medium',
  },
  {
    id: 3,
    event: 'No Movement Alert',
    user: 'Ibu Lina',
    device: 'ESP32-003',
    time: '10 April 2026 • 09:20',
    level: 'Low',
  },
];

export default function AdminIncidentsView() {
  return (
    <DashboardLayout
      role="admin"
      title="Incident Reports"
      subtitle="Riwayat kejadian dari seluruh perangkat"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Incidents</p>
            <h2 style={styles.heroTitle}>Laporan Kejadian</h2>
            <p style={styles.heroText}>
              Pantau semua kejadian penting dari seluruh pengguna dan perangkat.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <TriangleAlert size={18} />
            <span>{incidents.length} Reports</span>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIconDanger}>
              <ShieldAlert size={18} />
            </span>
            <div>
              <p style={styles.summaryLabel}>High Alerts</p>
              <h3 style={styles.summaryValue}>2</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconWarning}>
              <Clock3 size={18} />
            </span>
            <div>
              <p style={styles.summaryLabel}>Pending Review</p>
              <h3 style={styles.summaryValue}>3</h3>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Incident List</h3>
              <p style={styles.sectionText}>
                Data kejadian yang tercatat dari seluruh user.
              </p>
            </div>

            <div style={styles.filterBox}>
              <Filter size={16} />
              <span>Filter</span>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Device</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Level</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} style={styles.tr}>
                    <td style={styles.td}>{incident.event}</td>
                    <td style={styles.td}>{incident.user}</td>
                    <td style={styles.td}>{incident.device}</td>
                    <td style={styles.td}>{incident.time}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          incident.level === 'High'
                            ? styles.levelDanger
                            : incident.level === 'Medium'
                            ? styles.levelWarning
                            : styles.levelLow
                        }
                      >
                        {incident.level}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
  summaryIconDanger: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconWarning: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
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
  filterBox: {
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
    minWidth: '760px',
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
  levelDanger: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  levelWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  levelLow: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
};