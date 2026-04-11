import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { registerWithEmail } from '../../lib/auth';

export default function RegisterView() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }

    try {
      setLoading(true);

      await registerWithEmail({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert('Register berhasil.');
      router.push('/auth/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Anti Fall App</title>
      </Head>

      <main style={styles.page}>
        <div style={styles.card}>
          <div style={styles.leftSide}>
            <p style={styles.badge}>Create Account</p>
            <h1 style={styles.title}>Daftar ke Anti Fall App</h1>
            <p style={styles.description}>
              Buat akun untuk memantau lansia menggunakan gelang anti-fall,
              melihat histori kejadian, dan menerima notifikasi penting.
            </p>

            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>Keuntungan menggunakan sistem ini:</p>
              <ul style={styles.list}>
                <li>Pemantauan kondisi lansia secara real-time</li>
                <li>Lokasi terakhir dapat dilihat di dashboard</li>
                <li>Riwayat insiden tersimpan otomatis</li>
                <li>Siap dikembangkan dengan IoT dan cloud</li>
              </ul>
            </div>
          </div>

          <div style={styles.rightSide}>
            <h2 style={styles.formTitle}>Register</h2>
            <p style={styles.formSubtitle}>
              Isi data berikut untuk membuat akun baru.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="Masukkan ulang password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              {/* <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={styles.input}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}

              {error ? <p style={styles.errorText}>{error}</p> : null}

              <button type="submit" style={styles.primaryButton} disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </form>

            <p style={styles.bottomText}>
              Sudah punya akun?{' '}
              <Link href="/auth/login" style={styles.link}>
                Login di sini
              </Link>
            </p>

            <p style={styles.backText}>
              <Link href="/" style={styles.backLink}>
                ← Kembali ke Landing Page
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '1100px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  leftSide: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
    color: '#ffffff',
    padding: '48px',
  },
  rightSide: {
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '28px',
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: '18px',
    padding: '20px',
  },
  infoTitle: {
    fontWeight: 700,
    marginBottom: '10px',
    fontSize: '16px',
  },
  list: {
    margin: 0,
    paddingLeft: '18px',
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.92)',
    fontSize: '15px',
  },
  formTitle: {
    fontSize: '30px',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '10px',
  },
  formSubtitle: {
    color: '#64748b',
    marginBottom: '28px',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
  },
  primaryButton: {
    marginTop: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 18px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    margin: 0,
  },
  bottomText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 700,
  },
  backText: {
    marginTop: '12px',
    fontSize: '14px',
  },
  backLink: {
    color: '#475569',
    textDecoration: 'none',
  },
};