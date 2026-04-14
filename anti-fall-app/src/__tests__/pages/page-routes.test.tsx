import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const replaceMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock('../../views/auth/LoginView', () => () => <div>Login View Mock</div>);
jest.mock('../../views/auth/RegisterView', () => () => <div>Register View Mock</div>);
jest.mock('../../views/customer/CustomerDashboardView', () => () => <div>Customer Dashboard View Mock</div>);
jest.mock('../../views/customer/CustomerEmergencyView', () => () => <div>Customer Emergency View Mock</div>);
jest.mock('../../views/customer/CustomerLansiaView', () => () => <div>Customer Lansia View Mock</div>);
jest.mock('../../views/customer/CustomerLogsView', () => () => <div>Customer Logs View Mock</div>);
jest.mock('../../views/customer/CustomerNotificationsView', () => () => <div>Customer Notifications View Mock</div>);
jest.mock('../../views/customer/CustomerProfileView', () => () => <div>Customer Profile View Mock</div>);
jest.mock('../../views/customer/CustomerTrackingView', () => () => <div>Customer Tracking View Mock</div>);
jest.mock('../../views/admin/AdminDashboardView', () => () => <div>Admin Dashboard View Mock</div>);
jest.mock('../../views/admin/AdminBroadcastsView', () => () => <div>Admin Broadcasts View Mock</div>);
jest.mock('../../views/admin/AdminIncidentsView', () => () => <div>Admin Incidents View Mock</div>);
jest.mock('../../views/admin/AdminProfileView', () => () => <div>Admin Profile View Mock</div>);
jest.mock('../../views/admin/AdminReportsView', () => () => <div>Admin Reports View Mock</div>);
jest.mock('../../views/admin/AdminSettingsView', () => () => <div>Admin Settings View Mock</div>);
jest.mock('../../views/admin/AdminUsersView', () => () => <div>Admin Users View Mock</div>);

import LoginPage from '../../pages/auth/login';
import RegisterPage from '../../pages/auth/register';
import CustomerDashboardPage from '../../pages/customer/dashboard';
import CustomerEmergencyPage from '../../pages/customer/emergency';
import CustomerLansiaPage from '../../pages/customer/lansia';
import CustomerLogsPage from '../../pages/customer/logs';
import CustomerNotificationsPage from '../../pages/customer/notifications';
import CustomerProfilePage from '../../pages/customer/profile';
import CustomerTrackingPage from '../../pages/customer/tracking';
import AdminDashboardPage from '../../pages/admin/dashboard';
import AdminBroadcastsPage from '../../pages/admin/broadcasts';
import AdminIncidentsPage from '../../pages/admin/incidents';
import AdminProfilePage from '../../pages/admin/profile';
import AdminReportsPage from '../../pages/admin/reports';
import AdminSettingsPage from '../../pages/admin/setting';
import AdminUsersPage from '../../pages/admin/users';
import AdminIndexPage from '../../pages/admin/index';
import CustomerIndexPage from '../../pages/customer/index';
import HomePage from '../../pages/index';

describe('page routes', () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it.each([
    [LoginPage, 'Login View Mock'],
    [RegisterPage, 'Register View Mock'],
    [CustomerDashboardPage, 'Customer Dashboard View Mock'],
    [CustomerEmergencyPage, 'Customer Emergency View Mock'],
    [CustomerLansiaPage, 'Customer Lansia View Mock'],
    [CustomerLogsPage, 'Customer Logs View Mock'],
    [CustomerNotificationsPage, 'Customer Notifications View Mock'],
    [CustomerProfilePage, 'Customer Profile View Mock'],
    [CustomerTrackingPage, 'Customer Tracking View Mock'],
    [AdminDashboardPage, 'Admin Dashboard View Mock'],
    [AdminBroadcastsPage, 'Admin Broadcasts View Mock'],
    [AdminIncidentsPage, 'Admin Incidents View Mock'],
    [AdminProfilePage, 'Admin Profile View Mock'],
    [AdminReportsPage, 'Admin Reports View Mock'],
    [AdminSettingsPage, 'Admin Settings View Mock'],
    [AdminUsersPage, 'Admin Users View Mock'],
  ])('renders wrapped view for %p', (Component, text) => {
    render(<Component />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('redirects admin index to dashboard', async () => {
    render(<AdminIndexPage />);
    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith('/admin/dashboard')
    );
  });

  it('redirects customer index to dashboard', async () => {
    render(<CustomerIndexPage />);
    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith('/customer/dashboard')
    );
  });

  it('renders landing page content', () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Monitoring Gelang Anti-Fall untuk Lansia/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mulai Sekarang/i })).toHaveAttribute(
      'href',
      '/auth/register'
    );
  });
});
