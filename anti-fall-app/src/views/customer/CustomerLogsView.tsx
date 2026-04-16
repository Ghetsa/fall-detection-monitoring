import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertTriangle, BatteryWarning, CheckCheck, Loader, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getNotificationsByCustomer, markAllNotificationsRead } from '../../services/notificationService';
import { Notification } from '../../types/notification';
import { useIsMobile } from '../../hooks/useIsMobile';

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—';
  const value = ts as { toDate?: () => Date } | string | number | Date;
  const date: Date =
    typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function'
      ? value.toDate()
      : new Date(value as string | number | Date);
  return date.toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const statusLabel = (sev: string) => {
  if (sev === 'danger') return 'Warning';
  if (sev === 'warning') return 'Low';
  return 'Normal';
};

export default function CustomerLogsView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [monitoringHistory, setMonitoringHistory] = useState<Notification[]>([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const notifications = await getNotificationsByCustomer(user.uid);
        setMonitoringHistory(notifications);
        setTotalHistoryCount(notifications.length);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const unreadCount = monitoringHistory.filter((n) => !n.isRead).length;

  const handleMarkAll = async () => {
    if (!user || unreadCount === 0) return;
    setMarking(true);
    try {
      await markAllNotificationsRead(user.uid);
      const refreshed = await getNotificationsByCustomer(user.uid);
      setMonitoringHistory(refreshed);
      setTotalHistoryCount(refreshed.length);
    } finally {
      setMarking(false);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'danger') return <AlertTriangle size={18} />;
    if (type === 'warning') return <BatteryWarning size={18} />;
    return <ShieldCheck size={18} />;
  };

  return (
    <DashboardLayout
      role="customer"
      title="History"
      subtitle="Riwayat monitoring device/lansia"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div>
            <p style={styles.heroLabel}>Logs</p>
            <h2 style={styles.heroTitle}>Riwayat Aktivitas</h2>
            <p style={styles.heroText}>
              Semua aktivitas monitoring, alert sistem, dan kejadian device tercatat di sini.
            </p>
          </div>

          <div style={{ ...styles.countBadge, ...(isMobile ? styles.countBadgeMobile : {}) }}>
            {loading ? '-' : totalHistoryCount + ' Total History'}
          </div>
        </div>

        <div style={styles.monitorCard}>
          <div style={styles.monitorHeader}>
            <h3 style={styles.sectionTitle}>Monitoring History</h3>
          </div>

          {unreadCount > 0 && (
            <div style={styles.unreadBar}>
              <span style={styles.unreadText}>
                {unreadCount} alert belum dibaca
              </span>
              <button
                style={{ ...styles.markAllBtn, opacity: marking ? 0.6 : 1 }}
                onClick={handleMarkAll}
                disabled={marking}
              >
                <CheckCheck size={14} />
                <span>Tandai Semua Dibaca</span>
              </button>
            </div>
          )}

          {loading ? (
            <div style={styles.loadingBox}><Loader size={20} color="#94a3b8" /></div>
          ) : monitoringHistory.length === 0 ? (
            <p style={styles.emptyText}>Belum ada histori monitoring.</p>
          ) : (
            <div style={styles.monitorList}>
              {monitoringHistory.map((n) => (
                <div
                  key={n.id}
                  style={{
                    ...styles.monitorItem,
                    opacity: n.isRead ? 0.75 : 1,
                    borderLeft:
                      n.isRead
                        ? '4px solid #e2e8f0'
                        : n.type === 'danger'
                        ? '4px solid #ef4444'
                        : n.type === 'warning'
                        ? '4px solid #f59e0b'
                        : '4px solid #22c55e',
                  }}
                >
                  <div style={styles.monitorLeft}>
                    <span
                      style={{
                        ...styles.monitorIcon,
                        ...(n.type === 'danger'
                          ? styles.iconDanger
                          : n.type === 'warning'
                          ? styles.iconWarning
                          : styles.iconSafe),
                      }}
                    >
                      {getIcon(n.type)}
                    </span>

                    <div>
                      <p style={styles.monitorTitle}>{n.title}</p>
                      {n.lansiaName ? (
                        <p style={styles.monitorLansia}>{n.lansiaName}</p>
                      ) : null}
                      <p style={styles.monitorDesc}>{n.description}</p>
                      <p style={styles.monitorTime}>{formatTimestamp(n.createdAt)}</p>
                    </div>
                  </div>

                  <span
                    style={{
                      ...styles.monitorBadge,
                      ...(n.type === 'danger'
                        ? styles.badgeDanger
                        : n.type === 'warning'
                        ? styles.badgeWarning
                        : styles.badgeSafe),
                    }}
                  >
                    {statusLabel(n.type)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  countBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '10px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '14px' },
  countBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  monitorCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  monitorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' },
  unreadBar: { marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px 16px' },
  unreadText: { fontSize: '14px', fontWeight: 800, color: '#1d4ed8' },
  markAllBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' },
  monitorList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  monitorItem: { background: '#fff', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  monitorLeft: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  monitorIcon: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconDanger: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  iconWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
  iconSafe: { backgroundColor: '#dcfce7', color: '#166534' },
  monitorTitle: { margin: 0, fontWeight: 900, fontSize: '15px', color: '#0f172a' },
  monitorLansia: { margin: '2px 0', fontSize: '12px', fontWeight: 800, color: '#1d4ed8' },
  monitorDesc: { margin: '4px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
  monitorTime: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  monitorBadge: { padding: '8px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 },
  badgeDanger: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  badgeWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeSafe: { backgroundColor: '#dcfce7', color: '#166534' },
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
