import { render, screen } from '@testing-library/react';
import ReportSummaryCard from '../../../components/cards/ReportSummaryCard';

describe('ReportSummaryCard', () => {
  it('renders summary content with custom value color', () => {
    render(
      <ReportSummaryCard
        title="Total Users"
        value={12}
        description="Jumlah akun terdaftar"
        valueColor="#2563eb"
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Jumlah akun terdaftar')).toBeInTheDocument();
  });
});
