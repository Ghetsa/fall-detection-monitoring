import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../../components/common/Navbar';
import { useAuth } from '../../../hooks/useAuth';
import { logoutUser } from '../../../lib/auth';
import { showErrorAlert, showSuccessAlert } from '../../../lib/alerts';

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../lib/auth', () => ({
  logoutUser: jest.fn(),
}));

jest.mock('../../../lib/alerts', () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders guest actions when user is unauthenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      role: null,
    });

    render(<Navbar />);

    expect(screen.getByText('Customer Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Monitoring lansia secara real-time')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      '/auth/login'
    );
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute(
      'href',
      '/auth/register'
    );
  });

  it('shows mobile profile menu and closes on outside click', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        displayName: 'Mobile User',
        email: 'mobile@test.com',
        photoURL: '',
      },
      role: 'customer',
    });

    render(<Navbar isMobile title="Mobile Title" subtitle="Ignored subtitle" />);
    const user = userEvent.setup();

    expect(screen.getByText('Mobile Title')).toBeInTheDocument();
    expect(screen.queryByText('Ignored subtitle')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open profile menu/i }));

    expect(screen.getByText('Mobile User')).toBeInTheDocument();
    expect(screen.getByText('mobile@test.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Halaman Profil/i })).toHaveAttribute(
      'href',
      '/customer/profile'
    );

    fireEvent.mouseDown(document.body);
    await waitFor(() =>
      expect(screen.queryByText('mobile@test.com')).not.toBeInTheDocument()
    );
  });

  it('handles successful logout for authenticated desktop user', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        displayName: 'Admin User',
        email: 'admin@test.com',
        photoURL: 'avatar.png',
      },
      role: 'admin',
    });
    (logoutUser as jest.Mock).mockResolvedValue(undefined);

    render(<Navbar />);
    const user = userEvent.setup();

    expect(screen.getByText('admin • admin@test.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open profile menu/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => expect(logoutUser).toHaveBeenCalled());
    expect(showSuccessAlert).toHaveBeenCalledWith('Logout berhasil');
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows logout error when logout fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        displayName: 'Error User',
        email: 'error@test.com',
        photoURL: '',
      },
      role: 'customer',
    });
    (logoutUser as jest.Mock).mockRejectedValue(new Error('failed'));

    render(<Navbar />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /open profile menu/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('Logout gagal'));
    consoleErrorSpy.mockRestore();
  });
});
