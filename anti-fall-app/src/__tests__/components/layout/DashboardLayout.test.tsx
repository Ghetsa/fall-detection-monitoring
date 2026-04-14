import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';

const replaceMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../components/common/Navbar', () => () => <div>Navbar Mock</div>);
jest.mock('../../../components/layout/CustomerSidebar', () => () => <div>Customer Sidebar Mock</div>);
jest.mock('../../../components/layout/AdminSidebar', () => () => <div>Admin Sidebar Mock</div>);

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when auth matches role', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '1' },
      role: 'customer',
      loading: false,
    });

    render(
      <DashboardLayout role="customer">
        <div>Page Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
    expect(screen.getByText('Customer Sidebar Mock')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('redirects unauthenticated user to login', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      role: null,
      loading: false,
    });

    render(
      <DashboardLayout role="customer">
        <div>Guarded</div>
      </DashboardLayout>
    );

    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith('/auth/login')
    );
  });

  it('redirects mismatched role to correct dashboard', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '1' },
      role: 'admin',
      loading: false,
    });

    render(
      <DashboardLayout role="customer">
        <div>Guarded</div>
      </DashboardLayout>
    );

    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith('/admin/dashboard')
    );
  });
});
