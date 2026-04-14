import { useEffect, useState } from 'react';
import { Activity, Clock3, Loader, MapPin, Smartphone } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MapView from '../../components/maps/MapView';
import { useAuth } from '../../hooks/useAuth';
import { getLansiaByCustomer } from '../../services/lansiaService';
import { getDeviceByLansiaId } from '../../services/deviceService';
import { Lansia } from '../../types/lansia';
import { Device } from '../../types/device';
import { useIsMobile } from '../../hooks/useIsMobile';

function timeAgo(ts: unknown): string {
  if (!ts) return '-';
  const value = ts as { toDate?: () => Date } | string | number | Date;
  const date: Date =
    typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function'
      ? value.toDate()
      : new Date(value as string | number | Date);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} detik yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
}

export default function CustomerTrackingView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [selected, setSelected] = useState<Lansia | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceLoading, setDeviceLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getLansiaByCustomer(user.uid);
        setLansiaList(data);
        if (data.length > 0) {
          setSelected(data[0]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    setDeviceLoading(true);
    getDeviceByLansiaId(selected.id)
      .then(setDevice)
      .finally(() => setDeviceLoading(false));
  }, [selected]);

  return (
    <DashboardLayout
      role="customer"
      title="Live Tracking"
      subtitle="Memantau lokasi lansia secara real-time"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div>
            <p style={styles.heroLabel}>Tracking</p>
            <h2 style={styles.heroTitle}>Lokasi Lansia</h2>
            <p style={styles.heroText}>
              Lihat posisi terakhir lansia dan pastikan perangkat masih aktif
              serta terhubung dengan baik.
            </p>
          </div>

          <div
            style={{
              ...styles.statusPill,
              ...(isMobile ? styles.statusPillMobile : {}),
              color: loading ? '#334155' : device?.isOnline ? '#166534' : '#b91c1c',
            }}
          >
            <span
              style={{
                ...styles.statusDot,
                backgroundColor: device?.isOnline ? '#22c55e' : '#ef4444',
              }}
            />
            {loading ? '-' : device?.isOnline ? 'Lokasi Aktif' : 'Device Offline'}
          </div>

        </div>

        {lansiaList.length > 1 && (
          <div style={styles.selectorRow}>
            {lansiaList.map((l) => (
              <button
                key={l.id}
                style={{
                  ...styles.selectorBtn,
                  backgroundColor: selected?.id === l.id ? '#2563eb' : '#ffffff',
                  color: selected?.id === l.id ? '#ffffff' : '#334155',
                  border: `1px solid ${selected?.id === l.id ? '#2563eb' : '#e2e8f0'}`,
                }}
                onClick={() => setSelected(l)}
              >
                {l.nama}
              </button>
            ))}
          </div>
        )}

        <div style={{ ...styles.grid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.mapCard}>
            {deviceLoading ? (
              <div style={styles.mapPlaceholder}>
                <div style={styles.mapPlaceholderInner}>
                  <Loader size={28} color="#1d4ed8" />
                </div>
              </div>
            ) : (
              <MapView
                latitude={device?.latitude}
                longitude={device?.longitude}
                locationName={device?.locationName ?? 'Lokasi perangkat'}
                height={420}
              />
            )}
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>Informasi Lokasi</h3>

            {loading || deviceLoading ? (
              <div style={styles.loadingBox}>
                <Loader size={20} color="#94a3b8" />
              </div>
            ) : (
              <>
                <div style={styles.infoItem}>
                  <div style={styles.infoLeft}>
                    <span style={styles.iconWrap}>
                      <Activity size={18} />
                    </span>
                    <span style={styles.infoLabel}>Nama Lansia</span>
                  </div>
                  <span style={styles.infoValue}>{selected?.nama ?? '-'}</span>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoLeft}>
                    <span style={styles.iconWrap}>
                      <MapPin size={18} />
                    </span>
                    <span style={styles.infoLabel}>Posisi Terakhir</span>
                  </div>
                  <span style={styles.infoValue}>{device?.locationName ?? '-'}</span>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoLeft}>
                    <span style={styles.iconWrap}>
                      <Clock3 size={18} />
                    </span>
                    <span style={styles.infoLabel}>Diperbarui Terakhir</span>
                  </div>
                  <span style={styles.infoValue}>
                    {device ? timeAgo(device.lastSeen) : '-'}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoLeft}>
                    <span style={styles.iconWrap}>
                      <Smartphone size={18} />
                    </span>
                    <span style={styles.infoLabel}>Kondisi Perangkat</span>
                  </div>
                  <span
                    style={
                      device?.isOnline ? styles.infoBadgeOnline : styles.infoBadgeOffline
                    }
                  >
                    {device?.isOnline ? 'Aktif & Terhubung' : 'Offline'}
                  </span>
                </div>

                {device && (
                  <div style={styles.detailBox}>
                    <p style={styles.detailTitle}>Detail teknis</p>
                    <p style={styles.detailText}>
                      Koordinat: {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                    </p>
                    <p style={styles.detailText}>Serial: {device.serial}</p>
                    <p style={styles.detailText}>Battery: {device.batteryLevel}%</p>
                    <p style={styles.detailText}>Firmware: {device.firmware}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
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
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroLabel: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.8)',
  },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
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
  statusPillMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '999px' },
  selectorRow: { display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' },
  selectorBtn: {
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '18px',
    boxShadow: '0 10px 25px rgba(15,23,42,0.05)',
    border: '1px solid #e2e8f0',
  },
  mapPlaceholder: {
    width: '100%',
    minHeight: '420px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15,23,42,0.05)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: { margin: '0 0 20px', fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '14px 0',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  infoLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
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
  infoLabel: { fontSize: '14px', color: '#64748b' },
  infoValue: { fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  infoBadgeOnline: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  infoBadgeOffline: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  detailBox: {
    marginTop: '14px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    padding: '14px 16px',
  },
  detailTitle: { margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: '#1d4ed8' },
  detailText: { margin: '4px 0 0', fontSize: '13px', color: '#334155' },
};
