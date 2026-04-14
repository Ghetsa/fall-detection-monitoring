import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginView from '../../../views/auth/LoginView';
import { signIn, useSession } from 'next-auth/react';
import {
  clearAuthCookies,
  loginWithEmail,
  setAuthCookies,
} from '../../../lib/auth';
import {
  showErrorAlert,
  showSuccessAlert,
} from '../../../lib/alerts';

const pushMock = jest.fn();
const replaceMock = jest.fn();
const mockRouter = {
  push: pushMock,
  replace: replaceMock,
  query: {} as Record<string, string>,
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock('../../../lib/auth', () => ({
  clearAuthCookies: jest.fn(),
  loginWithEmail: jest.fn(),
  setAuthCookies: jest.fn(),
}));

jest.mock('../../../lib/alerts', () => ({
  showErrorAlert: jest.fn(),
  showSuccessAlert: jest.fn(),
}));

describe('LoginView', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.query = {};
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders login form and google action', () => {
    render(<LoginView />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Masuk dengan Google/i })).toBeInTheDocument();
  });

  it('submits email login successfully', async () => {
    (loginWithEmail as jest.Mock).mockResolvedValue({
      redirectTo: '/customer/dashboard',
    });

    render(<LoginView />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Masukkan email'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'secret');
    await user.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() =>
      expect(loginWithEmail).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'secret',
      })
    );
    expect(showSuccessAlert).toHaveBeenCalledWith('Login berhasil');
    expect(pushMock).toHaveBeenCalledWith('/customer/dashboard');
  });

  it('shows error on failed email login', async () => {
    (loginWithEmail as jest.Mock).mockRejectedValue(new Error('Email atau password salah.'));

    render(<LoginView />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Masukkan email'), 'wrong@test.com');
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() =>
      expect(showErrorAlert).toHaveBeenCalledWith(
        'Login gagal',
        'Email atau password salah.'
      )
    );
    expect(screen.getByText('Email atau password salah.')).toBeInTheDocument();
  });

  it('starts google sign-in flow', async () => {
    render(<LoginView />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Masuk dengan Google/i }));

    expect(clearAuthCookies).toHaveBeenCalled();
    expect(signIn).toHaveBeenCalledWith('google', {
      callbackUrl: 'http://localhost/auth/login?oauth=google',
    });
  });

  it('redirects after oauth session is authenticated', async () => {
    mockRouter.query = { oauth: 'google' };

    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: 'admin' } },
      status: 'authenticated',
    });

    render(<LoginView />);

    await waitFor(() => expect(setAuthCookies).toHaveBeenCalledWith('admin'));
    expect(showSuccessAlert).toHaveBeenCalledWith('Login Google berhasil');
    expect(replaceMock).toHaveBeenCalledWith('/admin/dashboard');
  });
});
