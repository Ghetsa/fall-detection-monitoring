import { useState, useEffect, CSSProperties } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

// Admin user IDs (fake – matches what would be in Firebase Auth)
const ADMIN_UID = 'admin_uid_001';
// CUSTOMER_UID_1 is dynamically updated during seed based on the active session
let CUSTOMER_UID_1 = 'customer_uid_001';
// CUSTOMER_UID_2 remains fake (second demo account)
const CUSTOMER_UID_2 = 'customer_uid_002';

// Lansia IDs (will be used as Firestore doc IDs)
const LANSIA_ID_1 = 'lansia_001';
const LANSIA_ID_2 = 'lansia_002';
const LANSIA_ID_3 = 'lansia_003';

// Emergency contact IDs (will be used as Firestore doc IDs)
const EMERGENCY_ID_1 = 'emergency_001';
const EMERGENCY_ID_2 = 'emergency_002';
const EMERGENCY_ID_3 = 'emergency_003';

// Device serial / IDs
const DEVICE_ID_1 = 'ESP32-001';
const DEVICE_ID_2 = 'ESP32-002';
const DEVICE_ID_3 = 'ESP32-003';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}
function hoursAgo(n: number) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return Timestamp.fromDate(d);
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

/** 1. users */
const seedUsers = async () => {
  await setDoc(doc(db, 'users', ADMIN_UID), {
    uid: ADMIN_UID,
    fullName: 'Admin Sistem',
    email: 'admin@antifall.id',
    role: 'admin',
    phone: '081200000001',
    address: 'Gedung Anti-Fall, Bandar Lampung',
    createdAt: daysAgo(60),
  });

  await setDoc(doc(db, 'users', CUSTOMER_UID_1), {
    uid: CUSTOMER_UID_1,
    fullName: 'Budi Santoso',
    email: 'budi@gmail.com',
    role: 'customer',
    phone: '081234567890',
    address: 'Jl. Raden Intan No. 55, Bandar Lampung',
    createdAt: daysAgo(30),
  });

  await setDoc(doc(db, 'users', CUSTOMER_UID_2), {
    uid: CUSTOMER_UID_2,
    fullName: 'Dewi Prasetyo',
    email: 'dewi@gmail.com',
    role: 'customer',
    phone: '087654321098',
    address: 'Jl. Kartini No. 12, Tanjung Karang',
    createdAt: daysAgo(20),
  });
};

/** 2. lansia */
const seedLansia = async () => {
  await setDoc(doc(db, 'lansia', LANSIA_ID_1), {
    customerId: CUSTOMER_UID_1,
    nama: 'Siti Rahayu',
    usia: 72,
    jenisKelamin: 'Perempuan',
    alamat: 'Jl. Raden Intan No. 12, Bandar Lampung',
    noHp: '085678901234',
    emergencyContactId: EMERGENCY_ID_1,
    kondisiKesehatan: 'Hipertensi, Diabetes Tipe 2',
    deviceId: DEVICE_ID_1,
    status: 'Aktif',
    catatan: 'Rutin kontrol tekanan darah setiap minggu.',
    createdAt: daysAgo(25),
  });

  await setDoc(doc(db, 'lansia', LANSIA_ID_2), {
    customerId: CUSTOMER_UID_1,
    nama: 'Hadi Prasetyo',
    usia: 68,
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Kartini No. 5, Tanjung Karang',
    noHp: '082345678901',
    emergencyContactId: EMERGENCY_ID_2,
    kondisiKesehatan: 'Osteoporosis, Rematik',
    deviceId: DEVICE_ID_2,
    status: 'Aktif',
    catatan: 'Perlu bantuan saat berjalan di permukaan licin.',
    createdAt: daysAgo(20),
  });

  await setDoc(doc(db, 'lansia', LANSIA_ID_3), {
    customerId: CUSTOMER_UID_2,
    nama: 'Slamet Wiyono',
    usia: 75,
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Gajah Mada No. 3, Way Halim',
    noHp: '083456789012',
    emergencyContactId: EMERGENCY_ID_3,
    kondisiKesehatan: 'Parkinson ringan',
    deviceId: DEVICE_ID_3,
    status: 'Aktif',
    catatan: 'Butuh pemantauan ketat saat malam hari.',
    createdAt: daysAgo(10),
  });
};

