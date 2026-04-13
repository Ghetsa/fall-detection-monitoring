import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  MapPin,
  Clock3,
  Activity,
  Smartphone,
  LocateFixed,
} from 'lucide-react';

export default function CustomerTrackingView() {
  return (
    <DashboardLayout
      role="customer"
      title="Live Tracking"
      subtitle="Memantau lokasi lansia secara real-time"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Tracking</p>
            <h2 style={styles.heroTitle}>Lokasi Lansia</h2>
            <p style={styles.heroText}>
              Lihat posisi terakhir lansia dan pastikan perangkat masih aktif
              serta terhubung dengan baik.
            </p>
          </div>

          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            Lokasi Aktif
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.mapCard}>
            <div style={styles.mapPlaceholder}>
              <div style={styles.mapPlaceholderInner}>
                <LocateFixed size={34} />
                <span style={styles.mapText}>Peta lokasi akan tampil di sini</span>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Informasi Lokasi</h3>

            <div style={styles.infoItem}>
              <div style={styles.infoLeft}>
                <span style={styles.iconWrap}>
                  <Activity size={18} />
                </span>
                <span style={styles.infoLabel}>Nama Lansia</span>
              </div>
              <span style={styles.infoValue}>Nenek Siti</span>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLeft}>
                <span style={styles.iconWrap}>
                  <MapPin size={18} />
                </span>
                <span style={styles.infoLabel}>Posisi Terakhir</span>
              </div>
              <span style={styles.infoValue}>Bandar Lampung</span>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLeft}>
                <span style={styles.iconWrap}>
                  <Clock3 size={18} />
                </span>
                <span style={styles.infoLabel}>Diperbarui Terakhir</span>
              </div>
              <span style={styles.infoValue}>2 menit yang lalu</span>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLeft}>
                <span style={styles.iconWrap}>
                  <Smartphone size={18} />
                </span>
                <span style={styles.infoLabel}>Kondisi Perangkat</span>
              </div>
              <span style={styles.infoBadge}>Aktif & Terhubung</span>
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteTitle}>Catatan</p>
              <p style={styles.noteText}>
                Lokasi yang ditampilkan adalah posisi terakhir yang berhasil
                dikirim oleh perangkat. Jika belum berubah, kemungkinan perangkat
                belum mengirim pembaruan terbaru.
              </p>
            </div>

            <div style={styles.detailBox}>
              <p style={styles.detailTitle}>Detail teknis</p>
              <p style={styles.detailText}>Koordinat: -5.4292, 105.2610</p>
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
  },
  heroText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.92)',
    maxWidth: '700px',
  },
  statusPill: {
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
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '20px',
    marginTop: '24px',
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '18px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  mapPlaceholder: {
    width: '100%',
    minHeight: '420px',
    borderRadius: '18px',
    background:
      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: '#1d4ed8',
  },
  mapText: {
    fontSize: '18px',
    fontWeight: 800,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    margin: '0 0 20px',
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  infoLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  infoValue: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  infoBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  noteBox: {
    marginTop: '18px',
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
  detailBox: {
    marginTop: '14px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    padding: '14px 16px',
  },
  detailTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#1d4ed8',
  },
  detailText: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#334155',
  },
};