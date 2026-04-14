import { render, screen } from '@testing-library/react';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import CustomerSidebar from '../../../components/layout/CustomerSidebar';

const mockRouter = {
  pathname: '/admin/users',
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('sidebars', () => {
  beforeEach(() => {
    mockRouter.pathname = '/admin/users';
  });

  it('renders admin sidebar desktop with active link and footer', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('Anti Fall App')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/i })).toHaveAttribute(
      'href',
      '/admin/users'
    );
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('renders admin sidebar mobile navigation', () => {
    render(<AdminSidebar isMobile />);

    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute(
      'href',
      '/admin/dashboard'
    );
    expect(screen.getByRole('link', { name: /Reports/i })).toHaveAttribute(
      'href',
      '/admin/reports'
    );
  });

  it('hides desktop admin content when collapsed', () => {
    render(<AdminSidebar collapsed />);

    expect(screen.queryByText('Anti Fall App')).not.toBeInTheDocument();
    expect(screen.queryByText('System Status')).not.toBeInTheDocument();
  });

  it('renders customer sidebar desktop and mobile variants', () => {
    mockRouter.pathname = '/customer/tracking';
    const { rerender } = render(<CustomerSidebar />);

    expect(screen.getByText('Customer Panel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tracking/i })).toHaveAttribute(
      'href',
      '/customer/tracking'
    );
    expect(screen.getByText('Status Device')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();

    rerender(<CustomerSidebar isMobile />);
    expect(screen.getByRole('link', { name: /Kelola Lansia/i })).toHaveAttribute(
      'href',
      '/customer/lansia'
    );
    expect(screen.getByRole('link', { name: /Notifications/i })).toHaveAttribute(
      'href',
      '/customer/notifications'
    );
  });

  it('hides customer sidebar desktop content when collapsed', () => {
    render(<CustomerSidebar collapsed />);

    expect(screen.queryByText('Customer Panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Status Device')).not.toBeInTheDocument();
  });
});