/** 3. devices */
const seedDevices = async () => {
  await setDoc(doc(db, 'devices', DEVICE_ID_1), {
    serial: DEVICE_ID_1,
    lansiaId: LANSIA_ID_1,
    batteryLevel: 87,
    isOnline: true,
    lastSeen: hoursAgo(0),
    firmware: 'v2.1.0',
    model: 'ESP32-WROOM-32',
    latitude: -5.4292,
    longitude: 105.2610,
    locationName: 'Bandar Lampung',
    createdAt: daysAgo(25),
  });

  await setDoc(doc(db, 'devices', DEVICE_ID_2), {
    serial: DEVICE_ID_2,
    lansiaId: LANSIA_ID_2,
    batteryLevel: 62,
    isOnline: true,
    lastSeen: hoursAgo(1),
    firmware: 'v2.1.0',
    model: 'ESP32-WROOM-32',
    latitude: -5.4345,
    longitude: 105.2580,
    locationName: 'Tanjung Karang',
    createdAt: daysAgo(20),
  });

  await setDoc(doc(db, 'devices', DEVICE_ID_3), {
    serial: DEVICE_ID_3,
    lansiaId: LANSIA_ID_3,
    batteryLevel: 45,
    isOnline: false,
    lastSeen: hoursAgo(6),
    firmware: 'v2.0.5',
    model: 'ESP32-WROOM-32',
    latitude: -5.4400,
    longitude: 105.2700,
    locationName: 'Way Halim',
    createdAt: daysAgo(10),
  });
};

/** 4. telemetry */
const seedTelemetry = async () => {
  const col = collection(db, 'telemetry');

  const entries = [
    // LANSIA 1 – Siti Rahayu (ESP32-001)
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, timestamp: hoursAgo(0), location: { latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung' }, batteryLevel: 87, accelX: 0.02, accelY: 0.01, accelZ: 9.80, isFallDetected: false, stepCount: 420 },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, timestamp: hoursAgo(2), location: { latitude: -5.4295, longitude: 105.2612, locationName: 'Bandar Lampung' }, batteryLevel: 89, accelX: 0.03, accelY: 0.02, accelZ: 9.79, isFallDetected: false, stepCount: 210 },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, timestamp: daysAgo(1), location: { latitude: -5.4290, longitude: 105.2605, locationName: 'Bandar Lampung' }, batteryLevel: 91, accelX: 4.51, accelY: 7.22, accelZ: 2.10, isFallDetected: true, stepCount: 0 },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, timestamp: daysAgo(2), location: { latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung' }, batteryLevel: 93, accelX: 0.01, accelY: 0.02, accelZ: 9.81, isFallDetected: false, stepCount: 634 },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, timestamp: daysAgo(3), location: { latitude: -5.4291, longitude: 105.2611, locationName: 'Bandar Lampung' }, batteryLevel: 95, accelX: 0.02, accelY: 0.01, accelZ: 9.80, isFallDetected: false, stepCount: 890 },

    // LANSIA 2 – Hadi Prasetyo (ESP32-002)
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, timestamp: hoursAgo(1), location: { latitude: -5.4345, longitude: 105.2580, locationName: 'Tanjung Karang' }, batteryLevel: 62, accelX: 0.04, accelY: 0.02, accelZ: 9.79, isFallDetected: false, stepCount: 310 },
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, timestamp: daysAgo(1), location: { latitude: -5.4347, longitude: 105.2583, locationName: 'Tanjung Karang' }, batteryLevel: 65, accelX: 3.90, accelY: 6.10, accelZ: 3.20, isFallDetected: true, stepCount: 0 },
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, timestamp: daysAgo(4), location: { latitude: -5.4345, longitude: 105.2580, locationName: 'Tanjung Karang' }, batteryLevel: 72, accelX: 0.01, accelY: 0.01, accelZ: 9.82, isFallDetected: false, stepCount: 512 },

    // LANSIA 3 – Slamet Wiyono (ESP32-003)
    { lansiaId: LANSIA_ID_3, deviceId: DEVICE_ID_3, customerId: CUSTOMER_UID_2, timestamp: hoursAgo(6), location: { latitude: -5.4400, longitude: 105.2700, locationName: 'Way Halim' }, batteryLevel: 45, accelX: 0.05, accelY: 0.03, accelZ: 9.78, isFallDetected: false, stepCount: 180 },
    { lansiaId: LANSIA_ID_3, deviceId: DEVICE_ID_3, customerId: CUSTOMER_UID_2, timestamp: daysAgo(2), location: { latitude: -5.4402, longitude: 105.2702, locationName: 'Way Halim' }, batteryLevel: 52, accelX: 0.02, accelY: 0.01, accelZ: 9.80, isFallDetected: false, stepCount: 390 },
  ];

  for (const entry of entries) {
    await addDoc(col, entry);
  }
};

