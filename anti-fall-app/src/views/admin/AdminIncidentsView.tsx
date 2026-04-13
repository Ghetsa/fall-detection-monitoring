import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TriangleAlert, ShieldAlert, Clock3, Filter, Loader, Search } from 'lucide-react';
import { getAllIncidents } from '../../services/incidentService';
import { Incident } from '../../types/incident';

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const date: Date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
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

export default function AdminIncidentsView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'danger' | 'warning' | 'normal'>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAllIncidents();
        setIncidents(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchSearch =
      !search ||
      inc.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.location?.toLowerCase().includes(search.toLowerCase());
    const matchSev = filterSeverity === 'all' || inc.severity === filterSeverity;
    return matchSearch && matchSev;
  });

  const highCount = incidents.filter((i) => i.severity === 'danger').length;
  const pendingCount = incidents.filter((i) => !i.isResolved).length;

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
            <span>{loading ? '—' : `${incidents.length} Records`}</span>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIconDanger}><ShieldAlert size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>High Alerts</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : highCount}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconWarning}><Clock3 size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Pending Review</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : pendingCount}</h3>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Incident List</h3>
              <p style={styles.sectionText}>Data kejadian yang tercatat dari seluruh user.</p>
            </div>

            <div style={styles.toolbar}>
              <div style={styles.searchWrap}>
                <Search size={14} color="#94a3b8" />
                <input
                  style={styles.searchInput}
                  placeholder="Cari device, lokasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={styles.filterWrap}>
                <Filter size={14} color="#64748b" />
                <select
                  style={styles.filterSelect}
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as typeof filterSeverity)}
                >
                  <option value="all">Semua</option>
                  <option value="danger">High</option>
                  <option value="warning">Medium</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Device</th>
                  <th style={styles.th}>Lokasi</th>
                  <th style={styles.th}>Waktu</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <div style={styles.emptyState}><Loader size={24} color="#94a3b8" /></div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <div style={styles.emptyState}><p style={styles.emptyText}>Tidak ada data ditemukan.</p></div>
                  </td></tr>
                ) : (
                  filtered.map((inc) => (
                    <tr key={inc.id} style={styles.tr}>
                      <td style={styles.td}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{typeLabels[inc.type] ?? inc.type}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b', maxWidth: 220 }}>{inc.description.slice(0, 60)}…</p>
                      </td>
                      <td style={styles.td}><span style={styles.deviceBadge}>{inc.deviceId}</span></td>
                      <td style={styles.td}>{inc.location ?? '—'}</td>
                      <td style={styles.td}>{formatTimestamp(inc.timestamp)}</td>
                      <td style={styles.td}>
                        <span style={inc.severity === 'danger' ? styles.levelDanger : inc.severity === 'warning' ? styles.levelWarning : styles.levelLow}>
                          {inc.severity === 'danger' ? 'High' : inc.severity === 'warning' ? 'Medium' : 'Low'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={inc.isResolved ? styles.resolvedBadge : styles.pendingBadge}>
                          {inc.isResolved ? 'Resolved' : 'Pending'}
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
  content: { padding: '5px' },
  heroCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, display: 'inline-flex', gap: '8px', alignItems: 'center' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '24px' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center' },
  summaryIconDanger: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryIconWarning: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryLabel: { margin: 0, fontSize: '14px', color: '#64748b' },
  summaryValue: { margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: '#0f172a' },
  tableCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionText: { margin: '6px 0 0', fontSize: '14px', color: '#64748b' },
  toolbar: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', height: '38px', backgroundColor: '#f8fafc' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', width: '160px' },
  filterWrap: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', height: '38px', backgroundColor: '#f8fafc' },
  filterSelect: { border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '760px' },
  th: { textAlign: 'left', padding: '12px', fontSize: '13px', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px 12px', fontSize: '14px', color: '#0f172a' },
  emptyCell: { padding: '48px 0', textAlign: 'center' },
  emptyState: { display: 'flex', justifyContent: 'center' },
  emptyText: { margin: 0, color: '#94a3b8', fontSize: '15px' },
  deviceBadge: { backgroundColor: '#f5f3ff', color: '#6d28d9', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' },
  levelDanger: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  levelWarning: { backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  levelLow: { backgroundColor: '#e2e8f0', color: '#334155', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  resolvedBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  pendingBadge: { backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
};