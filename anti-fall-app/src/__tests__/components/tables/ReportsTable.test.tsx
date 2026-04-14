import { render, screen } from '@testing-library/react';
import ReportsTable from '../../../components/tables/ReportsTable';

describe('ReportsTable', () => {
  it('renders report rows and statuses', () => {
    render(
      <ReportsTable
        reports={[
          {
            id: 'R-001',
            title: 'Laporan April',
            description: 'Ringkasan sistem',
            category: 'System',
            period: 'April 2026',
            generatedAt: '14 Apr 2026',
            status: 'Completed',
          },
          {
            id: 'R-002',
            title: 'Laporan Mei',
            description: 'Sedang diproses',
            category: 'Incident',
            period: 'Mei 2026',
            generatedAt: '15 Apr 2026',
            status: 'Processing',
          },
          {
            id: 'R-003',
            title: 'Laporan Juni',
            description: 'Ada error',
            category: 'Device',
            period: 'Juni 2026',
            generatedAt: '16 Apr 2026',
            status: 'Failed',
          },
        ] as any}
      />
    );

    expect(screen.getByText('Reports List')).toBeInTheDocument();
    expect(screen.getByText('Latest')).toBeInTheDocument();
    expect(screen.getByText('R-001')).toBeInTheDocument();
    expect(screen.getByText('Laporan Mei')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
