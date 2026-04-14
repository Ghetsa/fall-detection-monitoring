import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Building2,
  ChevronDown,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  Users,
  X,
  Loader,
} from 'lucide-react';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';
import {
  addUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserRole,
} from '../../services/userService';
import { AppUser, AppUserFormData } from '../../types/user';

const emptyForm: AppUserFormData = {
  uid: '',
  fullName: '',
  email: '',
  role: 'customer',
  phone: '',
  address: '',
  department: '',
  relationship: '',
  photoURL: '',
};

function generateUserId(email: string) {
  if (email.trim()) return email.trim().toLowerCase();
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}`;
}

export default function AdminUsersView() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'Semua' | 'admin' | 'customer'>(
    'Semua'
  );
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<AppUser | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [form, setForm] = useState<AppUserFormData>(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesQuery =
      !search ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q);
    const matchesRole = filterRole === 'Semua' || u.role === filterRole;

    return (
      matchesQuery &&
      matchesRole
    );
  });

  const totalUsers = users.length;
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user: AppUser) => {
    setEditTarget(user);
    setForm({
      uid: user.uid,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      department: user.department || '',
      relationship: user.relationship || '',
      photoURL: user.photoURL || '',
    });
    setModalOpen(true);
  };

  const handleRoleChange = async (
    uid: string,
    nextRole: AppUser['role']
  ) => {
    const targetUser = users.find((user) => user.uid === uid);

    if (!targetUser || targetUser.role === nextRole) {
      return;
    }

    const previousUsers = users;

    setSavingUserId(uid);
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.uid === uid ? { ...user, role: nextRole } : user
      )
    );

    try {
      await updateUserRole(uid, nextRole);
      await showSuccessAlert(
        'Role berhasil diperbarui',
        `${targetUser.fullName} sekarang memiliki role ${nextRole}.`
      );
    } catch (error) {
      console.error('Gagal memperbarui role user:', error);
      setUsers(previousUsers);
      await showErrorAlert(
        'Update role gagal',
        'Role user tidak berhasil diperbarui.'
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      await showErrorAlert(
        'Data belum lengkap',
        'Nama lengkap dan email wajib diisi.'
      );
      return;
    }

    const payload: AppUserFormData = {
      ...form,
      uid: editTarget ? form.uid : generateUserId(form.email),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone?.trim() || '',
      address: form.address?.trim() || '',
      department: form.department?.trim() || '',
      relationship: form.relationship?.trim() || '',
      photoURL: form.photoURL?.trim() || '',
    };

    setSaving(true);
    try {
      if (editTarget) {
        await updateUser(editTarget.uid, payload);
        await showSuccessAlert('User berhasil diperbarui');
      } else {
        await addUser(payload);
        await showSuccessAlert('User berhasil ditambahkan');
      }

      await loadData();
      setModalOpen(false);
      setEditTarget(null);
      setForm(emptyForm);
    } catch (error) {
      console.error('Gagal menyimpan user:', error);
      await showErrorAlert(
        'Simpan user gagal',
        'Data user tidak berhasil disimpan.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (uid: string) => {
    setSaving(true);
    try {
      await deleteUser(uid);
      await loadData();
      setDeleteConfirmId(null);
      await showSuccessAlert('User berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus user:', error);
      await showErrorAlert(
        'Hapus user gagal',
        'Data user tidak berhasil dihapus.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="admin"
      title="User Management"
      subtitle="Kelola data pengguna dan hak akses"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.heroLabel}>Users</p>
            <h2 style={styles.heroTitle}>Manajemen Pengguna</h2>
            <p style={styles.heroText}>
              Lihat daftar pengguna, peran akun, dan status akses sistem.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <Users size={18} />
            <span>{loading ? '—' : `${totalUsers} Users`}</span>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}><Users size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Total Users</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : totalUsers}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconGreen}><UserCheck size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Customer Accounts</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : customerCount}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryIconBlue}><Shield size={18} /></span>
            <div>
              <p style={styles.summaryLabel}>Admin Accounts</p>
              <h3 style={styles.summaryValue}>{loading ? '—' : adminCount}</h3>
            </div>
          </div>
        </div>

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={15} color="#94a3b8" />
            <input
              style={styles.searchInput}
              placeholder="Cari nama, email, atau nomor HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.filterWrap}>
            <ChevronDown size={14} color="#64748b" style={styles.filterChevron} />
            <select
              style={styles.filterSelect}
              value={filterRole}
              onChange={(e) =>
                setFilterRole(e.target.value as typeof filterRole)
              }
            >
              <option value="Semua">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button style={styles.addButton} onClick={openAdd}>
            <Plus size={16} />
            <span>Tambah User</span>
          </button>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Users List</h3>
              <p style={styles.sectionText}>Daftar akun yang terdaftar di sistem.</p>
            </div>
            <span style={styles.tableBadge}>{filtered.length} data</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <div style={styles.emptyState}><Loader size={24} color="#94a3b8" /></div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <div style={styles.emptyState}><p style={styles.emptyText}>Tidak ada pengguna ditemukan.</p></div>
                  </td></tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.uid} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>{user.fullName.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: 700 }}>{user.fullName}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <div style={styles.roleEditor}>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              void handleRoleChange(
                                user.uid,
                                e.target.value as AppUser['role']
                              )
                            }
                            disabled={savingUserId === user.uid}
                            style={{
                              ...styles.roleSelect,
                              ...(user.role === 'admin'
                                ? styles.roleSelectAdmin
                                : styles.roleSelectCustomer),
                            }}
                          >
                            <option value="customer">customer</option>
                            <option value="admin">admin</option>
                          </select>
                          {savingUserId === user.uid ? (
                            <span style={styles.savingText}>Saving...</span>
                          ) : null}
                        </div>
                      </td>
                      <td style={styles.td}>{user.phone ?? '—'}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadgeActive}>Active</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button
                            style={styles.btnDetail}
                            onClick={() => setDetailTarget(user)}
                            title="Detail"
                          >
                            <User size={14} />
                          </button>
                          <button
                            style={styles.btnEdit}
                            onClick={() => openEdit(user)}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            style={styles.btnDelete}
                            onClick={() => setDeleteConfirmId(user.uid)}
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
              <h3 style={styles.modalTitle}>
                {editTarget ? 'Edit Data User' : 'Tambah User Baru'}
              </h3>
              <button style={styles.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                {([
                  { label: 'Nama Lengkap *', key: 'fullName', icon: <User size={15} />, type: 'text', placeholder: 'Nama lengkap user' },
                  { label: 'Email *', key: 'email', icon: <Mail size={15} />, type: 'email', placeholder: 'user@email.com' },
                  { label: 'No. HP', key: 'phone', icon: <Phone size={15} />, type: 'text', placeholder: '08xxxxxxxxxx' },
                  { label: 'Departemen', key: 'department', icon: <Building2 size={15} />, type: 'text', placeholder: 'Operasional / Keluarga' },
                  { label: 'Relasi', key: 'relationship', icon: <UserCheck size={15} />, type: 'text', placeholder: 'Admin / Anak / Perawat' },
                  { label: 'Photo URL', key: 'photoURL', icon: <Mail size={15} />, type: 'text', placeholder: 'https://...' },
                ] as const).map(({ label, key, icon, type, placeholder }) => (
                  <div key={key} style={styles.fieldGroup}>
                    <label style={styles.label}>{label}</label>
                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>{icon}</span>
                      <input
                        style={styles.input}
                        type={type}
                        placeholder={placeholder}
                        value={form[key] as string}
                        onChange={(e) =>
                          setForm((current) => ({ ...current, [key]: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                ))}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Role</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}><Shield size={15} /></span>
                    <select
                      style={{ ...styles.input, appearance: 'none' }}
                      value={form.role}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          role: e.target.value as AppUser['role'],
                        }))
                      }
                    >
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, marginTop: '12px' }}>
                <label style={styles.label}>Alamat</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}><MapPin size={15} /></span>
                  <input
                    style={styles.input}
                    placeholder="Alamat lengkap user"
                    value={form.address || ''}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, address: e.target.value }))
                    }
                  />
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
                <span>{editTarget ? 'Simpan Perubahan' : 'Tambah User'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {detailTarget ? (
        <div style={styles.overlay} onClick={() => setDetailTarget(null)}>
          <div style={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detail User</h3>
              <button style={styles.closeBtn} onClick={() => setDetailTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailHeader}>
                <div style={styles.detailAvatar}>
                  {detailTarget.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={styles.detailName}>{detailTarget.fullName}</h4>
                  <p style={styles.detailSub}>{detailTarget.email}</p>
                  <span
                    style={
                      detailTarget.role === 'admin'
                        ? styles.roleSelectAdmin
                        : styles.roleSelectCustomer
                    }
                  >
                    {detailTarget.role}
                  </span>
                </div>
              </div>
              <div style={styles.detailGrid}>
                <div style={styles.detailRow}><span>No. HP</span><strong>{detailTarget.phone || '—'}</strong></div>
                <div style={styles.detailRow}><span>Departemen</span><strong>{detailTarget.department || '—'}</strong></div>
                <div style={styles.detailRow}><span>Relasi</span><strong>{detailTarget.relationship || '—'}</strong></div>
                <div style={styles.detailRow}><span>Alamat</span><strong>{detailTarget.address || '—'}</strong></div>
                <div style={styles.detailRow}><span>UID</span><strong>{detailTarget.uid}</strong></div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.saveBtn}
                onClick={() => {
                  setDetailTarget(null);
                  openEdit(detailTarget);
                }}
              >
                <Edit2 size={15} />
                <span>Edit Data</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteConfirmId ? (
        <div style={styles.overlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.confirmIcon}><Trash2 size={28} color="#ef4444" /></div>
            <h4 style={styles.confirmTitle}>Hapus Data User?</h4>
            <p style={styles.confirmText}>
              Tindakan ini tidak dapat dibatalkan. Data profil user akan dihapus dari Firestore.
            </p>
            <div style={styles.confirmActions}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)}>
                Batal
              </button>
              <button
                style={{ ...styles.deleteConfirmBtn, opacity: saving ? 0.6 : 1 }}
                onClick={() => void handleDelete(deleteConfirmId)}
                disabled={saving}
              >
                <Trash2 size={14} />
                <span>Ya, Hapus</span>
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
  heroLabel: { margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800 },
  heroText: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.92)' },
  heroBadge: { backgroundColor: '#ffffff', color: '#1d4ed8', padding: '12px 18px', borderRadius: '999px', fontWeight: 800, display: 'inline-flex', gap: '8px', alignItems: 'center' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '22px', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center' },
  summaryIcon: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryIconGreen: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryIconBlue: { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryLabel: { margin: 0, fontSize: '14px', color: '#64748b' },
  summaryValue: { margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: '#0f172a' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' },
  tableCard: { marginTop: '24px', backgroundColor: '#ffffff', borderRadius: '22px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' },
  sectionTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  sectionText: { margin: '6px 0 0', fontSize: '14px', color: '#64748b' },
  tableBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 },
  searchBox: { display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '42px', backgroundColor: '#f8fafc', flex: 1, minWidth: '220px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', width: '100%', color: '#0f172a' },
  filterWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  filterChevron: { position: 'absolute', right: '12px', pointerEvents: 'none' },
  filterSelect: { height: '42px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 36px 0 14px', fontSize: '14px', color: '#334155', fontWeight: 600, backgroundColor: '#ffffff', cursor: 'pointer', outline: 'none', appearance: 'none' },
  addButton: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '0 20px', height: '42px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '820px' },
  th: { textAlign: 'left', padding: '12px', fontSize: '13px', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px 12px', fontSize: '14px', color: '#0f172a' },
  emptyCell: { padding: '48px 0', textAlign: 'center' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  emptyText: { margin: 0, color: '#94a3b8', fontSize: '15px' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  roleEditor: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  roleSelect: { borderRadius: '10px', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '13px', fontWeight: 700, outline: 'none', backgroundColor: '#ffffff', textTransform: 'capitalize', cursor: 'pointer' },
  roleSelectAdmin: { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#93c5fd' },
  roleSelectCustomer: { backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' },
  savingText: { fontSize: '12px', fontWeight: 700, color: '#64748b' },
  statusBadgeActive: { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  actionRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  btnDetail: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnEdit: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#fef9c3', color: '#ca8a04', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnDelete: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(15,23,42,0.2)', overflow: 'hidden' },
  detailModal: { backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(15,23,42,0.2)', overflow: 'hidden' },
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
  detailHeader: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', marginBottom: '20px' },
  detailAvatar: { width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  detailName: { margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  detailSub: { margin: '0 0 8px', fontSize: '14px', color: '#64748b' },
  detailGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  confirmModal: { backgroundColor: '#ffffff', borderRadius: '22px', padding: '32px 28px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(15,23,42,0.2)' },
  confirmIcon: { width: '64px', height: '64px', borderRadius: '999px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  confirmTitle: { margin: '0 0 10px', fontSize: '20px', fontWeight: 800, color: '#0f172a' },
  confirmText: { margin: '0 0 24px', fontSize: '14px', lineHeight: 1.7, color: '#64748b' },
  confirmActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
  deleteConfirmBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
};