/** 5. incidents (logs aktivitas) */
const seedIncidents = async () => {
  const col = collection(db, 'incidents');

  const entries = [
    // LANSIA 1 incidents
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, type: 'fall_detected', severity: 'danger', description: 'Sistem mendeteksi kemungkinan lansia (Siti Rahayu) terjatuh.', location: { latitude: -5.4290, longitude: 105.2605, locationName: 'Bandar Lampung' }, timestamp: daysAgo(1), isResolved: true, resolvedAt: daysAgo(1) },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, type: 'battery_low', severity: 'warning', description: 'Baterai device ESP32-001 turun di bawah 20%.', location: { latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung' }, timestamp: daysAgo(5), isResolved: true, resolvedAt: daysAgo(4) },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, type: 'safe', severity: 'normal', description: 'Status aman – tidak ada indikasi kejadian berbahaya.', location: { latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung' }, timestamp: daysAgo(7), isResolved: true, resolvedAt: daysAgo(7) },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, type: 'sos', severity: 'danger', description: 'Tombol SOS ditekan oleh lansia Siti Rahayu.', location: { latitude: -5.4291, longitude: 105.2611, locationName: 'Bandar Lampung' }, timestamp: daysAgo(12), isResolved: true, resolvedAt: daysAgo(12) },
    { lansiaId: LANSIA_ID_1, deviceId: DEVICE_ID_1, customerId: CUSTOMER_UID_1, type: 'device_offline', severity: 'warning', description: 'Perangkat ESP32-001 tidak mengirim data selama 30 menit.', location: { latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung' }, timestamp: daysAgo(15), isResolved: true, resolvedAt: daysAgo(15) },

    // LANSIA 2 incidents
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, type: 'fall_detected', severity: 'danger', description: 'Sistem mendeteksi kemungkinan lansia (Hadi Prasetyo) terjatuh.', location: { latitude: -5.4347, longitude: 105.2583, locationName: 'Tanjung Karang' }, timestamp: daysAgo(1), isResolved: true, resolvedAt: daysAgo(1) },
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, type: 'battery_low', severity: 'warning', description: 'Baterai device ESP32-002 turun di bawah 30%.', location: { latitude: -5.4345, longitude: 105.2580, locationName: 'Tanjung Karang' }, timestamp: daysAgo(8), isResolved: false, resolvedAt: null },
    { lansiaId: LANSIA_ID_2, deviceId: DEVICE_ID_2, customerId: CUSTOMER_UID_1, type: 'safe', severity: 'normal', description: 'Status aman – kondisi normal terdeteksi.', location: { latitude: -5.4345, longitude: 105.2580, locationName: 'Tanjung Karang' }, timestamp: daysAgo(10), isResolved: true, resolvedAt: daysAgo(10) },

    // LANSIA 3 incidents
    { lansiaId: LANSIA_ID_3, deviceId: DEVICE_ID_3, customerId: CUSTOMER_UID_2, type: 'device_offline', severity: 'warning', description: 'Perangkat ESP32-003 offline, mungkin kehabisan baterai.', location: { latitude: -5.4400, longitude: 105.2700, locationName: 'Way Halim' }, timestamp: hoursAgo(6), isResolved: false, resolvedAt: null },
    { lansiaId: LANSIA_ID_3, deviceId: DEVICE_ID_3, customerId: CUSTOMER_UID_2, type: 'battery_low', severity: 'warning', description: 'Baterai device ESP32-003 turun di bawah 50%.', location: { latitude: -5.4400, longitude: 105.2700, locationName: 'Way Halim' }, timestamp: daysAgo(2), isResolved: false, resolvedAt: null },
    { lansiaId: LANSIA_ID_3, deviceId: DEVICE_ID_3, customerId: CUSTOMER_UID_2, type: 'fall_detected', severity: 'danger', description: 'Terdeteksi kemungkinan jatuh pada Slamet Wiyono.', location: { latitude: -5.4402, longitude: 105.2702, locationName: 'Way Halim' }, timestamp: daysAgo(5), isResolved: true, resolvedAt: daysAgo(5) },
  ];

  for (const entry of entries) {
    await addDoc(col, entry);
  }
};

