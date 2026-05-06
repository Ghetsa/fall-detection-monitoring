import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Report, ReportCategory } from '../types/report';

export type { Report, ReportCategory };

type TimestampLike = {
  toDate?: () => Date;
};

type FirestoreDoc = Record<string, unknown>;

const COL = 'reports';

function getMonthRange(periodMonth: string) {
  const [yearText, monthText] = periodMonth.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month || month < 1 || month > 12) {
    throw new Error('Periode laporan tidak valid.');
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as TimestampLike).toDate === 'function'
  ) {
    return (value as TimestampLike).toDate?.() ?? null;
  }

  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    !(value instanceof Date)
  ) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isWithinPeriod(value: unknown, start: Date, end: Date) {
  const date = toDate(value);
  if (!date) return false;
  return date >= start && date < end;
}

function formatPeriodLabel(periodMonth: string) {
  const { start } = getMonthRange(periodMonth);
  return start.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

export async function getReports(): Promise<Report[]> {
  const q = query(collection(db, COL), orderBy('generatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
}

export async function getReportSummary(): Promise<{
  totalUsers: number;
  totalDevices: number;
  activeDevices: number;
  totalIncidents: number;
  monthlyReports: number;
}> {
  const [usersSnap, devicesSnap, incidentsSnap, reportsSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'devices')),
    getDocs(collection(db, 'incidents')),
    getDocs(collection(db, COL)),
  ]);

  const activeDevices = devicesSnap.docs.filter((d) => d.data().isOnline === true).length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyReports = reportsSnap.docs.filter((d) => {
    const gen = d.data().generatedAt?.toDate?.();
    return gen && gen >= startOfMonth;
  }).length;

  return {
    totalUsers: usersSnap.size,
    totalDevices: devicesSnap.size,
    activeDevices,
    totalIncidents: incidentsSnap.size,
    monthlyReports,
  };
}

export async function generateReport(
  category: ReportCategory,
  periodMonth: string
): Promise<string> {
  const { start, end } = getMonthRange(periodMonth);
  const periodLabel = formatPeriodLabel(periodMonth);

  const [usersSnap, devicesSnap, incidentsSnap, reportsSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'devices')),
    getDocs(collection(db, 'incidents')),
    getDocs(collection(db, COL)),
  ]);

  const users = usersSnap.docs.map((doc) => doc.data() as FirestoreDoc);
  const devices = devicesSnap.docs.map((doc) => doc.data() as FirestoreDoc);
  const incidents = incidentsSnap.docs.map((doc) => doc.data() as FirestoreDoc);
  const reports = reportsSnap.docs.map((doc) => doc.data() as FirestoreDoc);

  let title = '';
  let description = '';
  let data: Record<string, unknown> = {};

  if (category === 'Incident') {
    const periodIncidents = incidents.filter((item) =>
      isWithinPeriod(item.timestamp, start, end)
    );

    title = `Laporan Insiden ${periodLabel}`;
    description = `Ringkasan kejadian insiden yang tercatat pada periode ${periodLabel}.`;
    data = {
      totalIncidents: periodIncidents.length,
      resolvedIncidents: periodIncidents.filter((item) => item.isResolved).length,
      unresolvedIncidents: periodIncidents.filter((item) => !item.isResolved).length,
      fallDetected: periodIncidents.filter((item) => item.type === 'fall_detected').length,
      batteryLow: periodIncidents.filter((item) => item.type === 'battery_low').length,
      sosCount: periodIncidents.filter((item) => item.type === 'sos').length,
      deviceOffline: periodIncidents.filter((item) => item.type === 'device_offline').length,
      safeStatus: periodIncidents.filter((item) => item.type === 'safe').length,
    };
  }

  if (category === 'Device') {
    const devicesSeenInPeriod = devices.filter((item) =>
      isWithinPeriod(item.lastSeen, start, end)
    );
    const avgBattery =
      devices.length > 0
        ? Math.round(
            devices.reduce((total, item) => total + Number(item.batteryLevel || 0), 0) /
              devices.length
          )
        : 0;

    title = `Laporan Device ${periodLabel}`;
    description = `Status perangkat monitoring pada periode ${periodLabel}.`;
    data = {
      totalDevices: devices.length,
      activeDevices: devices.filter((item) => item.isOnline).length,
      offlineDevices: devices.filter((item) => !item.isOnline).length,
      assignedDevices: devices.filter((item) => item.lansiaId).length,
      availableDevices: devices.filter((item) => !item.lansiaId).length,
      avgBattery,
      devicesSeenInPeriod: devicesSeenInPeriod.length,
    };
  }

  if (category === 'User') {
    const newUsersThisPeriod = users.filter((item) =>
      isWithinPeriod(item.createdAt, start, end)
    );

    title = `Laporan Pengguna ${periodLabel}`;
    description = `Ringkasan data pengguna dan pertumbuhan akun pada periode ${periodLabel}.`;
    data = {
      totalUsers: users.length,
      adminUsers: users.filter((item) => item.role === 'admin').length,
      customerUsers: users.filter((item) => item.role === 'customer').length,
      newUsersThisPeriod: newUsersThisPeriod.length,
    };
  }

  if (category === 'System') {
    const incidentsInPeriod = incidents.filter((item) =>
      isWithinPeriod(item.timestamp, start, end)
    );
    const reportsInPeriod = reports.filter((item) =>
      isWithinPeriod(item.generatedAt, start, end)
    );

    title = `Laporan Sistem ${periodLabel}`;
    description = `Ringkasan kondisi sistem dan aktivitas utama pada periode ${periodLabel}.`;
    data = {
      totalUsers: users.length,
      totalDevices: devices.length,
      activeDevices: devices.filter((item) => item.isOnline).length,
      incidentsInPeriod: incidentsInPeriod.length,
      reportsGeneratedInPeriod: reportsInPeriod.length,
      systemStatus: 'Healthy',
    };
  }

  const ref = await addDoc(collection(db, COL), {
    title,
    category,
    period: periodLabel,
    status: 'Completed',
    description,
    data,
    generatedAt: serverTimestamp(),
  });

  return ref.id;
}
