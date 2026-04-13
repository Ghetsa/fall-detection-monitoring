import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Settings,
  Bell,
  Shield,
  Smartphone,
  Save,
  Server,
} from 'lucide-react';

export default function AdminSettingsView() {
  const [systemName, setSystemName] = useState('Anti Fall App');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [whatsappNotification, setWhatsappNotification] = useState(true);
  const [autoIncidentReport, setAutoIncidentReport] = useState(true);

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan.');
  };

  return (
    <DashboardLayout
      role="admin"
      title="Settings"
      subtitle="Pengaturan sistem dan notifikasi admin"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>System Settings</p>
            <h2 style={styles.heroTitle}>Pengaturan Admin</h2>
            <p style={styles.heroText}>
              Kelola konfigurasi dasar sistem, notifikasi, dan preferensi
              operasional admin dari satu halaman.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <Settings size={18} />
            <span>Config Ready</span>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.mainCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Pengaturan Umum</h3>
              <span style={styles.sectionBadge}>System</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nama Sistem</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <Server size={16} />
                </span>
                <input
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  style={styles.input}
                  placeholder="Nama sistem"
                />
              </div>
            </div>

            <div style={styles.switchRow}>
              <div style={styles.switchInfo}>
                <span style={styles.switchIcon}>
                  <Shield size={16} />
                </span>
                <div>
                  <p style={styles.switchTitle}>Mode Maintenance</p>
                  <p style={styles.switchText}>
                    Aktifkan bila sistem sedang dalam perbaikan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{
                  ...styles.toggle,
                  ...(maintenanceMode ? styles.toggleActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.toggleDot,
                    ...(maintenanceMode ? styles.toggleDotActive : {}),
                  }}
                />
              </button>
            </div>

            <div style={styles.switchRow}>
              <div style={styles.switchInfo}>
                <span style={styles.switchIcon}>
                  <Bell size={16} />
                </span>
                <div>
                  <p style={styles.switchTitle}>Notifikasi Email</p>
                  <p style={styles.switchText}>
                    Kirim ringkasan sistem melalui email admin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEmailNotification(!emailNotification)}
                style={{
                  ...styles.toggle,
                  ...(emailNotification ? styles.toggleActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.toggleDot,
                    ...(emailNotification ? styles.toggleDotActive : {}),
                  }}
                />
              </button>
            </div>

            <div style={styles.switchRow}>
              <div style={styles.switchInfo}>
                <span style={styles.switchIcon}>
                  <Smartphone size={16} />
                </span>
                <div>
                  <p style={styles.switchTitle}>Notifikasi WhatsApp</p>
                  <p style={styles.switchText}>
                    Kirim pemberitahuan penting ke WhatsApp admin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setWhatsappNotification(!whatsappNotification)}
                style={{
                  ...styles.toggle,
                  ...(whatsappNotification ? styles.toggleActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.toggleDot,
                    ...(whatsappNotification ? styles.toggleDotActive : {}),
                  }}
                />
              </button>
            </div>

            <div style={styles.switchRow}>
              <div style={styles.switchInfo}>
                <span style={styles.switchIcon}>
                  <Settings size={16} />
                </span>
                <div>
                  <p style={styles.switchTitle}>Laporan Insiden Otomatis</p>
                  <p style={styles.switchText}>
                    Buat laporan otomatis saat ada insiden baru.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAutoIncidentReport(!autoIncidentReport)}
                style={{
                  ...styles.toggle,
                  ...(autoIncidentReport ? styles.toggleActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.toggleDot,
                    ...(autoIncidentReport ? styles.toggleDotActive : {}),
                  }}
                />
              </button>
            </div>

            <button onClick={handleSave} style={styles.saveButton}>
              <Save size={16} />
              <span>Simpan Pengaturan</span>
            </button>
          </div>

          <div style={styles.sideCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Ringkasan</h3>
              <span style={styles.sectionBadgeAlt}>Live</span>
            </div>

            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nama Sistem</span>
                <span style={styles.summaryValue}>{systemName}</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Maintenance</span>
                <span
                  style={
                    maintenanceMode
                      ? styles.badgeWarning
                      : styles.badgeSuccess
                  }
                >
                  {maintenanceMode ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Email</span>
                <span
                  style={
                    emailNotification
                      ? styles.badgeSuccess
                      : styles.badgeMuted
                  }
                >
                  {emailNotification ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>WhatsApp</span>
                <span
                  style={
                    whatsappNotification
                      ? styles.badgeSuccess
                      : styles.badgeMuted
                  }
                >
                  {whatsappNotification ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Auto Report</span>
                <span
                  style={
                    autoIncidentReport
                      ? styles.badgeSuccess
                      : styles.badgeMuted
                  }
                >
                  {autoIncidentReport ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteTitle}>Catatan</p>
              <p style={styles.noteText}>
                Untuk sementara halaman ini masih menyimpan pengaturan secara
                lokal. Nanti bisa dihubungkan ke Firestore agar benar-benar
                persistent.
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
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  sideCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
  },
  sectionBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  sectionBadgeAlt: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  switchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '1px solid #e2e8f0',
  },
  switchInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  switchIcon: {
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
  switchTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  switchText: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  toggle: {
    width: '52px',
    height: '30px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#cbd5e1',
    padding: '4px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleDot: {
    width: '22px',
    height: '22px',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    display: 'block',
    transition: 'all 0.2s ease',
    transform: 'translateX(0)',
  },
  toggleDotActive: {
    transform: 'translateX(22px)',
  },
  saveButton: {
    marginTop: '20px',
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
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: '14px',
  },
  summaryValue: {
    color: '#0f172a',
    fontSize: '15px',
    fontWeight: 700,
    wordBreak: 'break-word',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  badgeMuted: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  noteBox: {
    marginTop: '20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '16px',
  },
  noteTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 800,
    color: '#0f172a',
  },
  noteText: {
    margin: '8px 0 0',
    fontSize: '13px',
    lineHeight: 1.7,
    color: '#475569',
  },
};