/** 6. notification */
const seedNotifications = async () => {
  const col = collection(db, 'notifications');

  const entries = [
    // Customer 1 notifications
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_1, title: 'Terdeteksi Jatuh!', description: 'Sistem mendeteksi kemungkinan Siti Rahayu terjatuh. Segera periksa kondisinya.', type: 'danger', isRead: false, createdAt: daysAgo(1) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_2, title: 'Terdeteksi Jatuh!', description: 'Sistem mendeteksi kemungkinan Hadi Prasetyo terjatuh.', type: 'danger', isRead: true, createdAt: daysAgo(1) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_1, title: 'Baterai Lemah', description: 'Baterai perangkat ESP32-001 (Siti Rahayu) mulai menipis, perlu diisi ulang.', type: 'warning', isRead: true, createdAt: daysAgo(5) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_2, title: 'Baterai Lemah', description: 'Baterai perangkat Hadi Prasetyo di bawah 30%.', type: 'warning', isRead: false, createdAt: daysAgo(8) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_1, title: 'Kondisi Aman', description: 'Tidak ada indikasi kejadian berbahaya pada Siti Rahayu.', type: 'safe', isRead: true, createdAt: daysAgo(7) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_1, title: 'SOS Ditekan!', description: 'Siti Rahayu menekan tombol SOS darurat. Segera hubungi beliau.', type: 'danger', isRead: true, createdAt: daysAgo(12) },
    { customerId: CUSTOMER_UID_1, lansiaId: LANSIA_ID_1, title: 'Perangkat Offline', description: 'ESP32-001 tidak mengirim data sejak 30 menit lalu.', type: 'warning', isRead: true, createdAt: daysAgo(15) },

    // Customer 2 notifications
    { customerId: CUSTOMER_UID_2, lansiaId: LANSIA_ID_3, title: 'Perangkat Offline', description: 'ESP32-003 tidak dapat dihubungi. Perangkat mungkin kehabisan baterai.', type: 'warning', isRead: false, createdAt: hoursAgo(6) },
    { customerId: CUSTOMER_UID_2, lansiaId: LANSIA_ID_3, title: 'Baterai Lemah', description: 'Baterai Slamet Wiyono di bawah 50%.', type: 'warning', isRead: false, createdAt: daysAgo(2) },
    { customerId: CUSTOMER_UID_2, lansiaId: LANSIA_ID_3, title: 'Terdeteksi Jatuh!', description: 'Sistem mendeteksi kemungkinan Slamet Wiyono terjatuh.', type: 'danger', isRead: true, createdAt: daysAgo(5) },
  ];

  for (const entry of entries) {
    await addDoc(col, entry);
  }
};

/** 7. emergency (kontak darurat per customer-lansia) */
const seedEmergency = async () => {
  await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_1), {
    lansiaId: LANSIA_ID_1,
    contactName: 'Budi Santoso',
    contactPhone: '081234567890',
    relationship: 'Anak',
    isActive: true,
    updatedAt: daysAgo(25),
  });

  await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_2), {
    lansiaId: LANSIA_ID_2,
    contactName: 'Budi Santoso',
    contactPhone: '081234567890',
    relationship: 'Keponakan',
    isActive: true,
    updatedAt: daysAgo(20),
  });

  await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_3), {
    lansiaId: LANSIA_ID_3,
    contactName: 'Dewi Prasetyo',
    contactPhone: '087654321098',
    relationship: 'Anak',
    isActive: true,
    updatedAt: daysAgo(10),
  });
};

/** 8. broadcasts (dari admin) */
const seedBroadcasts = async () => {
  const col = collection(db, 'broadcasts');

  const entries = [
    { title: 'Pemeliharaan Sistem', message: 'Sistem akan mengalami maintenance pada Senin 20 April 2026 pukul 00:00–02:00 WIB. Mohon maaf atas ketidaknyamanannya.', type: 'warning', targetRole: 'all', createdBy: ADMIN_UID, isActive: true, createdAt: daysAgo(3) },
    { title: 'Fitur Baru: Tracking Real-Time', message: 'Fitur tracking lokasi real-time kini tersedia di halaman Tracking. Pastikan GPS perangkat aktif.', type: 'info', targetRole: 'customer', createdBy: ADMIN_UID, isActive: true, createdAt: daysAgo(7) },
    { title: 'Pembaruan Firmware ESP32', message: 'Firmware ESP32 terbaru (v2.1.0) tersedia. Perangkat yang terhubung akan diperbarui secara otomatis.', type: 'info', targetRole: 'all', createdBy: ADMIN_UID, isActive: true, createdAt: daysAgo(10) },
    { title: 'Peringatan Cuaca Ekstrem', message: 'BMKG melaporkan cuaca ekstrem di Bandar Lampung. Harap awasi lansia lebih ketat selama periode ini.', type: 'urgent', targetRole: 'customer', createdBy: ADMIN_UID, isActive: true, createdAt: daysAgo(14) },
    { title: 'Laporan Bulanan Tersedia', message: 'Laporan monitoring bulan Maret 2026 sudah tersedia di menu Reports.', type: 'info', targetRole: 'admin', createdBy: ADMIN_UID, isActive: false, createdAt: daysAgo(20) },
  ];

  for (const entry of entries) {
    await addDoc(col, entry);
  }
};

