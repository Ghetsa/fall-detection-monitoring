import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Bell,
  AlertTriangle,
  ShieldCheck,
  BatteryWarning,
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'Terdeteksi Jatuh',
    description: 'Sistem mendeteksi kemungkinan lansia terjatuh.',
    time: '12 April 2026 • 08:45',
    type: 'danger',
  },
  {
    id: 2,
    title: 'Baterai Lemah',
    description: 'Baterai perangkat mulai menipis.',
    time: '11 April 2026 • 17:12',
    type: 'warning',
  },
  {
    id: 3,
    title: 'Kondisi Aman',
    description: 'Tidak ada indikasi kejadian berbahaya.',
    time: '10 April 2026 • 09:20',
    type: 'safe',
  },
];

export default function CustomerNotificationsView() {
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
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Notifications</p>
            <h2 style={styles.heroTitle}>Notifikasi Sistem</h2>
            <p style={styles.heroText}>
              Semua pemberitahuan penting akan muncul di sini secara real-time.
            </p>
          </div>

          <div style={styles.countBadge}>
            <Bell size={18} />
            <span>{notifications.length} Notifikasi</span>
          </div>
        </div>

        <div style={styles.list}>
          {notifications.map((n) => (
            <div key={n.id} style={styles.card}>
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
                  <p style={styles.desc}>{n.description}</p>
                  <p style={styles.time}>{n.time}</p>
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
                {n.type === 'danger'
                  ? 'Penting'
                  : n.type === 'warning'
                  ? 'Perhatian'
                  : 'Normal'}
              </span>
            </div>
          ))}
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
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    borderRadius: '24px',
    padding: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  heroLabel: {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  heroTitle: {
    fontSize: '30px',
    fontWeight: 800,
    margin: '8px 0',
  },
  heroText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    lineHeight: 1.7,
  },
  countBadge: {
    background: '#fff',
    color: '#1d4ed8',
    padding: '10px 16px',
    borderRadius: '999px',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  list: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: '#fff',
    padding: '18px',
    borderRadius: '18px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  icon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconDanger: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  iconWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  iconSafe: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  title: {
    margin: 0,
    fontWeight: 800,
    fontSize: '15px',
    color: '#0f172a',
  },
  desc: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  time: {
    margin: 0,
    fontSize: '12px',
    color: '#94a3b8',
  },
  badge: {
    padding: '8px 12px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  badgeSafe: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
};