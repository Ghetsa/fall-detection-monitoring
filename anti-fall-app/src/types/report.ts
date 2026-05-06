export type ReportCategory = 'Incident' | 'Device' | 'User' | 'System';

export type ReportSummary = {
  totalUsers: number;
  totalDevices: number;
  activeDevices: number;
  totalIncidents: number;
  monthlyReports: number;
};

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  period: string;
  generatedAt: unknown;
  status: 'Completed' | 'Processing';
  description: string;
  data: Record<string, unknown>;
}
