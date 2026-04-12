import DashboardLayout from '../../components/layout/DashboardLayout';
import ReportSummaryCard from '../../components/cards/ReportSummaryCard';
import ReportsTable from '../../components/tables/ReportsTable';
import { getReports, getReportSummary } from '../../services/reportService';

export default function AdminReportsView() {
  const summary = getReportSummary();
  const reports = getReports();

  return (
    <DashboardLayout>
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Reports Center</p>
            <h2 style={styles.heroTitle}>Admin Reports</h2>
            <p style={styles.heroText}>
              Lihat ringkasan laporan sistem, laporan insiden, perangkat aktif,
              dan data user secara terpusat.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Reports Ready
          </div>
        </div>

        <div style={styles.cardGrid}>
          <ReportSummaryCard
            title="Total Users"
            value={summary.totalUsers}
            description="Jumlah seluruh user yang terdaftar."
          />

          <ReportSummaryCard
            title="Total Devices"
            value={summary.totalDevices}
            description="Jumlah seluruh device yang tercatat."
          />

          <ReportSummaryCard
            title="Active Devices"
            value={summary.activeDevices}
            description="Device yang sedang online dan aktif."
            valueColor="#166534"
          />

          <ReportSummaryCard
            title="Total Incidents"
            value={summary.totalIncidents}
            description="Jumlah semua kejadian yang tercatat."
            valueColor="#b91c1c"
          />

          <ReportSummaryCard
            title="Monthly Reports"
            value={summary.monthlyReports}
            description="Total laporan yang dihasilkan bulan ini."
            valueColor="#1d4ed8"
          />
        </div>

        <div style={styles.tableSection}>
          <ReportsTable reports={reports} />
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
  tableSection: {
    marginTop: '24px',
  },
};