/** 9. reports (ringkasan admin) */
const seedReports = async () => {
  const col = collection(db, 'reports');

  const entries = [
    { title: 'Laporan Insiden Maret 2026', category: 'Incident', period: 'Maret 2026', generatedAt: daysAgo(20), status: 'Completed', description: 'Ringkasan seluruh insiden yang terdeteksi sepanjang Maret 2026.', data: { totalIncidents: 14, resolvedIncidents: 12, unresolvedIncidents: 2, totalDevices: 3, activeDevices: 3 } },
    { title: 'Laporan Device April 2026', category: 'Device', period: 'April 2026', generatedAt: daysAgo(5), status: 'Completed', description: 'Status dan performa semua device ESP32 yang terdaftar.', data: { totalDevices: 3, activeDevices: 2, offlineDevices: 1, avgBattery: 65 } },
    { title: 'Laporan Pengguna Kuartal I 2026', category: 'User', period: 'Q1 2026', generatedAt: daysAgo(10), status: 'Completed', description: 'Ringkasan jumlah pengguna aktif dan tren pendaftaran.', data: { totalUsers: 3, adminUsers: 1, customerUsers: 2, newUsersThisMonth: 1 } },
    { title: 'Laporan Sistem April 2026', category: 'System', period: 'April 2026', generatedAt: daysAgo(1), status: 'Processing', description: 'Analisis kinerja sistem dan uptime platform.', data: { uptime: '99.2%', totalRequests: 4821, errorRate: '0.3%' } },
    { title: 'Laporan Insiden April 2026', category: 'Incident', period: 'April 2026', generatedAt: daysAgo(0), status: 'Processing', description: 'Sedang diproses – insiden bulan April 2026.', data: {} },
  ];

  for (const entry of entries) {
    await addDoc(col, entry);
  }
};

// ─── Collections list (for UI) ────────────────────────────────────────────────
const COLLECTIONS = [
  { key: 'users', label: 'users', desc: '3 dokumen (1 admin, 2 customer)' },
  { key: 'lansia', label: 'lansia', desc: '3 dokumen lansia terdaftar' },
  { key: 'devices', label: 'devices', desc: '3 perangkat ESP32' },
  { key: 'telemetry', label: 'telemetry', desc: '10 data sensor & lokasi' },
  { key: 'incidents', label: 'incidents', desc: '11 insiden / activity logs' },
  { key: 'notifications', label: 'notifications', desc: '10 notifikasi customer' },
    { key: 'emergencyContacts', label: 'emergencyContacts', desc: '3 data kontak darurat' },
  { key: 'broadcasts', label: 'broadcasts', desc: '5 pengumuman admin' },
  { key: 'reports', label: 'reports', desc: '5 laporan sistem' },
];

type Status = 'idle' | 'running' | 'done' | 'error';

// ─── Helper: patch CUSTOMER_UID_1 in all seed data ────────────────────────────
// Since seed functions close over module-level constants, we rebuild them
// at runtime using the logged-in user's real UID.
async function runSeedWithUid(uid: string) {
  const C1 = uid; // real UID → used as CUSTOMER_UID_1

  // 1. users
  await setDoc(doc(db, 'users', ADMIN_UID), { uid: ADMIN_UID, fullName: 'Admin Sistem', email: 'admin@antifall.id', role: 'admin', phone: '081200000001', address: 'Gedung Anti-Fall, Bandar Lampung', createdAt: daysAgo(60) });
  await setDoc(doc(db, 'users', C1), { uid: C1, fullName: 'Budi Santoso', email: auth.currentUser?.email ?? 'customer@antifall.id', role: 'customer', phone: '081234567890', address: 'Jl. Raden Intan No. 55, Bandar Lampung', createdAt: daysAgo(30) });
  await setDoc(doc(db, 'users', CUSTOMER_UID_2), { uid: CUSTOMER_UID_2, fullName: 'Dewi Prasetyo', email: 'dewi@gmail.com', role: 'customer', phone: '087654321098', address: 'Jl. Kartini No. 12, Tanjung Karang', createdAt: daysAgo(20) });
}

