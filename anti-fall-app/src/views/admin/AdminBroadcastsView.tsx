import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Megaphone, Send, BellRing, FileText, Loader } from 'lucide-react';
import { getAllBroadcasts, sendBroadcast } from '../../services/broadcastService';
import { Broadcast } from '../../types/broadcast';
import { useAuth } from '../../hooks/useAuth';
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

const typeColors: Record<string, React.CSSProperties> = {
  info: { backgroundColor: '#eff6ff', color: '#1d4ed8' },
  warning: { backgroundColor: '#fef3c7', color: '#92400e' },
  urgent: { backgroundColor: '#fee2e2', color: '#b91c1c' },
};

export default function AdminBroadcastsView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [history, setHistory] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>('info');
  const [targetRole, setTargetRole] = useState<'all' | 'customer' | 'admin'>('all');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllBroadcasts();
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim() || !user) return;
    setSending(true);
    try {
      await sendBroadcast({
        title,
        message,
        type,
        targetRole,
        createdBy: user.uid,
        isActive: true,
      });
      setTitle('');
      setMessage('');
      setSuccessMsg('Broadcast berhasil dikirim!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadData();
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout
      role="admin"
      title="Broadcast News"
      subtitle="Kirim pengumuman ke seluruh dashboard customer"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Broadcast</p>
            <h2 style={styles.heroTitle}>Pengumuman Sistem</h2>
            <p style={styles.heroText}>
              Kirim informasi penting kepada seluruh pengguna secara cepat.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <Megaphone size={18} />
            <span>Admin Notice</span>
          </div>
        </div>

        <div style={{ ...styles.grid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Buat Pengumuman</h3>
              <p style={styles.cardSubtitle}>Isi judul dan pesan pengumuman untuk user.</p>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Judul Pengumuman</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Info Maintenance Sistem"
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.field, marginTop: '14px' }}>
              <label style={styles.label}>Isi Pesan</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pengumuman untuk seluruh pengguna..."
                style={styles.textarea}
              />
            </div>

            <div style={{ ...styles.rowFields, ...(isMobile ? styles.rowFieldsMobile : {}) }}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Tipe</label>
                <select style={styles.select} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Target</label>
                <select style={styles.select} value={targetRole} onChange={(e) => setTargetRole(e.target.value as typeof targetRole)}>
                  <option value="all">Semua</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {successMsg && (
              <div style={styles.successBox}>{successMsg}</div>
            )}

            <button
              onClick={handleSend}
              disabled={sending || !title.trim() || !message.trim()}
              style={{ ...styles.button, opacity: sending || !title.trim() || !message.trim() ? 0.6 : 1 }}
            >
              {sending ? <Loader size={16} /> : <Send size={16} />}
              <span>{sending ? 'Mengirim...' : 'Kirim Broadcast'}</span>
            </button>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}><BellRing size={18} /></span>
              <div>
                <p style={styles.infoTitle}>Notifikasi langsung</p>
                <p style={styles.infoText}>Broadcast akan muncul pada dashboard pengguna.</p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoIcon}><FileText size={18} /></span>
              <div>
                <p style={styles.infoTitle}>Gunakan pesan singkat</p>
                <p style={styles.infoText}>Buat isi pengumuman yang jelas dan mudah dipahami.</p>
              </div>
            </div>

            <div style={styles.statsBox}>
              <p style={styles.statsTitle}>Total Broadcasts</p>
              <p style={styles.statsValue}>{loading ? '—' : history.length}</p>
            </div>
          </div>
        </div>

        <div style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <h3 style={styles.cardTitle}>Riwayat Broadcast</h3>
            <span style={styles.historyBadge}>{history.length} Messages</span>
          </div>

          {loading ? (
            <div style={styles.loadingBox}><Loader size={24} color="#94a3b8" /></div>
          ) : history.length === 0 ? (
            <p style={styles.emptyText}>Belum ada broadcast yang dikirim.</p>
          ) : (
            <div style={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} style={styles.historyItem}>
                  <div style={styles.historyTop}>
                    <div>
                      <p style={styles.historyTitle}>{item.title}</p>
                      <p style={styles.historyMessage}>{item.message}</p>
                    </div>
                    <div style={styles.historyMeta}>
                      <span style={{ ...styles.typeBadge, ...(typeColors[item.type] ?? {}) }}>
                        {item.type}
                      </span>
                      <span style={styles.targetBadge}>{item.targetRole}</span>
                    </div>
                  </div>
                  <p style={styles.historyDate}>{formatTimestamp(item.createdAt)}</p>
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
  content: { padding: '5px' },
  heroCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, display: 'inline-flex', gap: '8px', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  formCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0' },
  infoCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardHeader: { marginBottom: '20px' },
  cardTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  cardSubtitle: { margin: '8px 0 0', fontSize: '14px', color: '#64748b', lineHeight: 1.6 },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  rowFields: { display: 'flex', gap: '12px', marginTop: '14px' },
  rowFieldsMobile: { flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 700, color: '#334155' },
  input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box' },
  textarea: { width: '100%', minHeight: '140px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' },
  select: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#0f172a', backgroundColor: '#ffffff', cursor: 'pointer' },
  successBox: { marginTop: '12px', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: '#166534' },
  button: { marginTop: '18px', backgroundColor: '#2563eb', color: '#ffffff', padding: '13px 18px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  infoRow: { display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' },
  infoIcon: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  infoText: { margin: '6px 0 0', fontSize: '13px', lineHeight: 1.6, color: '#64748b' },
  statsBox: { backgroundColor: '#f8fafc', borderRadius: '14px', padding: '16px', textAlign: 'center' },
  statsTitle: { margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600 },
  statsValue: { margin: '8px 0 0', fontSize: '32px', fontWeight: 800, color: '#0f172a' },
  historyCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0' },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' },
  historyBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '32px 0' },
  emptyText: { margin: 0, textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '20px 0' },
  historyList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  historyItem: { paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' },
  historyTop: { display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' },
  historyTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  historyMessage: { margin: '6px 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.6 },
  historyMeta: { display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'flex-start', flexWrap: 'wrap' },
  typeBadge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  targetBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  historyDate: { margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' },
};
