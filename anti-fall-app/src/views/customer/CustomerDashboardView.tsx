import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { getLansiaByCustomer } from '../../services/lansiaService';
import { getDeviceByLansiaId } from '../../services/deviceService';
import { getIncidentsByCustomer } from '../../services/incidentService';
import { getEmergencyByCustomer } from '../../services/emergencyContactService';
import { Lansia } from '../../types/lansia';
import { Device } from '../../types/device';
import { Incident } from '../../types/incident';
import { EmergencyContact } from '../../types/emergency';
import { Loader } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—';
  const value = ts as { toDate?: () => Date } | string | number | Date;
  const date: Date =
    typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function'
      ? value.toDate()
      : new Date(value as string | number | Date);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(ts: unknown): string {
  if (!ts) return '—';
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

export default function CustomerDashboardView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [emergencyList, setEmergencyList] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const getEmergencyForLansia = (lansia: Lansia | null): EmergencyContact | null => {
    if (!lansia) return null;
    if (lansia.emergencyContactId) {
      return emergencyList.find((e) => e.id === lansia.emergencyContactId) ?? null;
    }
    // Backward compat: resolve by lansiaId if lansia.emergencyContactId hasn't been written yet.
    return emergencyList.find((e) => e.lansiaId === lansia.id) ?? null;
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [lansiaData, incidentData, emergencyData] = await Promise.all([
          getLansiaByCustomer(user.uid),
          getIncidentsByCustomer(user.uid),
          getEmergencyByCustomer(user.uid),
        ]);
        if (cancelled) return;
        setLansiaList(lansiaData);
        setIncidents(incidentData);
        setEmergencyList(emergencyData);

        const primary =
          lansiaData.find((l) => l.status === 'Aktif') ?? lansiaData[0] ?? null;

        // Reset device state when lansia list changes.
        if (!cancelled) setDevice(null);

        if (primary) {
          const dev = await getDeviceByLansiaId(primary.id);
          if (!cancelled) setDevice(dev);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const firstLansia =
    lansiaList.find((l) => l.status === 'Aktif') ?? lansiaList[0] ?? null;
  const currentEmergency = getEmergencyForLansia(firstLansia);
  const recentIncidents = incidents.slice(0, 3);
  const hasLansia = Boolean(firstLansia);
  const hasDevice = Boolean(device);
  const hasMonitoringConnection = hasLansia && hasDevice;
  const hasActiveFall = incidents.some(
    (i) => i.type === 'fall_detected' && !i.isResolved
  );

  const statusLabel = !hasLansia
    ? 'Belum ada data lansia'
    : !hasDevice
      ? 'Device belum terhubung'
      : hasActiveFall
        ? 'Bahaya!'
        : 'Safe';

  const statusColor = !hasLansia
    ? '#475569'
    : !hasDevice
      ? '#92400e'
      : hasActiveFall
        ? '#b91c1c'
        : '#166534';

  const statusDotColor = !hasLansia
    ? '#94a3b8'
    : !hasDevice
      ? '#f59e0b'
      : hasActiveFall
        ? '#ef4444'
        : '#22c55e';

  const statusDescription = loading
    ? 'Memuat...'
    : !hasLansia
      ? 'Tambahkan data lansia terlebih dahulu agar dashboard menampilkan monitoring yang relevan.'
      : !hasDevice
        ? 'Data lansia sudah tersimpan, tetapi device belum terhubung. Pilih device pada halaman Kelola Lansia.'
        : hasActiveFall
          ? 'Terdeteksi kemungkinan jatuh!'
          : 'Tidak ada indikasi jatuh yang terdeteksi.';

  const severityStyle = (sev: string) => {
    if (sev === 'danger') return styles.logStatusDanger;
    if (sev === 'warning') return styles.logStatusWarning;
    return styles.logStatusSafe;
  };
  const severityLabel = (sev: string) => {
    if (sev === 'danger') return 'Bahaya';
    if (sev === 'warning') return 'Perhatian';
    return 'Normal';
  };

  return (
    <DashboardLayout
      role="customer"
      title="Customer Dashboard"
      subtitle="Monitoring lansia secara real-time"
    >
      <section style={styles.content}>
        <div style={{ ...styles.welcomeCard, ...(isMobile ? styles.welcomeCardMobile : {}) }}>
          <div style={styles.welcomeContent}>
            <p style={styles.welcomeLabel}>Selamat Datang</p>
            <h2 style={styles.welcomeTitle}>Monitoring Lansia Hari Ini</h2>
            <p style={styles.welcomeText}>
              Pantau kondisi lansia, lokasi terakhir, baterai device, dan
              notifikasi darurat dalam satu dashboard.
            </p>
          </div>
          <div
            style={{
              ...styles.statusPill,
              ...(isMobile ? styles.statusPillMobile : {}),
              color: statusColor,
              backgroundColor: '#ffffff',
            }}
          >
            <span style={{ ...styles.statusDot, backgroundColor: statusDotColor }} />
            {loading ? '—' : statusLabel}
          </div>
        </div>

        <div style={{ ...styles.cardGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Status Saat Ini</p>
            <h3 style={{ ...styles.cardValue, color: loading ? '#94a3b8' : statusColor }}>
              {loading ? '—' : statusLabel}
            </h3>
            <p style={styles.cardDescription}>{statusDescription}</p>
          </div>

          {(loading || hasMonitoringConnection) && (
            <>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Battery Device</p>
                <h3 style={styles.cardValue}>
                  {loading ? '—' : device ? `${device.batteryLevel}%` : '—'}
                </h3>
                <p style={styles.cardDescription}>
                  {device?.isOnline ? 'Device online dan aktif.' : 'Device sedang offline.'}
                </p>
              </div>

              <div style={styles.card}>
                <p style={styles.cardLabel}>Lokasi Terakhir</p>
                <h3 style={styles.cardValue}>
                  {loading ? '—' : device?.locationName ?? '—'}
                </h3>
                <p style={styles.cardDescription}>
                  {device ? `Update: ${timeAgo(device.lastSeen)}` : 'Belum ada data.'}
                </p>
              </div>

              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Logs Bulan Ini</p>
                <h3 style={styles.cardValue}>{loading ? '—' : incidents.length}</h3>
                <p style={styles.cardDescription}>
                  Total histori kejadian yang tersimpan.
                </p>
              </div>
            </>
          )}

          {(!loading && hasLansia && !hasDevice) && (
            <>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Lansia</p>
                <h3 style={styles.cardValue}>{lansiaList.length}</h3>
                <p style={styles.cardDescription}>
                  Jumlah lansia yang sudah kamu daftarkan.
                </p>
              </div>

              <div style={styles.card}>
                <p style={styles.cardLabel}>Lansia Aktif</p>
                <h3 style={styles.cardValue}>
                  {lansiaList.filter((l) => l.status === 'Aktif').length}
                </h3>
                <p style={styles.cardDescription}>
                  Lansia dengan status Aktif Dipantau.
                </p>
              </div>

              <div style={styles.card}>
                <p style={styles.cardLabel}>Status Device</p>
                <h3 style={{ ...styles.cardValue, color: '#92400e' }}>
                  Belum Terhubung
                </h3>
                <p style={styles.cardDescription}>
                  Hubungkan device di halaman Kelola Lansia agar dashboard bisa menampilkan baterai dan lokasi.
                </p>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div style={{ ...styles.bottomGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
            <div style={styles.largeCard}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Ringkasan Monitoring</h3>
                <span style={styles.sectionBadge}>Real-time</span>
              </div>
              <div style={styles.loadingBox}><Loader size={20} color="#94a3b8" /></div>
            </div>

            <div style={styles.largeCard}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Riwayat Terbaru</h3>
                <span style={styles.sectionBadgeAlt}>History</span>
              </div>
              <div style={styles.loadingBox}><Loader size={20} color="#94a3b8" /></div>
            </div>
          </div>
        ) : !hasLansia ? (
          <div style={styles.emptyStateCard}>
            <p style={styles.emptyStateLabel}>Dashboard Belum Siap</p>
            <h3 style={styles.emptyStateTitle}>Belum ada data lansia</h3>
            <p style={styles.emptyStateDescription}>
              Tambahkan data lansia terlebih dahulu agar dashboard bisa menampilkan status monitoring, device, dan history.
            </p>
            <div style={styles.emptyStateActions}>
              <Link href="/customer/lansia" style={styles.emptyStatePrimary}>
                Tambah Data Lansia
              </Link>
              <Link href="/customer/logs" style={styles.emptyStateSecondary}>
                Buka History
              </Link>
            </div>
          </div>
        ) : !hasDevice ? (
          <div style={styles.emptyStateCard}>
            <p style={styles.emptyStateLabel}>Device Belum Siap</p>
            <h3 style={styles.emptyStateTitle}>Data lansia sudah ada, device belum terhubung</h3>
            <p style={styles.emptyStateDescription}>
              Buka Kelola Lansia, lalu pilih device yang tersedia untuk mengaktifkan monitoring real-time.
            </p>
            <div style={styles.emptyStateActions}>
              <Link href="/customer/lansia" style={styles.emptyStatePrimary}>
                Hubungkan Device
              </Link>
              <Link href="/customer/logs" style={styles.emptyStateSecondary}>
                Buka History
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ ...styles.bottomGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
            <div style={styles.largeCard}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Ringkasan Monitoring</h3>
                <span style={styles.sectionBadge}>Real-time</span>
              </div>

              <div style={styles.summaryList}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Nama Lansia</span>
                  <span style={styles.summaryValue}>{firstLansia?.nama ?? '—'}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Serial Device</span>
                  <span style={styles.summaryValue}>{firstLansia?.deviceId ?? '—'}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Last Update</span>
                  <span style={styles.summaryValue}>{device ? timeAgo(device.lastSeen) : '—'}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Kontak Darurat</span>
                  <span style={styles.summaryValue}>
                    {currentEmergency
                      ? `${currentEmergency.contactName} (${currentEmergency.contactPhone})`
                      : '—'}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Total Lansia</span>
                  <span style={styles.summaryValue}>{lansiaList.length} terdaftar</span>
                </div>
              </div>
            </div>

            <div style={styles.largeCard}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Riwayat Terbaru</h3>
                <span style={styles.sectionBadgeAlt}>History</span>
              </div>

              {recentIncidents.length === 0 ? (
                <p style={styles.emptyText}>Belum ada riwayat kejadian.</p>
              ) : (
                recentIncidents.map((inc) => (
                  <div key={inc.id} style={styles.logItem}>
                    <div>
                      <p style={styles.logTitle}>{inc.description.slice(0, 50)}...</p>
                      <p style={styles.logTime}>{formatTimestamp(inc.timestamp)}</p>
                    </div>
                    <span style={severityStyle(inc.severity)}>{severityLabel(inc.severity)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  welcomeCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  welcomeCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  welcomeContent: { flex: 1, minWidth: 0 },
  welcomeLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  welcomeTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
  welcomeText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', maxWidth: '700px' },
  statusPill: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, fontSize: '15px' },
  statusPillMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '999px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', minWidth: 0 },
  cardLabel: { margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 600 },
  cardValue: { margin: '12px 0 10px', fontSize: '30px', fontWeight: 800, color: '#0f172a', wordBreak: 'break-word' },
  cardDescription: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#475569' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  largeCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', minWidth: 0 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  sectionBadgeAlt: { backgroundColor: '#f1f5f9', color: '#334155', padding: '8px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  summaryList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', gap: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  summaryLabel: { color: '#64748b', fontSize: '14px' },
  summaryValue: { color: '#0f172a', fontSize: '15px', fontWeight: 700, wordBreak: 'break-word' },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  logTitle: { margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' },
  logTime: { margin: '6px 0 0', fontSize: '12px', color: '#64748b' },
  logStatusDanger: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' },
  logStatusSafe: { backgroundColor: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' },
  logStatusWarning: { backgroundColor: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '24px 0' },
  emptyText: { margin: 0, fontSize: '14px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' },
  emptyStateCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '28px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' },
  emptyStateLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb' },
  emptyStateTitle: { margin: 0, fontSize: '28px', lineHeight: 1.2, fontWeight: 800, color: '#0f172a' },
  emptyStateDescription: { margin: 0, fontSize: '15px', lineHeight: 1.8, color: '#475569', maxWidth: '720px' },
  emptyStateActions: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' },
  emptyStatePrimary: { textDecoration: 'none', backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 18px', borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
  emptyStateSecondary: { textDecoration: 'none', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
};
