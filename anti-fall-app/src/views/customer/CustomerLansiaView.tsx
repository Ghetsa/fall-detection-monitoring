import { useState, useEffect, CSSProperties, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Users, Plus, Edit2, Trash2, X, Save, User, Phone,
  Calendar, Heart, Cpu, AlertCircle, Search, ChevronDown, Activity, Loader,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getLansiaByCustomer, addLansia, updateLansia, deleteLansia } from '../../services/lansiaService';
import { Lansia, LansiaFormData } from '../../types/lansia';
import { useIsMobile } from '../../hooks/useIsMobile';

const emptyForm: LansiaFormData = {
  customerId: '',
  nama: '',
  usia: 60,
  jenisKelamin: 'Perempuan',
  alamat: '',
  noHp: '',
  kontakDarurat: '',
  namaKontakDarurat: '',
  kondisiKesehatan: '',
  deviceSerial: '',
  deviceId: '',
  status: 'Aktif',
  catatan: '',
};

export default function CustomerLansiaView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Lansia | null>(null);
  const [form, setForm] = useState<LansiaFormData>(emptyForm);
  const [detailTarget, setDetailTarget] = useState<Lansia | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLansiaByCustomer(user.uid);
      setLansiaList(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = lansiaList.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      (l.nama.toLowerCase().includes(q) || l.deviceSerial.toLowerCase().includes(q)) &&
      (filterStatus === 'Semua' || l.status === filterStatus)
    );
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, customerId: user?.uid ?? '' });
    setModalOpen(true);
  };

  const openEdit = (lansia: Lansia) => {
    setEditTarget(lansia);
    setForm({
      customerId: lansia.customerId,
      nama: lansia.nama,
      usia: lansia.usia,
      jenisKelamin: lansia.jenisKelamin,
      alamat: lansia.alamat,
      noHp: lansia.noHp,
      kontakDarurat: lansia.kontakDarurat,
      namaKontakDarurat: lansia.namaKontakDarurat,
      kondisiKesehatan: lansia.kondisiKesehatan,
      deviceSerial: lansia.deviceSerial,
      deviceId: lansia.deviceId,
      status: lansia.status,
      catatan: lansia.catatan,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim() || !user) return;
    setSaving(true);
    try {
      if (editTarget) {
        await updateLansia(editTarget.id, form);
      } else {
        await addLansia({ ...form, customerId: user.uid });
      }
      await loadData();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteLansia(id);
      await loadData();
      setDeleteConfirmId(null);
    } finally {
      setSaving(false);
    }
  };

  const totalAktif = lansiaList.filter((l) => l.status === 'Aktif').length;
  const totalNonaktif = lansiaList.filter((l) => l.status === 'Nonaktif').length;

  return (
    <DashboardLayout role="customer" title="Kelola Lansia" subtitle="Manajemen data lansia yang dipantau">
      <section style={styles.content}>
        {/* Hero */}
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Manajemen Lansia</p>
            <h2 style={styles.heroTitle}>Kelola Data Lansia</h2>
            <p style={styles.heroText}>
              Tambah, ubah, dan pantau data lansia yang terdaftar dalam sistem monitoring anti-jatuh.
            </p>
          </div>
          <div style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
            <Users size={18} />
            <span>{lansiaList.length} Lansia Terdaftar</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ ...styles.statsRow, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          {[
            { label: 'Total Lansia', value: lansiaList.length, bg: '#eff6ff', icon: <Users size={20} color="#2563eb" /> },
            { label: 'Aktif Dipantau', value: totalAktif, bg: '#dcfce7', icon: <Activity size={20} color="#16a34a" /> },
            { label: 'Nonaktif', value: totalNonaktif, bg: '#fef3c7', icon: <AlertCircle size={20} color="#d97706" /> },
            { label: 'Device Terhubung', value: totalAktif, bg: '#f3e8ff', icon: <Cpu size={20} color="#7c3aed" /> },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: s.bg }}>{s.icon}</div>
              <div>
                <p style={styles.statLabel}>{s.label}</p>
                <p style={styles.statValue}>{loading ? '—' : s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input style={styles.searchInput} placeholder="Cari nama atau serial device..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div style={styles.filterWrap}>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 12, pointerEvents: 'none' }} />
            <select style={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
          <button style={styles.addButton} onClick={openAdd}>
            <Plus size={16} /><span>Tambah Lansia</span>
          </button>
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Daftar Lansia</h3>
            <span style={styles.tableBadge}>{filtered.length} data</span>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  {['Nama', 'Usia', 'No. HP', 'Kontak Darurat', 'Serial Device', 'Status', 'Aksi'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={styles.emptyCell}>
                    <div style={styles.emptyState}><Loader size={28} color="#94a3b8" /><p style={styles.emptyText}>Memuat data...</p></div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={styles.emptyCell}>
                    <div style={styles.emptyState}><Users size={40} color="#cbd5e1" /><p style={styles.emptyText}>Tidak ada data lansia ditemukan.</p></div>
                  </td></tr>
                ) : filtered.map((lansia, idx) => (
                  <tr key={lansia.id} style={{ ...styles.tr, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={styles.avatarSmall}>{lansia.nama.charAt(0)}</div>
                        <div><p style={styles.nameText}>{lansia.nama}</p><p style={styles.genderText}>{lansia.jenisKelamin}</p></div>
                      </div>
                    </td>
                    <td style={styles.td}><span style={styles.ageBadge}>{lansia.usia} th</span></td>
                    <td style={styles.td}><span style={styles.cellText}>{lansia.noHp}</span></td>
                    <td style={styles.td}>
                      <p style={styles.cellText}>{lansia.namaKontakDarurat}</p>
                      <p style={styles.cellSubtext}>{lansia.kontakDarurat}</p>
                    </td>
                    <td style={styles.td}><span style={styles.deviceBadge}>{lansia.deviceSerial || '—'}</span></td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, backgroundColor: lansia.status === 'Aktif' ? '#dcfce7' : '#fee2e2', color: lansia.status === 'Aktif' ? '#166534' : '#b91c1c' }}>
                        {lansia.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <button style={styles.btnDetail} onClick={() => setDetailTarget(lansia)} title="Detail"><User size={14} /></button>
                        <button style={styles.btnEdit} onClick={() => openEdit(lansia)} title="Edit"><Edit2 size={14} /></button>
                        <button style={styles.btnDelete} onClick={() => setDeleteConfirmId(lansia.id)} title="Hapus"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <div style={styles.overlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editTarget ? 'Edit Data Lansia' : 'Tambah Lansia Baru'}</h3>
              <button style={styles.closeBtn} onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div style={styles.modalBody}>
              <div style={{ ...styles.formGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
                {([
                  { label: 'Nama Lengkap *', key: 'nama', icon: <User size={15} />, type: 'text', placeholder: 'Nama lengkap lansia' },
                  { label: 'Usia', key: 'usia', icon: <Calendar size={15} />, type: 'number', placeholder: '60' },
                  { label: 'No. HP Lansia', key: 'noHp', icon: <Phone size={15} />, type: 'text', placeholder: '08xxxxxxxxxx' },
                  { label: 'Serial Device', key: 'deviceSerial', icon: <Cpu size={15} />, type: 'text', placeholder: 'ESP32-XXX' },
                  { label: 'Nama Kontak Darurat', key: 'namaKontakDarurat', icon: <User size={15} />, type: 'text', placeholder: 'Nama keluarga' },
                  { label: 'No. Kontak Darurat', key: 'kontakDarurat', icon: <Phone size={15} />, type: 'text', placeholder: '08xxxxxxxxxx' },
                ] as const).map(({ label, key, icon, type, placeholder }) => (
                  <div key={key} style={styles.fieldGroup}>
                    <label style={styles.label}>{label}</label>
                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>{icon}</span>
                      <input style={styles.input} type={type} placeholder={placeholder}
                        value={form[key] as string | number}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      />
                    </div>
                  </div>
                ))}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Jenis Kelamin</label>
                  <div style={{ ...styles.inputWrap, position: 'relative' }}>
                    <span style={styles.inputIcon}><User size={15} /></span>
                    <select style={{ ...styles.input, appearance: 'none' }} value={form.jenisKelamin}
                      onChange={(e) => setForm((f) => ({ ...f, jenisKelamin: e.target.value as Lansia['jenisKelamin'] }))}>
                      <option value="Perempuan">Perempuan</option>
                      <option value="Laki-laki">Laki-laki</option>
                    </select>
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Status</label>
                  <div style={{ ...styles.inputWrap, position: 'relative' }}>
                    <span style={styles.inputIcon}><Activity size={15} /></span>
                    <select style={{ ...styles.input, appearance: 'none' }} value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Lansia['status'] }))}>
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>
              {[
                { label: 'Alamat Lengkap', key: 'alamat', icon: <AlertCircle size={15} />, placeholder: 'Jl....' },
                { label: 'Kondisi Kesehatan', key: 'kondisiKesehatan', icon: <Heart size={15} />, placeholder: 'Hipertensi, Diabetes...' },
              ].map(({ label, key, icon, placeholder }) => (
                <div key={key} style={{ ...styles.fieldGroup, marginTop: '12px' }}>
                  <label style={styles.label}>{label}</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>{icon}</span>
                    <input style={styles.input} placeholder={placeholder} value={form[key as keyof LansiaFormData] as string}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  </div>
                </div>
              ))}
              <div style={{ ...styles.fieldGroup, marginTop: '12px' }}>
                <label style={styles.label}>Catatan Tambahan</label>
                <textarea style={styles.textarea} rows={3} placeholder="Instruksi khusus..." value={form.catatan}
                  onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setModalOpen(false)}>Batal</button>
              <button style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
                {saving ? <Loader size={15} /> : <Save size={15} />}
                <span>{editTarget ? 'Simpan Perubahan' : 'Tambah Lansia'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detailTarget && (
        <div style={styles.overlay} onClick={() => setDetailTarget(null)}>
          <div style={{ ...styles.modal, maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detail Lansia</h3>
              <button style={styles.closeBtn} onClick={() => setDetailTarget(null)}><X size={18} /></button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailAvatarBox}>
                <div style={styles.detailAvatar}>{detailTarget.nama.charAt(0)}</div>
                <div>
                  <h4 style={styles.detailName}>{detailTarget.nama}</h4>
                  <p style={styles.detailSub}>{detailTarget.jenisKelamin} • {detailTarget.usia} tahun</p>
                  <span style={{ ...styles.statusBadge, backgroundColor: detailTarget.status === 'Aktif' ? '#dcfce7' : '#fee2e2', color: detailTarget.status === 'Aktif' ? '#166534' : '#b91c1c' }}>
                    {detailTarget.status}
                  </span>
                </div>
              </div>
              <div style={styles.detailGrid}>
                {[
                  { icon: <Phone size={14} />, label: 'No. HP', value: detailTarget.noHp || '—' },
                  { icon: <AlertCircle size={14} />, label: 'Alamat', value: detailTarget.alamat || '—' },
                  { icon: <Heart size={14} />, label: 'Kondisi Kesehatan', value: detailTarget.kondisiKesehatan || '—' },
                  { icon: <Cpu size={14} />, label: 'Serial Device', value: detailTarget.deviceSerial || '—', highlight: true },
                  { icon: <User size={14} />, label: 'Kontak Darurat', value: `${detailTarget.namaKontakDarurat} (${detailTarget.kontakDarurat})` },
                ].map(({ icon, label, value, highlight }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' as const }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
                      {icon}<span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: highlight ? '#1d4ed8' : '#0f172a', backgroundColor: highlight ? '#eff6ff' : 'transparent', padding: highlight ? '4px 10px' : undefined, borderRadius: highlight ? 8 : undefined, fontFamily: highlight ? 'monospace' : undefined, textAlign: 'right' as const, maxWidth: 260, wordBreak: 'break-word' as const }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {detailTarget.catatan && (
                <div style={styles.noteBox}><p style={styles.noteTitle}>📋 Catatan</p><p style={styles.noteText}>{detailTarget.catatan}</p></div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.saveBtn} onClick={() => { setDetailTarget(null); openEdit(detailTarget); }}>
                <Edit2 size={15} /><span>Edit Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div style={styles.overlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.confirmIcon}><Trash2 size={28} color="#ef4444" /></div>
            <h4 style={styles.confirmTitle}>Hapus Data Lansia?</h4>
            <p style={styles.confirmText}>Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari database.</p>
            <div style={styles.confirmActions}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)}>Batal</button>
              <button style={{ ...styles.deleteConfirmBtn, opacity: saving ? 0.6 : 1 }} onClick={() => handleDelete(deleteConfirmId)} disabled={saving}>
                <Trash2 size={14} /><span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroContent: { flex: 1, minWidth: 0 },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', maxWidth: '700px' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px' },
  heroBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  statCard: { backgroundColor: '#ffffff', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' },
  statIcon: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLabel: { margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 600 },
  statValue: { margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#0f172a' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' },
  searchWrap: { flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '44px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a', backgroundColor: 'transparent' },
  filterWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  filterSelect: { height: '44px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 36px 0 14px', fontSize: '14px', color: '#334155', fontWeight: 600, backgroundColor: '#ffffff', cursor: 'pointer', outline: 'none', appearance: 'none' },
  addButton: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '0 20px', height: '44px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.06)', border: '1px solid #e2e8f0', marginTop: '20px', overflow: 'hidden' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  tableTitle: { margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  tableBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
  theadRow: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 14px', fontSize: '14px', color: '#334155' },
  emptyCell: { padding: '48px 24px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  emptyText: { margin: 0, fontSize: '15px', color: '#94a3b8', fontWeight: 600 },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatarSmall: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nameText: { margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' },
  genderText: { margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' },
  ageBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 },
  cellText: { margin: 0, fontSize: '13px', color: '#334155', fontWeight: 600 },
  cellSubtext: { margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' },
  deviceBadge: { backgroundColor: '#f5f3ff', color: '#6d28d9', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' },
  statusBadge: { padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' },
  actionRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  btnDetail: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnEdit: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#fef9c3', color: '#ca8a04', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnDelete: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
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
  textarea: { width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#0f172a', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  saveBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  confirmModal: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '32px 28px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(15,23,42,0.2)' },
  confirmIcon: { width: '64px', height: '64px', borderRadius: '999px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  confirmTitle: { margin: '0 0 10px', fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  confirmText: { margin: '0 0 24px', fontSize: '14px', lineHeight: 1.7, color: '#64748b' },
  confirmActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
  deleteConfirmBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  detailAvatarBox: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', marginBottom: '20px' },
  detailAvatar: { width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  detailName: { margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  detailSub: { margin: '0 0 8px', fontSize: '14px', color: '#64748b' },
  detailGrid: { display: 'flex', flexDirection: 'column' },
  noteBox: { marginTop: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', padding: '14px 16px' },
  noteTitle: { margin: '0 0 6px', fontSize: '13px', fontWeight: 700, color: '#1d4ed8' },
  noteText: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: '#334155' },
};
