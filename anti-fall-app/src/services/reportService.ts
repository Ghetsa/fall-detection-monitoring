import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Report {
  id: string;
  title: string;
  category: string;
  period: string;
  generatedAt: any;
  status: 'Completed' | 'Processing';
  description: string;
  data: Record<string, any>;
}

const COL = 'reports';

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
