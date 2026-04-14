import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterView from '../../../views/auth/RegisterView';
import { registerWithEmail } from '../../../lib/auth';
import {
  showErrorAlert,
  showSuccessAlert,
} from '../../../lib/alerts';

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('../../../lib/auth', () => ({
  registerWithEmail: jest.fn(),
}));

jest.mock('../../../lib/alerts', () => ({
  showErrorAlert: jest.fn(),
  showSuccessAlert: jest.fn(),
}));

describe('RegisterView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form fields', () => {
    render(<RegisterView />);

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan nama lengkap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan email')).toBeInTheDocument();
  });

  it('prevents submit when passwords do not match', async () => {
    render(<RegisterView />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Masukkan nama lengkap'), 'Budi');
    await user.type(screen.getByPlaceholderText('Masukkan email'), 'budi@test.com');
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'secret');
    await user.type(screen.getByPlaceholderText('Masukkan ulang password'), 'different');
    await user.click(screen.getByRole('button', { name: /Register/i }));

    expect(registerWithEmail).not.toHaveBeenCalled();
    expect(showErrorAlert).toHaveBeenCalledWith(
      'Register gagal',
      'Password dan konfirmasi password tidak sama.'
    );
  });

  it('registers and redirects to login on success', async () => {
    (registerWithEmail as jest.Mock).mockResolvedValue(undefined);

    render(<RegisterView />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Masukkan nama lengkap'), 'Budi');
    await user.type(screen.getByPlaceholderText('Masukkan email'), 'budi@test.com');
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'secret');
    await user.type(screen.getByPlaceholderText('Masukkan ulang password'), 'secret');
    await user.click(screen.getByRole('button', { name: /^Register$/i }));

    await waitFor(() =>
      expect(registerWithEmail).toHaveBeenCalledWith({
        fullName: 'Budi',
        email: 'budi@test.com',
        password: 'secret',
      })
    );

    expect(showSuccessAlert).toHaveBeenCalledWith('Register berhasil');
    expect(pushMock).toHaveBeenCalledWith('/auth/login');
  });
});
