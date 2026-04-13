import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getIncidentsByCustomer } from '../../services/incidentService';
import { Incident } from '../../types/incident';

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const date: Date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const typeLabels: Record<string, string> = {
  fall_detected: 'Fall Detected',
  battery_low: 'Battery Low',
  safe: 'Safe Status',
  sos: 'SOS Button',
  device_offline: 'Device Offline',
};

const statusLabel = (sev: string) => {
  if (sev === 'danger') return 'Warning';
  if (sev === 'warning') return 'Low';
  return 'Normal';
};

export default function CustomerLogsView() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getIncidentsByCustomer(user.uid);
        setLogs(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <DashboardLayout
      role="customer"
      title="Activity Logs"
      subtitle="Riwayat kejadian yang tercatat oleh device"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Logs</p>
            <h2 style={styles.heroTitle}>Riwayat Aktivitas</h2>
            <p style={styles.heroText}>
              Semua aktivitas dan kejadian penting dari device tercatat di sini.
            </p>
          </div>

          <div style={styles.countBadge}>
            {loading ? '—' : `${logs.length} Recent Logs`}
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.sectionTitle}>Logs List</h3>
            <span style={styles.sectionBadge}>
              {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Tanggal & Waktu</th>
                  <th style={styles.th}>Lokasi</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={styles.emptyCell}>
                      <div style={styles.loadingBox}><Loader size={24} color="#94a3b8" /></div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={styles.emptyCell}>
                      <p style={styles.emptyText}>Belum ada riwayat aktivitas.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={styles.tr}>
                      <td style={styles.td}>{typeLabels[log.type] ?? log.type}</td>
                      <td style={styles.td}>{formatTimestamp(log.timestamp)}</td>
                      <td style={styles.td}>{log.location ?? '—'}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(log.severity === 'danger'
                              ? styles.statusDanger
                              : log.severity === 'normal'
                              ? styles.statusSafe
                              : styles.statusWarning),
                          }}
                        >
                          {statusLabel(log.severity)}
                        </span>
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
  heroCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  countBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '10px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '14px' },
  tableCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' },
  sectionTitle: { margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  sectionBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  th: { textAlign: 'left', padding: '12px', fontSize: '14px', color: '#64748b', fontWeight: 600 },
  tr: { borderTop: '1px solid #e2e8f0' },
  td: { padding: '12px', fontSize: '14px', color: '#0f172a' },
  emptyCell: { padding: '48px 0', textAlign: 'center' },
  loadingBox: { display: 'flex', justifyContent: 'center' },
  emptyText: { margin: 0, fontSize: '15px', color: '#94a3b8', fontWeight: 600 },
  statusBadge: { padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  statusDanger: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  statusSafe: { backgroundColor: '#dcfce7', color: '#166534' },
  statusWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
};