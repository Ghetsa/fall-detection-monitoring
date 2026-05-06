// src/views/customer/CustomerEmergencyView.tsx
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Smartphone, Users, Siren, ShieldCheck, Loader, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getLansiaByCustomer, updateLansia } from '../../services/lansiaService';
import {
  getEmergencyByCustomer,
  saveEmergencyContact,
  updateEmergencyContact,
} from '../../services/emergencyService';
import { Lansia } from '../../types/lansia';
import { EmergencyContact } from '../../types/emergency';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function CustomerEmergencyView() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [emergencyList, setEmergencyList] = useState<EmergencyContact[]>([]);
  const [selectedLansiaId, setSelectedLansiaId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [lansiaData, emergencyData] = await Promise.all([
        getLansiaByCustomer(user.uid),
        getEmergencyByCustomer(user.uid),
      ]);
      setLansiaList(lansiaData);
      setEmergencyList(emergencyData);
      if (lansiaData.length > 0 && !selectedLansiaId) {
        setSelectedLansiaId(lansiaData[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedLansiaId, user]);

  useEffect(() => { loadData(); }, [loadData]);

  // Pre-fill form when lansia selection changes
  useEffect(() => {
    const existing = emergencyList.find((e) => e.lansiaId === selectedLansiaId);
    if (existing) {
      setPhone(existing.contactPhone ?? '');
      setContactName(existing.contactName ?? '');
      setRelationship(existing.relationship ?? '');
    } else {
      setPhone('');
      setContactName('');
      setRelationship('');
    }
    setSaved(false);
  }, [selectedLansiaId, emergencyList]);

  const selectedLansia = lansiaList.find((l) => l.id === selectedLansiaId) ?? null;

  // Backfill lansia.emergencyContactId for legacy data where the emergency doc exists
  // but the lansia doc hasn't been linked yet.
  useEffect(() => {
    if (!selectedLansia) return;
    const existing = emergencyList.find((e) => e.lansiaId === selectedLansia.id);
    if (!existing) return;
    if (selectedLansia.emergencyContactId === existing.id) return;
    void updateLansia(selectedLansia.id, { emergencyContactId: existing.id });
  }, [selectedLansia, emergencyList]);

  const handleSave = async () => {
    if (!user || !selectedLansiaId || !phone.trim()) return;
    setSaving(true);
    try {
      const existing = emergencyList.find((e) => e.lansiaId === selectedLansiaId);
      const payload = {
        lansiaId: selectedLansiaId,
        contactName,
        contactPhone: phone,
        relationship,
        isActive: true,
      };
      if (existing) {
        await updateEmergencyContact(existing.id, payload);
        // Keep lansia -> emergency relation explicit and consistent.
        await updateLansia(selectedLansiaId, { emergencyContactId: existing.id });
      } else {
        const emergencyId = await saveEmergencyContact(payload);
        await updateLansia(selectedLansiaId, { emergencyContactId: emergencyId });
      }
      await loadData();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const currentEmergency = emergencyList.find((e) => e.lansiaId === selectedLansiaId) ?? null;

  return (
    <DashboardLayout
      role="customer"
      title="Emergency Setup"
      subtitle="Pengaturan kontak darurat"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Emergency Contact</p>
            <h2 style={styles.heroTitle}>Kontak Darurat Keluarga</h2>
            <p style={styles.heroText}>
              Tambahkan nomor WhatsApp keluarga agar sistem bisa mengirim
              pemberitahuan otomatis ketika terdeteksi kejadian darurat.
            </p>
          </div>

          <div style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
            <span style={styles.heroBadgeDot} />
            {currentEmergency ? 'Tersimpan' : 'Belum diisi'}
          </div>
        </div>

        {/* Lansia selector */}
        {lansiaList.length > 1 && (
          <div style={styles.selectorRow}>
            {lansiaList.map((l) => (
              <button
                key={l.id}
                style={{
                  ...styles.selectorBtn,
                  backgroundColor: selectedLansiaId === l.id ? '#2563eb' : '#ffffff',
                  color: selectedLansiaId === l.id ? '#ffffff' : '#334155',
                  border: `1px solid ${selectedLansiaId === l.id ? '#2563eb' : '#e2e8f0'}`,
                }}
                onClick={() => setSelectedLansiaId(l.id)}
              >
                {l.nama}
              </button>
            ))}
          </div>
        )}

        <div style={{ ...styles.grid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                Kontak Darurat {selectedLansia ? `— ${selectedLansia.nama}` : ''}
              </h3>
              <p style={styles.cardSubtitle}>
                Gunakan nomor yang aktif dan mudah dihubungi.
              </p>
            </div>

            {loading ? (
              <div style={styles.loadingBox}><Loader size={24} color="#94a3b8" /></div>
            ) : (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Nama Kontak</label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nama keluarga"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.field, marginTop: '14px' }}>
                  <label style={styles.label}>Hubungan</label>
                  <input
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Anak, Cucu, Keponakan..."
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.field, marginTop: '14px' }}>
                  <label style={styles.label}>Nomor WhatsApp</label>
                  <input
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setSaved(false); }}
                    placeholder="Contoh: 081234567890"
                    style={styles.input}
                  />
                  <p style={styles.helperText}>
                    Nomor ini akan menerima notifikasi saat sistem mendeteksi kondisi berbahaya.
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !phone.trim()}
                  style={{ ...styles.button, opacity: saving || !phone.trim() ? 0.6 : 1, backgroundColor: saved ? '#16a34a' : '#2563eb' }}
                >
                  {saving ? <Loader size={16} /> : <Save size={16} />}
                  <span>{saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Kontak'}</span>
                </button>
              </>
            )}
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Informasi Penting</h3>
              <p style={styles.cardSubtitle}>Pastikan kontak darurat sudah benar.</p>
            </div>

            <div style={styles.infoList}>
              {[
                { icon: <Smartphone size={18} />, title: 'Gunakan nomor aktif', text: 'Pastikan nomor WhatsApp masih digunakan dan bisa menerima pesan.' },
                { icon: <Users size={18} />, title: 'Pilih keluarga terdekat', text: 'Disarankan menggunakan nomor keluarga yang bisa merespons cepat.' },
                { icon: <Siren size={18} />, title: 'Notifikasi otomatis', text: 'Sistem akan mengirim peringatan ketika terjadi insiden yang terdeteksi.' },
              ].map(({ icon, title, text }) => (
                <div key={title} style={styles.infoItem}>
                  <span style={styles.infoIcon}>{icon}</span>
                  <div>
                    <p style={styles.infoTitle}>{title}</p>
                    <p style={styles.infoText}>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.previewBox}>
              <div style={styles.previewHeader}>
                <span style={styles.previewIcon}><ShieldCheck size={16} /></span>
                <p style={styles.previewLabel}>Kontak saat ini</p>
              </div>
              {loading ? (
                <p style={styles.previewValue}>—</p>
              ) : currentEmergency ? (
                <>
                  <p style={styles.previewValue}>{currentEmergency.contactName}</p>
                  <p style={{ ...styles.previewValue, fontSize: '13px', color: '#475569' }}>
                    {currentEmergency.contactPhone} · {currentEmergency.relationship}
                  </p>
                </>
              ) : (
                <p style={styles.previewValue}>Belum ada kontak tersimpan</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
  heroContent: { flex: 1, minWidth: 0 },
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', maxWidth: '760px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', color: '#166534', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, fontSize: '15px' },
  heroBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  heroBadgeDot: { width: '10px', height: '10px', borderRadius: '999px', backgroundColor: '#22c55e' },
  selectorRow: { display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' },
  selectorBtn: { borderRadius: '10px', padding: '8px 16px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginTop: '24px' },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  formCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0' },
  infoCard: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0' },
  cardHeader: { marginBottom: '20px' },
  cardTitle: { margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  cardSubtitle: { margin: '8px 0 0', fontSize: '14px', color: '#64748b', lineHeight: 1.6 },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: 700, color: '#334155' },
  input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box' },
  helperText: { margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#64748b' },
  button: { marginTop: '18px', color: '#ffffff', padding: '13px 18px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  infoItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' },
  infoIcon: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  infoText: { margin: '6px 0 0', fontSize: '13px', lineHeight: 1.6, color: '#64748b' },
  previewBox: { marginTop: '20px', backgroundColor: '#eff6ff', borderRadius: '16px', padding: '16px' },
  previewHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
  previewIcon: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  previewLabel: { margin: 0, fontSize: '13px', fontWeight: 700, color: '#1d4ed8' },
  previewValue: { margin: '8px 0 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word' },
};
