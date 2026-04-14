import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => 'user-doc'),
  getDoc: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../../lib/firebase', () => ({
  auth: {},
  db: {},
}));

function Consumer() {
  const { user, role, loading } = useAuth();

  return (
    <div>
      <span>{user?.displayName ?? 'no-user'}</span>
      <span>{role ?? 'no-role'}</span>
      <span>{loading ? 'loading' : 'ready'}</span>
    </div>
  );
}

function renderWithProvider(children: ReactNode) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  it('throws when used outside provider', () => {
    const BrokenConsumer = () => {
      useAuth();
      return null;
    };

    expect(() => render(<BrokenConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('builds auth state from firebase user profile', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth, callback: (value: any) => void) => {
        void callback({
          uid: 'firebase-1',
          displayName: 'Firebase User',
          email: 'firebase@test.com',
          photoURL: 'photo.png',
        });
        return jest.fn();
      }
    );
    (getDoc as jest.Mock).mockResolvedValue({
      data: () => ({ role: 'admin' }),
    });

    renderWithProvider(<Consumer />);

    await waitFor(() =>
      expect(screen.getByText('Firebase User')).toBeInTheDocument()
    );
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('ready')).toBeInTheDocument();
  });

  it('falls back to customer when firestore role fetch fails', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth, callback: (value: any) => void) => {
        void callback({
          uid: 'firebase-2',
          displayName: 'Fallback User',
          email: 'fallback@test.com',
          photoURL: null,
        });
        return jest.fn();
      }
    );
    (getDoc as jest.Mock).mockRejectedValue(new Error('failed'));

    renderWithProvider(<Consumer />);

    await waitFor(() =>
      expect(screen.getByText('Fallback User')).toBeInTheDocument()
    );
    expect(screen.getByText('customer')).toBeInTheDocument();
  });

  it('uses next-auth session when firebase user is missing', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth, callback: (value: any) => void) => {
        void callback(null);
        return jest.fn();
      }
    );
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'oauth@test.com',
          fullname: 'OAuth User',
          name: 'OAuth User',
          image: 'oauth.png',
          role: 'customer',
          uid: 'oauth-uid',
        },
      },
      status: 'authenticated',
    });

    renderWithProvider(<Consumer />);

    await waitFor(() =>
      expect(screen.getByText('OAuth User')).toBeInTheDocument()
    );
    expect(screen.getByText('customer')).toBeInTheDocument();
  });

  it('reports loading when both firebase and session are still loading', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(() => jest.fn());
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    renderWithProvider(<Consumer />);

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.getByText('no-user')).toBeInTheDocument();
  });
});
