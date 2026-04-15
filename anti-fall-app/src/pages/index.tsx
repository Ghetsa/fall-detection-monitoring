import Head from 'next/head';
import Link from 'next/link';
import { useIsMobile } from '../hooks/useIsMobile';

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>Anti Fall App</title>
        <meta
          name="description"
          content="Aplikasi monitoring gelang anti-fall untuk lansia dengan pemantauan status, lokasi, dan notifikasi darurat."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.page}>
        <section style={{ ...styles.heroSection, ...(isMobile ? styles.heroSectionMobile : {}) }}>
          <div style={styles.overlay} />

          <nav style={{ ...styles.navbar, ...(isMobile ? styles.navbarMobile : {}) }}>
            <div style={{ ...styles.logoWrapper, ...(isMobile ? styles.logoWrapperMobile : {}) }}>
              <div style={{ ...styles.logoCircle, ...(isMobile ? styles.logoCircleMobile : {}) }}>A</div>
              <span style={{ ...styles.logoText, ...(isMobile ? styles.logoTextMobile : {}) }}>Anti Fall App</span>
            </div>

            <div style={{ ...styles.navActions, ...(isMobile ? styles.navActionsMobile : {}) }}>
              <Link href="/auth/login" style={{ ...styles.loginButton, ...(isMobile ? styles.loginButtonMobile : {}) }}>
                Login
              </Link>
              <Link href="/auth/register" style={{ ...styles.registerButton, ...(isMobile ? styles.registerButtonMobile : {}) }}>
                Register
              </Link>
            </div>
          </nav>

          <div style={styles.heroContent}>
            <div style={styles.badge}>IoT Monitoring for Elderly Safety</div>

            <h1 style={styles.title}>
              Monitoring Gelang Anti-Fall untuk Lansia Secara Real-Time
            </h1>

            <p style={styles.description}>
              Anti Fall App membantu keluarga memantau kondisi lansia melalui
              perangkat IoT. Status aman, deteksi jatuh, lokasi terakhir, dan
              notifikasi darurat dapat diakses dalam satu dashboard sederhana.
            </p>

            <div style={styles.ctaWrapper}>
              <Link href="/auth/register" style={styles.primaryButton}>
                Mulai Sekarang
              </Link>
              <Link href="/auth/login" style={styles.secondaryButton}>
                Masuk ke Sistem
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionLabel}>Fitur Utama</p>
            <h2 style={styles.sectionTitle}>
              Solusi sederhana untuk pemantauan lansia
            </h2>
            <p style={styles.sectionText}>
              Dibangun untuk kebutuhan monitoring cepat, jelas, dan mudah
              digunakan oleh keluarga maupun admin.
            </p>
          </div>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Status Real-Time</h3>
              <p style={styles.cardText}>
                Menampilkan kondisi gelang dan status lansia seperti Safe atau
                Fall Detected secara langsung.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Tracking Lokasi</h3>
              <p style={styles.cardText}>
                Memantau lokasi terakhir lansia untuk membantu respon lebih
                cepat saat kondisi darurat terjadi.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Riwayat Kejadian</h3>
              <p style={styles.cardText}>
                Menyimpan histori insiden jatuh yang dapat digunakan untuk
                evaluasi dan laporan sederhana.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Notifikasi Darurat</h3>
              <p style={styles.cardText}>
                Kontak keluarga dapat menerima informasi ketika sistem
                mendeteksi kejadian berbahaya.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.sectionAlt}>
          <div style={styles.infoGrid}>
            <div>
              <p style={styles.sectionLabel}>Cara Kerja</p>
              <h2 style={styles.sectionTitle}>
                Integrasi IoT, cloud, dan dashboard web
              </h2>
              <p style={styles.sectionText}>
                Gelang berbasis ESP32 dan sensor gerak mengirim data ke sistem.
                Data kemudian disimpan dan ditampilkan melalui dashboard untuk
                customer dan admin.
              </p>
            </div>

            <div style={styles.stepsBox}>
              <div style={styles.stepItem}>
                <span style={styles.stepNumber}>1</span>
                <p style={styles.stepText}>
                  Gelang membaca data sensor dan mendeteksi aktivitas.
                </p>
              </div>

              <div style={styles.stepItem}>
                <span style={styles.stepNumber}>2</span>
                <p style={styles.stepText}>
                  Data dikirim ke cloud dan disimpan untuk monitoring.
                </p>
              </div>

              <div style={styles.stepItem}>
                <span style={styles.stepNumber}>3</span>
                <p style={styles.stepText}>
                  Dashboard menampilkan status, lokasi, dan histori kejadian.
                </p>
              </div>

              <div style={styles.stepItem}>
                <span style={styles.stepNumber}>4</span>
                <p style={styles.stepText}>
                  Sistem memberi peringatan jika terdeteksi jatuh.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.ctaBox}>
            <h2 style={styles.ctaTitle}>
              Siap membangun sistem monitoring lansia yang lebih aman?
            </h2>
            <p style={styles.ctaText}>
              Gunakan Anti Fall App untuk memantau kondisi lansia, mencatat
              insiden, dan menampilkan data penting secara praktis.
            </p>

            <div style={styles.ctaWrapper}>
              <Link href="/auth/register" style={styles.primaryButton}>
                Daftar Akun
              </Link>
              <Link href="/auth/login" style={styles.secondaryButton}>
                Login
              </Link>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            © 2026 Anti Fall App. Built for IoT Fall Detection Monitoring.
          </p>
        </footer>
      </main>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
  },
  heroSection: {
    position: 'relative',
    background:
      'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)',
    color: '#ffffff',
    padding: '24px 20px 80px',
    overflow: 'hidden',
  },
  heroSectionMobile: {
    padding: '16px 14px 72px',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%)',
    pointerEvents: 'none',
  },
  navbar: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  navbarMobile: {
    gap: '10px',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoWrapperMobile: {
    gap: '10px',
    minWidth: 0,
    flex: 1,
  },
  logoCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '18px',
  },
  logoCircleMobile: {
    width: '36px',
    height: '36px',
    fontSize: '16px',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
  },
  logoTextMobile: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  navActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  navActionsMobile: {
    gap: '8px',
    flexShrink: 0,
  },
  loginButton: {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.3)',
    fontWeight: 600,
  },
  loginButtonMobile: {
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '9px',
    whiteSpace: 'nowrap',
  },
  registerButton: {
    color: '#1e3a8a',
    backgroundColor: '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: 700,
  },
  registerButtonMobile: {
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '9px',
    whiteSpace: 'nowrap',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '80px auto 0',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.18)',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    lineHeight: 1.15,
    maxWidth: '900px',
    margin: '0 auto 20px',
  },
  description: {
    fontSize: '18px',
    lineHeight: 1.7,
    maxWidth: '760px',
    margin: '0 auto',
    color: 'rgba(255,255,255,0.9)',
  },
  ctaWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '32px',
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    minWidth: '160px',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.35)',
    minWidth: '160px',
    textAlign: 'center',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '72px 20px',
  },
  sectionAlt: {
    backgroundColor: '#eaf2ff',
    padding: '72px 20px',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '760px',
    margin: '0 auto 40px',
  },
  sectionLabel: {
    color: '#2563eb',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  },
  sectionTitle: {
    fontSize: '34px',
    fontWeight: 800,
    margin: '0 0 14px',
    lineHeight: 1.2,
  },
  sectionText: {
    fontSize: '17px',
    color: '#475569',
    lineHeight: 1.7,
    margin: 0,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#0f172a',
  },
  cardText: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#475569',
    margin: 0,
  },
  infoGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '28px',
    alignItems: 'start',
  },
  stepsBox: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.08)',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '18px',
  },
  stepNumber: {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    margin: 0,
    color: '#334155',
    lineHeight: 1.7,
    fontSize: '15px',
  },
  ctaBox: {
    background:
      'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    borderRadius: '24px',
    padding: '48px 24px',
    textAlign: 'center',
    color: '#ffffff',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: 800,
    margin: '0 0 14px',
    lineHeight: 1.2,
  },
  ctaText: {
    fontSize: '17px',
    lineHeight: 1.7,
    maxWidth: '760px',
    margin: '0 auto',
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    padding: '24px 20px 36px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
  footerText: {
    margin: 0,
    color: '#64748b',
    fontSize: '14px',
  },
};