export default function SeedPage() {
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'running' | 'done'>('idle');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return unsub;
  }, []);

  const setStatus = (key: string, s: Status) =>
    setStatuses((prev) => ({ ...prev, [key]: s }));
  const setError = (key: string, msg: string) =>
    setErrors((prev) => ({ ...prev, [key]: msg }));

  const runAll = async () => {
    if (!authUser) return;
    const REAL_UID = authUser.uid;
    CUSTOMER_UID_1 = REAL_UID; // Update the module level variable so static seeders use it

    // Seed functions that need the real UID patched in
    const dynamicSeedFunctions: Record<string, () => Promise<void>> = {
      users: async () => {
        await setDoc(doc(db, 'users', ADMIN_UID), { uid: ADMIN_UID, fullName: 'Admin Sistem', email: 'admin@antifall.id', role: 'admin', phone: '081200000001', address: 'Gedung Anti-Fall, Bandar Lampung', createdAt: daysAgo(60) });
        await setDoc(doc(db, 'users', REAL_UID), { uid: REAL_UID, fullName: authUser.displayName ?? 'Budi Santoso', email: authUser.email ?? 'customer@antifall.id', role: 'customer', phone: '081234567890', address: 'Jl. Raden Intan No. 55, Bandar Lampung', createdAt: daysAgo(30) });
        await setDoc(doc(db, 'users', CUSTOMER_UID_2), { uid: CUSTOMER_UID_2, fullName: 'Dewi Prasetyo', email: 'dewi@gmail.com', role: 'customer', phone: '087654321098', address: 'Jl. Kartini No. 12, Tanjung Karang', createdAt: daysAgo(20) });
      },
      lansia: async () => {
        await setDoc(doc(db, 'lansia', LANSIA_ID_1), { customerId: REAL_UID, nama: 'Siti Rahayu', usia: 72, jenisKelamin: 'Perempuan', alamat: 'Jl. Raden Intan No. 12, Bandar Lampung', noHp: '085678901234', emergencyContactId: EMERGENCY_ID_1, kondisiKesehatan: 'Hipertensi, Diabetes Tipe 2', deviceId: DEVICE_ID_1, status: 'Aktif', catatan: 'Rutin kontrol tekanan darah setiap minggu.', createdAt: daysAgo(25) });
        await setDoc(doc(db, 'lansia', LANSIA_ID_2), { customerId: REAL_UID, nama: 'Hadi Prasetyo', usia: 68, jenisKelamin: 'Laki-laki', alamat: 'Jl. Kartini No. 5, Tanjung Karang', noHp: '082345678901', emergencyContactId: EMERGENCY_ID_2, kondisiKesehatan: 'Osteoporosis, Rematik', deviceId: DEVICE_ID_2, status: 'Aktif', catatan: 'Perlu bantuan saat berjalan di permukaan licin.', createdAt: daysAgo(20) });
        await setDoc(doc(db, 'lansia', LANSIA_ID_3), { customerId: CUSTOMER_UID_2, nama: 'Slamet Wiyono', usia: 75, jenisKelamin: 'Laki-laki', alamat: 'Jl. Gajah Mada No. 3, Way Halim', noHp: '083456789012', emergencyContactId: EMERGENCY_ID_3, kondisiKesehatan: 'Parkinson ringan', deviceId: DEVICE_ID_3, status: 'Aktif', catatan: 'Butuh pemantauan ketat saat malam hari.', createdAt: daysAgo(10) });
      },
      devices: async () => {
        await setDoc(doc(db, 'devices', DEVICE_ID_1), { serial: DEVICE_ID_1, lansiaId: LANSIA_ID_1, batteryLevel: 87, isOnline: true, lastSeen: hoursAgo(0), firmware: 'v2.1.0', model: 'ESP32-WROOM-32', latitude: -5.4292, longitude: 105.2610, locationName: 'Bandar Lampung', createdAt: daysAgo(25) });
        await setDoc(doc(db, 'devices', DEVICE_ID_2), { serial: DEVICE_ID_2, lansiaId: LANSIA_ID_2, batteryLevel: 62, isOnline: true, lastSeen: hoursAgo(1), firmware: 'v2.1.0', model: 'ESP32-WROOM-32', latitude: -5.4345, longitude: 105.2580, locationName: 'Tanjung Karang', createdAt: daysAgo(20) });
        await setDoc(doc(db, 'devices', DEVICE_ID_3), { serial: DEVICE_ID_3, lansiaId: LANSIA_ID_3, batteryLevel: 45, isOnline: false, lastSeen: hoursAgo(6), firmware: 'v2.0.5', model: 'ESP32-WROOM-32', latitude: -5.4400, longitude: 105.2700, locationName: 'Way Halim', createdAt: daysAgo(10) });
      },
      telemetry: () => seedTelemetry(),
      incidents: () => seedIncidents(),
      notifications: async () => {
        const col = collection(db, 'notifications');
        const entries = [
          { customerId: REAL_UID, lansiaId: LANSIA_ID_1, title: 'Terdeteksi Jatuh!', description: 'Sistem mendeteksi kemungkinan Siti Rahayu terjatuh.', type: 'danger', isRead: false, createdAt: daysAgo(1) },
          { customerId: REAL_UID, lansiaId: LANSIA_ID_2, title: 'Terdeteksi Jatuh!', description: 'Sistem mendeteksi kemungkinan Hadi Prasetyo terjatuh.', type: 'danger', isRead: true, createdAt: daysAgo(1) },
          { customerId: REAL_UID, lansiaId: LANSIA_ID_1, title: 'Baterai Lemah', description: 'Baterai perangkat ESP32-001 mulai menipis.', type: 'warning', isRead: true, createdAt: daysAgo(5) },
          { customerId: REAL_UID, lansiaId: LANSIA_ID_2, title: 'Baterai Lemah', description: 'Baterai Hadi Prasetyo di bawah 30%.', type: 'warning', isRead: false, createdAt: daysAgo(8) },
          { customerId: REAL_UID, lansiaId: LANSIA_ID_1, title: 'Kondisi Aman', description: 'Tidak ada indikasi kejadian berbahaya.', type: 'safe', isRead: true, createdAt: daysAgo(7) },
          { customerId: REAL_UID, lansiaId: LANSIA_ID_1, title: 'SOS Ditekan!', description: 'Siti Rahayu menekan tombol SOS darurat.', type: 'danger', isRead: true, createdAt: daysAgo(12) },
          { customerId: CUSTOMER_UID_2, lansiaId: LANSIA_ID_3, title: 'Perangkat Offline', description: 'ESP32-003 tidak dapat dihubungi.', type: 'warning', isRead: false, createdAt: hoursAgo(6) },
        ];
        for (const e of entries) await addDoc(col, e);
      },
      emergencyContacts: async () => {
        await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_1), { lansiaId: LANSIA_ID_1, contactName: 'Budi Santoso', contactPhone: '081234567890', relationship: 'Anak', isActive: true, updatedAt: daysAgo(25) });
        await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_2), { lansiaId: LANSIA_ID_2, contactName: 'Budi Santoso', contactPhone: '081234567890', relationship: 'Keponakan', isActive: true, updatedAt: daysAgo(20) });
        await setDoc(doc(db, 'emergencyContacts', EMERGENCY_ID_3), { lansiaId: LANSIA_ID_3, contactName: 'Dewi Prasetyo', contactPhone: '087654321098', relationship: 'Anak', isActive: true, updatedAt: daysAgo(10) });
      },
      broadcasts: () => seedBroadcasts(),
      reports: () => seedReports(),
    };

    setGlobalStatus('running');
    setStatuses({});
    setErrors({});

    for (const col of COLLECTIONS) {
      setStatus(col.key, 'running');
      try {
        await dynamicSeedFunctions[col.key]();
        setStatus(col.key, 'done');
      } catch (err: any) {
        setStatus(col.key, 'error');
        setError(col.key, err?.message ?? 'Unknown error');
      }
    }

    setGlobalStatus('done');
  };

  const doneCount = Object.values(statuses).filter((s) => s === 'done').length;
  const errorCount = Object.values(statuses).filter((s) => s === 'error').length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>🌱</div>
          <div>
            <h1 style={styles.title}>Firestore Seed Tool</h1>
            <p style={styles.subtitle}>
              Isi semua collection Firestore dengan data dummy untuk development & testing.
            </p>
          </div>
        </div>

        {/* Auth status */}
        {authUser === undefined ? (
          <div style={{ ...styles.warningBox, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
            <span style={styles.warningIcon}>⏳</span>
            <p style={{ margin: 0, fontSize: 14, color: '#1d4ed8' }}>Memeriksa status login...</p>
          </div>
        ) : authUser ? (
          <div style={{ ...styles.warningBox, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
            <span style={styles.warningIcon}>✅</span>
            <div>
              <p style={{ ...styles.warningTitle, color: '#166534' }}>Login aktif: {authUser.email}</p>
              <p style={styles.warningText}>
                Data lansia, devices, notifications & emergency akan ter-link ke UID kamu: <code style={styles.code}>{authUser.uid}</code>
              </p>
            </div>
          </div>
        ) : (
          <div style={{ ...styles.warningBox, backgroundColor: '#fff1f2', borderColor: '#fca5a5' }}>
            <span style={styles.warningIcon}>🔒</span>
            <div>
              <p style={{ ...styles.warningTitle, color: '#991b1b' }}>Belum Login!</p>
              <p style={styles.warningText}>
                Kamu harus login terlebih dahulu agar data seed ter-link ke akun kamu.
                Silakan <a href="/auth/login" style={{ color: '#1d4ed8' }}>login di sini</a> lalu kembali ke halaman ini.
              </p>
            </div>
          </div>
        )}

        {/* Warning */}
        <div style={styles.warningBox}>
          <span style={styles.warningIcon}>⚠️</span>
          <div>
            <p style={styles.warningTitle}>Perhatian</p>
            <p style={styles.warningText}>
              Script ini akan menambahkan dokumen baru ke Firestore. Jalankan hanya sekali.
              Dokumen yang sudah ada (dengan ID tetap) akan ditimpa.
              Halaman ini hanya untuk keperluan development.
            </p>
          </div>
        </div>

        {/* Collections preview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Collections yang akan di-seed</h2>
          <div style={styles.colGrid}>
            {COLLECTIONS.map((col) => {
              const status = statuses[col.key] ?? 'idle';
              return (
                <div key={col.key} style={styles.colItem}>
                  <div style={styles.colLeft}>
                    <span style={styles.colIcon}>
                      {status === 'idle' && '📄'}
                      {status === 'running' && '⏳'}
                      {status === 'done' && '✅'}
                      {status === 'error' && '❌'}
                    </span>
                    <div>
                      <p style={styles.colName}>{col.label}</p>
                      <p style={styles.colDesc}>{col.desc}</p>
                      {errors[col.key] && (
                        <p style={styles.errorText}>{errors[col.key]}</p>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(status === 'done' ? styles.badgeDone : {}),
                      ...(status === 'running' ? styles.badgeRunning : {}),
                      ...(status === 'error' ? styles.badgeError : {}),
                    }}
                  >
                    {status === 'idle' && 'Menunggu'}
                    {status === 'running' && 'Menyimpan...'}
                    {status === 'done' && 'Selesai'}
                    {status === 'error' && 'Error'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress summary */}
        {globalStatus !== 'idle' && (
          <div style={styles.progressBox}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(doneCount / COLLECTIONS.length) * 100}%`,
                }}
              />
            </div>
            <p style={styles.progressText}>
              {doneCount}/{COLLECTIONS.length} collection selesai
              {errorCount > 0 && ` • ${errorCount} error`}
            </p>
          </div>
        )}

        {/* Done result */}
        {globalStatus === 'done' && (
          <div
            style={{
              ...styles.resultBox,
              backgroundColor: errorCount > 0 ? '#fff7ed' : '#f0fdf4',
              borderColor: errorCount > 0 ? '#fdba74' : '#86efac',
            }}
          >
            <p style={{ margin: 0, fontSize: '24px' }}>
              {errorCount > 0 ? '⚠️' : '🎉'}
            </p>
            <div>
              <p style={styles.resultTitle}>
                {errorCount > 0
                  ? `Seed selesai dengan ${errorCount} error`
                  : 'Seed berhasil! Semua data berhasil ditambahkan ke Firestore.'}
              </p>
              <p style={styles.resultSub}>
                {doneCount} collection berhasil • {errorCount} gagal
              </p>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          style={{
            ...styles.button,
            ...(globalStatus === 'running' || !authUser ? styles.buttonDisabled : {}),
          }}
          onClick={runAll}
          disabled={globalStatus === 'running' || !authUser}
        >
          {globalStatus === 'running'
            ? '⏳ Menyimpan data...'
            : !authUser
              ? '🔒 Login Terlebih Dahulu'
              : globalStatus === 'done'
                ? '🔄 Jalankan Lagi'
                : '🌱 Mulai Seed Firestore'}
        </button>

        <p style={styles.note}>
          Setelah seed selesai, hapus atau proteksi halaman{' '}
          <code style={styles.code}>/seed</code> sebelum deploy ke production.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '720px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoBox: {
    fontSize: '48px',
    lineHeight: 1,
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 800,
    color: '#0f172a',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: '15px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  warningIcon: { fontSize: '22px', flexShrink: 0 },
  warningTitle: { margin: 0, fontWeight: 800, fontSize: '15px', color: '#92400e' },
  warningText: { margin: '6px 0 0', fontSize: '13px', color: '#78350f', lineHeight: 1.7 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
  },
  cardTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    fontWeight: 800,
    color: '#0f172a',
  },
  colGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  colItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  colLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  colIcon: { fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '2px' },
  colName: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' },
  colDesc: { margin: '3px 0 0', fontSize: '13px', color: '#64748b' },
  errorText: { margin: '4px 0 0', fontSize: '12px', color: '#dc2626', fontWeight: 600 },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  badgeDone: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeRunning: { backgroundColor: '#dbeafe', color: '#1e40af' },
  badgeError: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  progressBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '16px 20px',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    margin: '10px 0 0',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 600,
    textAlign: 'center',
  },
  resultBox: {
    borderRadius: '16px',
    border: '1px solid',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  resultTitle: { margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' },
  resultSub: { margin: '4px 0 0', fontSize: '13px', color: '#64748b' },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  note: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#94a3b8',
    margin: 0,
  },
  code: {
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    color: '#334155',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '16px',
    padding: '14px 18px',
    fontSize: '14px',
    color: '#1e40af',
    lineHeight: 1.7,
  },
};
