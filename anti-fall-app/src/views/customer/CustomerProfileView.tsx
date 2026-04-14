import Image from 'next/image';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserById, saveUserProfile } from '../../services/userService';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function CustomerProfileView() {
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [relationship, setRelationship] = useState('');
  const [photoURL, setPhotoURL] = useState('/images/logo.png');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const profile = await getUserById(user.uid);
        setFullName(profile?.fullName || user.displayName || 'Customer');
        setEmail(profile?.email || user.email || '');
        setPhone(profile?.phone || '');
        setAddress(profile?.address || '');
        setRelationship(profile?.relationship || '');
        setPhotoURL(profile?.photoURL || user.photoURL || '/images/logo.png');
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [user, authLoading]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveUserProfile(user.uid, {
        fullName,
        email,
        phone,
        address,
        relationship,
        role: 'customer',
        photoURL: photoURL || '/images/logo.png',
      });
      await showSuccessAlert('Profile customer berhasil disimpan');
    } catch (error) {
      console.error('Gagal menyimpan profile customer:', error);
      await showErrorAlert('Profile customer gagal disimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="customer"
      title="My Profile"
      subtitle="Informasi akun dan data pendamping lansia"
    >
      <section style={styles.content}>
        <div style={{ ...styles.heroCard, ...(isMobile ? styles.heroCardMobile : {}) }}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Customer Profile</p>
            <h2 style={styles.heroTitle}>Profil Pengguna</h2>
            <p style={styles.heroText}>
              Kelola informasi akun dan data pendamping yang terhubung dengan
              sistem monitoring lansia.
            </p>
          </div>

          <div style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
            <ShieldCheck size={18} />
            <span>Customer Account</span>
          </div>
        </div>

        <div style={{ ...styles.grid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <div style={styles.formCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Informasi Akun</h3>
              <span style={styles.sectionBadge}>Editable</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <User size={16} />
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  placeholder="Nama lengkap"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <Mail size={16} />
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="Email"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nomor WhatsApp</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <Phone size={16} />
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  placeholder="Nomor WhatsApp"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Alamat / Kota</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <MapPin size={16} />
                </span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                  placeholder="Alamat / Kota"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Hubungan dengan Lansia</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <ShieldCheck size={16} />
                </span>
                <input
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={styles.input}
                  placeholder="Contoh: Anak"
                />
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <Loader size={22} color="#94a3b8" />
              </div>
            ) : (
              <button
                onClick={handleSave}
                style={{ ...styles.saveButton, opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                {saving ? <Loader size={16} /> : <Save size={16} />}
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            )}
          </div>

          <div style={styles.sideCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Ringkasan Profil</h3>
              <span style={styles.sectionBadgeAlt}>Preview</span>
            </div>

            <div style={styles.profileBox}>
              <div style={styles.avatarImageWrap}>
                <Image
                  src={photoURL || '/images/logo.png'}
                  alt={fullName || 'Customer profile'}
                  width={72}
                  height={72}
                  style={styles.avatarImage}
                />
              </div>
              <h4 style={styles.profileName}>{fullName}</h4>
              <p style={styles.profileRole}>Customer</p>
            </div>

            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Email</span>
                <span style={styles.summaryValue}>{email}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>WhatsApp</span>
                <span style={styles.summaryValue}>{phone}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Kota</span>
                <span style={styles.summaryValue}>{address}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Hubungan</span>
                <span style={styles.summaryValue}>{relationship}</span>
              </div>
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteTitle}>Catatan</p>
              <p style={styles.noteText}>
                Pastikan data profil dan nomor kontak selalu aktif agar
                notifikasi darurat bisa diterima dengan baik.
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
  heroCardMobile: { flexDirection: 'column', alignItems: 'flex-start' },
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
  heroBadgeMobile: { alignSelf: 'flex-start', marginTop: '4px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '20px',
    marginTop: '24px',
  },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  formCard: {
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
    marginBottom: '18px',
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
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    padding: '18px 0 6px',
  },
  saveButton: {
    marginTop: '6px',
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
  profileBox: {
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  avatarImageWrap: {
    width: '72px',
    height: '72px',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a',
  },
  profileRole: {
    margin: '6px 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
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
  noteBox: {
    marginTop: '20px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    padding: '16px',
  },
  noteTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    color: '#1d4ed8',
  },
  noteText: {
    margin: '8px 0 0',
    fontSize: '13px',
    lineHeight: 1.7,
    color: '#334155',
  },
};
