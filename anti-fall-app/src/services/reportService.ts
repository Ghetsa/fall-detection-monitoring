import { ReportItem, ReportSummary } from '../types/report';

export function getReportSummary(): ReportSummary {
  return {
    totalUsers: 120,
    totalDevices: 95,
    activeDevices: 87,
    totalIncidents: 35,
    monthlyReports: 12,
  };
}

export function getReports(): ReportItem[] {
  return [
    {
      id: 'RPT-001',
      title: 'Monthly Incident Report',
      category: 'Incident',
      period: 'April 2026',
      generatedAt: '2026-04-12 10:20 WIB',
      status: 'Completed',
      description: 'Ringkasan seluruh kejadian jatuh selama bulan April.',
    },
    {
      id: 'RPT-002',
      title: 'Active Device Report',
      category: 'Device',
      period: 'Weekly',
      generatedAt: '2026-04-11 08:15 WIB',
      status: 'Completed',
      description: 'Laporan perangkat aktif dan perangkat offline minggu ini.',
    },
    {
      id: 'RPT-003',
      title: 'User Activity Report',
      category: 'User',
      period: 'April 2026',
      generatedAt: '2026-04-10 14:30 WIB',
      status: 'Processing',
      description: 'Laporan aktivitas user customer dan admin.',
    },
    {
      id: 'RPT-004',
      title: 'System Health Report',
      category: 'System',
      period: 'Today',
      generatedAt: '2026-04-12 09:00 WIB',
      status: 'Completed',
      description: 'Status API, database, dan cloud service.',
    },
  ];
}