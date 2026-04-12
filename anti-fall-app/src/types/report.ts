export type ReportSummary = {
  totalUsers: number;
  totalDevices: number;
  activeDevices: number;
  totalIncidents: number;
  monthlyReports: number;
};

export type ReportItem = {
  id: string;
  title: string;
  category: 'Incident' | 'Device' | 'User' | 'System';
  period: string;
  generatedAt: string;
  status: 'Completed' | 'Processing' | 'Failed';
  description: string;
};