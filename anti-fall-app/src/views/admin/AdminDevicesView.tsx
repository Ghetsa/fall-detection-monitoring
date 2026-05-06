import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { addDevice, getAllDevices } from '../../services/deviceService';
import { Device } from '../../types/device';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  Activity,
  Battery,
  Cpu,
  Loader,
  MapPin,
  Plus,
  Save,
  Search,
  Wifi,
  X,
} from 'lucide-react';

type DeviceFormState = {
  serial: string;
  model: string;
  firmware: string;
  locationName: string;
  batteryLevel: number;
  isOnline: boolean;
  latitude: number;
  longitude: number;
};

const emptyForm: DeviceFormState = {
  serial: '',
  model: 'ESP32-WROOM-32',
  firmware: 'v2.1.0',
  locationName: '',
  batteryLevel: 100,
  isOnline: true,
  latitude: 0,
  longitude: 0,
};

export default function AdminDevicesView() {
  const isMobile = useIsMobile();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<DeviceFormState>(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllDevices();
      setDevices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredDevices = devices.filter((device) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;

    return (
      device.serial.toLowerCase().includes(keyword) ||
      device.locationName.toLowerCase().includes(keyword) ||
      device.model.toLowerCase().includes(keyword)
    );
  });

  const handleSave = async () => {
    if (!form.serial.trim()) {
      await showErrorAlert('Serial device wajib diisi');
      return;
    }

    setSaving(true);
    try {
      await addDevice({
        serial: form.serial.trim().toUpperCase(),
        lansiaId: '',
        batteryLevel: Number(form.batteryLevel) || 0,
        isOnline: form.isOnline,
        lastSeen: new Date(),
        firmware: form.firmware.trim() || 'v2.1.0',
        model: form.model.trim() || 'ESP32-WROOM-32',
        latitude: Number(form.latitude) || 0,
        longitude: Number(form.longitude) || 0,
        locationName: form.locationName.trim() || '-',
      });

      await showSuccessAlert('Device berhasil ditambahkan');
      setForm(emptyForm);
      setModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Gagal menambahkan device:', error);
      await showErrorAlert('Tambah device gagal', 'Data device tidak berhasil disimpan.');
    } finally {
      setSaving(false);
    }
  };

  const connectedCount = devices.filter((device) => device.isOnline).length;
  const assignedCount = devices.filter((device) => device.lansiaId).length;

  return (
    <DashboardLayout
      role="admin"
      title="Devices"
      subtitle="Kelola device monitoring yang terhubung ke sistem"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div>
            <p style={styles.heroLabel}>Devices</p>
            <h2 style={styles.heroTitle}>Manajemen Device</h2>
            <p style={styles.heroText}>
              Tambah device baru, pantau status koneksi, dan lihat device yang sudah dipakai.
            </p>
          </div>

          <div style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
            <Cpu size={18} />
            <span>{loading ? '—' : `${devices.length} Devices`}</span>
          </div>
        </div>

        <div style={{ ...styles.statsGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.statCard}>
            <span style={styles.statIconBlue}><Cpu size={18} /></span>
            <div>
              <p style={styles.statLabel}>Total Device</p>
              <h3 style={styles.statValue}>{loading ? '—' : devices.length}</h3>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIconGreen}><Wifi size={18} /></span>
            <div>
              <p style={styles.statLabel}>Online</p>
              <h3 style={styles.statValue}>{loading ? '—' : connectedCount}</h3>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIconPurple}><Activity size={18} /></span>
            <div>
              <p style={styles.statLabel}>Sudah Dipakai</p>
              <h3 style={styles.statValue}>{loading ? '—' : assignedCount}</h3>
            </div>
          </div>
        </div>

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={15} color="#94a3b8" />
            <input
              style={styles.searchInput}
              placeholder="Cari serial, lokasi, atau model device..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button style={styles.addButton} onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            <span>Tambah Device</span>
          </button>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Daftar Device</h3>
              <p style={styles.sectionText}>Device yang tersedia untuk dipakai atau sudah terhubung.</p>
            </div>
            <span style={styles.tableBadge}>{filteredDevices.length} data</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Serial</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Lokasi</th>
                  <th style={styles.th}>Battery</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Dipakai</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={styles.emptyCell}>
                      <div style={styles.emptyState}><Loader size={24} color="#94a3b8" /></div>
                    </td>
                  </tr>
                ) : filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={styles.emptyCell}>
                      <div style={styles.emptyState}>
                        <p style={styles.emptyText}>Belum ada data device.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => (
                    <tr key={device.id} style={styles.tr}>
                      <td style={styles.td}><span style={styles.serialBadge}>{device.serial}</span></td>
                      <td style={styles.td}>{device.model}</td>
                      <td style={styles.td}>{device.locationName || '—'}</td>
                      <td style={styles.td}>{device.batteryLevel}%</td>
                      <td style={styles.td}>
                        <span style={device.isOnline ? styles.statusOnline : styles.statusOffline}>
                          {device.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={device.lansiaId ? styles.statusAssigned : styles.statusAvailable}>
                          {device.lansiaId ? 'Dipakai' : 'Tersedia'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modalOpen ? (
        <div style={styles.overlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Tambah Device Baru</h3>
              <button style={styles.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={{ ...styles.formGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
                {[
                  { label: 'Serial Device *', key: 'serial', icon: <Cpu size={15} />, type: 'text', placeholder: 'ESP32-004' },
                  { label: 'Model', key: 'model', icon: <Cpu size={15} />, type: 'text', placeholder: 'ESP32-WROOM-32' },
                  { label: 'Firmware', key: 'firmware', icon: <Activity size={15} />, type: 'text', placeholder: 'v2.1.0' },
                  { label: 'Lokasi', key: 'locationName', icon: <MapPin size={15} />, type: 'text', placeholder: 'Bandar Lampung' },
                  { label: 'Battery Level', key: 'batteryLevel', icon: <Battery size={15} />, type: 'number', placeholder: '100' },
                  { label: 'Latitude', key: 'latitude', icon: <MapPin size={15} />, type: 'number', placeholder: '-5.4292' },
                  { label: 'Longitude', key: 'longitude', icon: <MapPin size={15} />, type: 'number', placeholder: '105.2610' },
                ].map(({ label, key, icon, type, placeholder }) => (
                  <div key={key} style={styles.fieldGroup}>
                    <label style={styles.label}>{label}</label>
                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>{icon}</span>
                      <input
                        style={styles.input}
                        type={type}
                        placeholder={placeholder}
                        value={String(form[key as keyof DeviceFormState])}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            [key]:
                              type === 'number'
                                ? Number(e.target.value)
                                : e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Status Koneksi</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}><Wifi size={15} /></span>
                    <select
                      style={{ ...styles.input, appearance: 'none' }}
                      value={form.isOnline ? 'online' : 'offline'}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          isOnline: e.target.value === 'online',
                        }))
                      }
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button
                style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader size={15} /> : <Save size={15} />}
                <span>Tambah Device</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, display: 'inline-flex', gap: '8px', alignItems: 'center' },
  heroBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  statCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center' },
  statIconBlue: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statIconGreen: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statIconPurple: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLabel: { margin: 0, fontSize: '14px', color: '#64748b' },
  statValue: { margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: '#0f172a' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' },
  searchBox: { display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '42px', backgroundColor: '#f8fafc', flex: 1, minWidth: '220px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', width: '100%', color: '#0f172a' },
  addButton: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '0 20px', height: '42px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  tableCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionText: { margin: '6px 0 0', fontSize: '14px', color: '#64748b' },
  tableBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '820px' },
  th: { textAlign: 'left', padding: '12px', fontSize: '13px', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px 12px', fontSize: '14px', color: '#0f172a' },
  serialBadge: { backgroundColor: '#f5f3ff', color: '#6d28d9', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' },
  statusOnline: { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  statusOffline: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  statusAssigned: { backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  statusAvailable: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  emptyCell: { padding: '48px 0', textAlign: 'center' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  emptyText: { margin: 0, color: '#94a3b8', fontSize: '15px' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(15,23,42,0.2)', overflow: 'hidden' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  closeBtn: { width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },
  modalBody: { padding: '20px 24px', overflowY: 'auto', flex: 1 },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #e2e8f0' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { marginBottom: '0' },
  label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff' },
  inputIcon: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', flexShrink: 0 },
  input: { width: '100%', border: 'none', outline: 'none', padding: '10px 12px', fontSize: '14px', color: '#0f172a', backgroundColor: '#ffffff' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  saveBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
};
