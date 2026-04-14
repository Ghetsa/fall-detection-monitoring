import Head from 'next/head';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { clearAuthCookies, loginWithEmail, setAuthCookies } from '../../lib/auth';
import { showErrorAlert, showSuccessAlert } from '../../lib/alerts';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l.1-.1 6.2 5.2C37 38.4 44 33 44 24c0-1.2-.1-2.3-.4-3.5Z"
      />
    </svg>
  );
}

export default function LoginView() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof FirebaseError) {
      return err.message || fallback;
    }

    if (err instanceof Error) {
      return err.message || fallback;
    }

    return fallback;
  };

  useEffect(() => {
    const oauthProvider = router.query.oauth;

    if (
      status !== 'authenticated' ||
      oauthProvider !== 'google' ||
      !session.user?.role
    ) {
      return;
    }

    const targetRole = session.user.role === 'admin' ? 'admin' : 'customer';
    const redirectTo =
      targetRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard';

    setAuthCookies(targetRole);
    void showSuccessAlert('Login Google berhasil');
    void router.replace(redirectTo);
  }, [router, session, status]);

  useEffect(() => {
    if (router.query.error) {
      clearAuthCookies();
      setError('Login dengan Google gagal. Silakan coba lagi.');
    }
  }, [router.query.error]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const result = await loginWithEmail({
        email: form.email,
        password: form.password,
      });

      await showSuccessAlert('Login berhasil');

      router.push(result.redirectTo);
    } catch (err: unknown) {
      console.error(err);
      const message = getErrorMessage(err, 'Email atau password salah.');
      setError(message);
      await showErrorAlert('Login gagal', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    clearAuthCookies();

    try {
      setLoading(true);
      await signIn('google', {
        callbackUrl: `${window.location.origin}/auth/login?oauth=google`,
      });
    } catch (err: unknown) {
      console.error(err);
      const message = getErrorMessage(err, 'Login dengan Google gagal.');
      setError(message);
      await showErrorAlert('Login Google gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Anti Fall App</title>
      </Head>

      <main
        style={{
          ...styles.page,
          ...(isMobile ? styles.pageMobile : {}),
        }}
      >
        <div
          style={{
            ...styles.card,
            ...(isMobile ? styles.cardMobile : {}),
          }}
        >
          {!isMobile && <div style={styles.leftSide}>
            <p style={styles.badge}>Welcome Back</p>
            <h1 style={styles.title}>Login ke Anti Fall App</h1>
            <p style={styles.description}>
              Masuk untuk memantau status lansia, melihat lokasi terakhir, dan
              menerima notifikasi kejadian jatuh secara real-time.
            </p>

            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>Fitur yang bisa kamu akses:</p>
              <ul style={styles.list}>
                <li>Monitoring status Safe / Fall Detected</li>
                <li>Tracking lokasi lansia</li>
                <li>Riwayat kejadian jatuh</li>
                <li>Notifikasi dan kontak darurat</li>
              </ul>
            </div>
          </div>}

          <div
            style={{
              ...styles.rightSide,
              ...(isMobile ? styles.rightSideMobile : {}),
            }}
          >
            <h2
              style={{
                ...styles.formTitle,
                ...(isMobile ? styles.formTitleMobile : {}),
              }}
            >
              Login
            </h2>
            {!isMobile && <p style={styles.formSubtitle}>
              Silakan masukkan email dan password kamu.
            </p>}

            <form
              onSubmit={handleSubmit}
              style={{
                ...styles.form,
                ...(isMobile ? styles.formMobile : {}),
              }}
            >
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  style={{
                    ...styles.input,
                    ...(isMobile ? styles.inputMobile : {}),
                  }}
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
                  style={{
                    ...styles.input,
                    ...(isMobile ? styles.inputMobile : {}),
                  }}
                  required
                />
              </div>

              {error ? <p style={styles.errorText}>{error}</p> : null}

              <button
                type="submit"
                style={{
                  ...styles.primaryButton,
                  ...(isMobile ? styles.primaryButtonMobile : {}),
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>atau</span>
              <span style={styles.dividerLine} />
            </div>

            <button
              type="button"
              style={{
                ...styles.googleButton,
                ...(isMobile ? styles.googleButtonMobile : {}),
              }}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span style={styles.googleIcon}>
                <GoogleIcon />
              </span>
              {loading ? 'Memproses...' : 'Masuk dengan Google'}
            </button>

            <p style={styles.bottomText}>
              Belum punya akun?{' '}
              <Link href="/auth/register" style={styles.link}>
                Register di sini
              </Link>
            </p>

            {!isMobile && <p style={styles.backText}>
              <Link href="/" style={styles.backLink}>
                ← Kembali ke Landing Page
              </Link>
            </p>}
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
  pageMobile: {
    alignItems: 'flex-start',
    padding: '16px',
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
  cardMobile: {
    maxWidth: '100%',
    gridTemplateColumns: '1fr',
    borderRadius: '24px',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.1)',
  },
  leftSide: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: '#ffffff',
    padding: '48px',
  },
  rightSide: {
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightSideMobile: {
    padding: '24px 18px',
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
  formTitleMobile: {
    fontSize: '28px',
    marginBottom: '18px',
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
  formMobile: {
    gap: '16px',
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
    color: '#334155',
  },
  inputMobile: {
    padding: '15px 16px',
    fontSize: '16px',
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
  primaryButtonMobile: {
    width: '100%',
    padding: '15px 18px',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    margin: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  googleButton: {
    marginTop: '18px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '13px 18px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
  },
  googleButtonMobile: {
    width: '100%',
    padding: '15px 16px',
  },
  googleIcon: {
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
