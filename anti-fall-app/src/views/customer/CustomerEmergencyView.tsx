import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Smartphone,
  Users,
  Siren,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerEmergencyView() {
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    alert('Nomor disimpan: ' + phone);
  };

  return (
    <DashboardLayout
      role="customer"
      title="Emergency Setup"
      subtitle="Pengaturan kontak darurat"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Emergency Contact</p>
            <h2 style={styles.heroTitle}>Kontak Darurat Keluarga</h2>
            <p style={styles.heroText}>
              Tambahkan nomor WhatsApp keluarga agar sistem bisa mengirim
              pemberitahuan otomatis ketika terdeteksi kejadian darurat.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Aktif
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Nomor WhatsApp Darurat</h3>
              <p style={styles.cardSubtitle}>
                Gunakan nomor yang aktif dan mudah dihubungi.
              </p>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Nomor WhatsApp Keluarga</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                style={styles.input}
              />
              <p style={styles.helperText}>
                Nomor ini akan menerima notifikasi saat sistem mendeteksi
                kondisi berbahaya.
              </p>
            </div>

            <button onClick={handleSave} style={styles.button}>
              Simpan Kontak
            </button>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Informasi Penting</h3>
              <p style={styles.cardSubtitle}>
                Pastikan kontak darurat sudah benar.
              </p>
            </div>

            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>
                  <Smartphone size={18} />
                </span>
                <div>
                  <p style={styles.infoTitle}>Gunakan nomor aktif</p>
                  <p style={styles.infoText}>
                    Pastikan nomor WhatsApp masih digunakan dan bisa menerima
                    pesan.
                  </p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>
                  <Users size={18} />
                </span>
                <div>
                  <p style={styles.infoTitle}>Pilih keluarga terdekat</p>
                  <p style={styles.infoText}>
                    Disarankan menggunakan nomor keluarga yang bisa merespons
                    cepat.
                  </p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>
                  <Siren size={18} />
                </span>
                <div>
                  <p style={styles.infoTitle}>Notifikasi otomatis</p>
                  <p style={styles.infoText}>
                    Sistem akan mengirim peringatan ketika terjadi insiden yang
                    terdeteksi.
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.previewBox}>
              <div style={styles.previewHeader}>
                <span style={styles.previewIcon}>
                  <ShieldCheck size={16} />
                </span>
                <p style={styles.previewLabel}>Kontak saat ini</p>
              </div>

              <p style={styles.previewValue}>
                {phone ? phone : 'Belum ada nomor yang disimpan'}
              </p>
            </div>
          </div>
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
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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

  helperText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#64748b',
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
  },

  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
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

  previewBox: {
    marginTop: '20px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    padding: '16px',
  },

  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  previewIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  previewLabel: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#1d4ed8',
  },

  previewValue: {
    margin: '8px 0 0',
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    wordBreak: 'break-word',
  },
};