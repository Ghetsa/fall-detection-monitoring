import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Megaphone, Send, BellRing, FileText } from 'lucide-react';

const history = [
  {
    id: 1,
    title: 'Info Maintenance Sistem',
    message: 'Server akan maintenance malam ini pukul 23.00 WIB.',
    date: '12 April 2026 • 08:00',
  },
  {
    id: 2,
    title: 'Pembaruan Dashboard',
    message: 'Fitur notifikasi telah diperbarui.',
    date: '10 April 2026 • 14:30',
  },
];

export default function AdminBroadcastsView() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    alert(`Broadcast terkirim:\n${title}\n${message}`);
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

        <div style={styles.grid}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Buat Pengumuman</h3>
              <p style={styles.cardSubtitle}>
                Isi judul dan pesan pengumuman untuk user.
              </p>
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

            <button onClick={handleSend} style={styles.button}>
              <Send size={16} />
              <span>Kirim Broadcast</span>
            </button>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>
                <BellRing size={18} />
              </span>
              <div>
                <p style={styles.infoTitle}>Notifikasi langsung</p>
                <p style={styles.infoText}>
                  Broadcast akan muncul pada dashboard pengguna.
                </p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>
                <FileText size={18} />
              </span>
              <div>
                <p style={styles.infoTitle}>Gunakan pesan singkat</p>
                <p style={styles.infoText}>
                  Buat isi pengumuman yang jelas dan mudah dipahami.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <h3 style={styles.cardTitle}>Riwayat Broadcast</h3>
            <span style={styles.historyBadge}>{history.length} Messages</span>
          </div>

          <div style={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} style={styles.historyItem}>
                <div>
                  <p style={styles.historyTitle}>{item.title}</p>
                  <p style={styles.historyMessage}>{item.message}</p>
                  <p style={styles.historyDate}>{item.date}</p>
                </div>
              </div>
            ))}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '20px',
    marginTop: '24px',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
  },
  cardSubtitle: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '140px',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  button: {
    marginTop: '18px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '13px 18px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '14px',
    borderBottom: '1px solid #e2e8f0',
  },
  infoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  infoText: {
    margin: '6px 0 0',
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#64748b',
  },
  historyCard: {
    marginTop: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  historyBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  historyItem: {
    paddingBottom: '14px',
    borderBottom: '1px solid #e2e8f0',
  },
  historyTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  historyMessage: {
    margin: '6px 0 0',
    fontSize: '14px',
    color: '#475569',
    lineHeight: 1.6,
  },
  historyDate: {
    margin: '8px 0 0',
    fontSize: '12px',
    color: '#94a3b8',
  },
};