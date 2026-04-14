import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllUsers } from '../../services/userService';
import { getAllDevices } from '../../services/deviceService';
import { getRecentIncidents, getTodayIncidents } from '../../services/incidentService';
import { Incident } from '../../types/incident';
import { Loader } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—';
  const value = ts as { toDate?: () => Date } | string | number | Date;
  const date: Date =
    typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function'
      ? value.toDate()
      : new Date(value as string | number | Date);
  return date.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminDashboardView() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({ totalUsers: 0, devicesOnline: 0, incidentsToday: 0 });
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [users, devices, todayInc, recentInc] = await Promise.all([
          getAllUsers(),
          getAllDevices(),
          getTodayIncidents(),
          getRecentIncidents(3),
        ]);
        setStats({
          totalUsers: users.length,
          devicesOnline: devices.filter((d) => d.isOnline).length,
          incidentsToday: todayInc.length,
        });
        setRecentIncidents(recentInc);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const severityStyle = (sev: string) => {
    if (sev === 'danger') return styles.logStatusDanger;
    if (sev === 'warning') return styles.logStatusWarning;
    return styles.logStatusSafe;
  };
  const severityLabel = (sev: string) => {
    if (sev === 'danger') return 'High';
    if (sev === 'warning') return 'Medium';
    return 'Normal';
  };

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Monitoring sistem dan aktivitas pengguna"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Admin Panel</p>
            <h2 style={styles.heroTitle}>Admin Dashboard</h2>
            <p style={styles.heroText}>
              Monitoring sistem, perangkat aktif, data pengguna, dan kejadian
              insiden secara global dalam satu dashboard.
            </p>
          </div>

          <div style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
            <span style={styles.heroBadgeDot} />
            System Healthy
          </div>
        </div>

        <div style={{ ...styles.cardGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Users</p>
            <h3 style={styles.cardValue}>{loading ? '—' : stats.totalUsers}</h3>
            <p style={styles.cardDescription}>Total seluruh pengguna yang terdaftar di sistem.</p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Devices Online</p>
            <h3 style={styles.cardValue}>{loading ? '—' : stats.devicesOnline}</h3>
            <p style={styles.cardDescription}>Jumlah perangkat yang aktif dan mengirim data saat ini.</p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Incidents Today</p>
            <h3 style={styles.cardValue}>{loading ? '—' : stats.incidentsToday}</h3>
            <p style={styles.cardDescription}>Total kejadian terdeteksi pada hari ini.</p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>System Status</p>
            <h3 style={{ ...styles.cardValue, color: '#16a34a' }}>Healthy</h3>
            <p style={styles.cardDescription}>API, database, dan layanan utama berjalan normal.</p>
          </div>
        </div>

        <div style={{ ...styles.bottomGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Incidents</h3>
              <span style={styles.sectionBadge}>Today</span>
            </div>

            {loading ? (
              <div style={styles.loadingBox}><Loader size={20} color="#94a3b8" /></div>
            ) : recentIncidents.length === 0 ? (
              <p style={styles.emptyText}>Tidak ada insiden hari ini.</p>
            ) : (
              recentIncidents.map((inc) => (
                <div key={inc.id} style={styles.logItem}>
                  <div>
                    <p style={styles.logTitle}>{inc.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                    <p style={styles.logTime}>{`Device: ${inc.deviceId} • ${formatTimestamp(inc.timestamp)}`}</p>
                  </div>
                  <span style={severityStyle(inc.severity)}>{severityLabel(inc.severity)}</span>
                </div>
              ))
            )}
          </div>

          <div style={styles.largeCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>System Overview</h3>
              <span style={styles.sectionBadgeAlt}>Live</span>
            </div>

            <div style={styles.summaryList}>
              {[
                { label: 'API Status', value: 'Online', success: true },
                { label: 'Database', value: 'Connected', success: true },
                { label: 'Cloud', value: 'Running', success: true },
                { label: 'Total Devices', value: loading ? '—' : `${stats.devicesOnline} Online`, success: false },
              ].map(({ label, value, success }) => (
                <div key={label} style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>{label}</span>
                  <span style={success ? styles.summaryValueSuccess : styles.summaryValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroContent: { flex: 1, minWidth: 0 },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', maxWidth: '760px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', color: '#166534', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, fontSize: '15px' },
  heroBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  heroBadgeDot: { width: '10px', height: '10px', borderRadius: '999px', backgroundColor: '#22c55e' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', minWidth: 0 },
  cardLabel: { margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 600 },
  cardValue: { margin: '12px 0 10px', fontSize: '30px', fontWeight: 800, color: '#0f172a', wordBreak: 'break-word' },
  cardDescription: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#475569' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  largeCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', minWidth: 0 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  sectionBadgeAlt: { backgroundColor: '#f1f5f9', color: '#334155', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  summaryList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', gap: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  summaryLabel: { color: '#64748b', fontSize: '14px' },
  summaryValue: { color: '#0f172a', fontSize: '15px', fontWeight: 700, wordBreak: 'break-word' },
  summaryValueSuccess: { color: '#166534', backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  logTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  logTime: { margin: '6px 0 0', fontSize: '13px', color: '#64748b' },
  logStatusDanger: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' },
  logStatusSafe: { backgroundColor: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' },
  logStatusWarning: { backgroundColor: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '24px 0' },
  emptyText: { margin: 0, fontSize: '14px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' },
};
