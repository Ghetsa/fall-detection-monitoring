import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bell, AlertTriangle, ShieldCheck, BatteryWarning, Loader, CheckCheck } from 'lucide-react';
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

export default function CustomerNotificationsView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNotificationsByCustomer(user.uid);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAll = async () => {
    if (!user || unreadCount === 0) return;
    setMarking(true);
    try {
      await markAllNotificationsRead(user.uid);
      await loadData();
    } finally {
      setMarking(false);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'danger') return <AlertTriangle size={20} />;
    if (type === 'warning') return <BatteryWarning size={20} />;
    return <ShieldCheck size={20} />;
  };

  return (
    <DashboardLayout
      role="customer"
      title="Notifications"
      subtitle="Pemberitahuan dari sistem monitoring"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div>
            <p style={styles.heroLabel}>Notifications</p>
            <h2 style={styles.heroTitle}>Notifikasi Sistem</h2>
            <p style={styles.heroText}>
              Semua pemberitahuan penting akan muncul di sini secara real-time.
            </p>
          </div>

          <div style={{ ...styles.countBadge, ...(isMobile ? styles.countBadgeMobile : {}) }}>
            <Bell size={18} />
            <span>{loading ? '—' : `${notifications.length} Notifikasi`}</span>
          </div>
        </div>

        {unreadCount > 0 && (
          <div style={styles.unreadBar}>
            <span style={styles.unreadText}>
              {unreadCount} notifikasi belum dibaca
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
          <div style={styles.loadingBox}><Loader size={28} color="#94a3b8" /></div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyBox}>
            <Bell size={40} color="#cbd5e1" />
            <p style={styles.emptyText}>Belum ada notifikasi.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((n) => (
              <div key={n.id} style={{ ...styles.card, opacity: n.isRead ? 0.75 : 1, borderLeft: n.isRead ? '4px solid #e2e8f0' : n.type === 'danger' ? '4px solid #ef4444' : n.type === 'warning' ? '4px solid #f59e0b' : '4px solid #22c55e' }}>
                <div style={styles.left}>
                  <span
                    style={{
                      ...styles.icon,
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
                    <p style={styles.title}>{n.title}</p>
                    {n.lansiaName && <p style={{ ...styles.desc, color: '#1d4ed8', fontSize: '12px', fontWeight: 700, margin: '2px 0' }}>{n.lansiaName}</p>}
                    <p style={styles.desc}>{n.description}</p>
                    <p style={styles.time}>{formatTimestamp(n.createdAt)}</p>
                  </div>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    ...(n.type === 'danger'
                      ? styles.badgeDanger
                      : n.type === 'warning'
                      ? styles.badgeWarning
                      : styles.badgeSafe),
                  }}
                >
                  {n.type === 'danger' ? 'Penting' : n.type === 'warning' ? 'Perhatian' : 'Normal'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px' },
  heroCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroLabel: { fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', margin: 0 },
  heroTitle: { fontSize: '30px', fontWeight: 800, margin: '8px 0' },
  heroText: { fontSize: '15px', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.7 },
  countBadge: { background: '#fff', color: '#1d4ed8', padding: '10px 16px', borderRadius: '999px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' },
  countBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  unreadBar: { marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px 16px' },
  unreadText: { fontSize: '14px', fontWeight: 700, color: '#1d4ed8' },
  markAllBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '60px 0' },
  emptyText: { margin: 0, fontSize: '15px', color: '#94a3b8', fontWeight: 600 },
  list: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  left: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  icon: { width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconDanger: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  iconWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
  iconSafe: { backgroundColor: '#dcfce7', color: '#166534' },
  title: { margin: 0, fontWeight: 800, fontSize: '15px', color: '#0f172a' },
  desc: { margin: '4px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
  time: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  badge: { padding: '8px 12px', borderRadius: '999px', fontWeight: 700, fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 },
  badgeDanger: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  badgeWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeSafe: { backgroundColor: '#dcfce7', color: '#166534' },
};
