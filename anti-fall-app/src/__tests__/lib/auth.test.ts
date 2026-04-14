import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import {
  clearAuthCookies,
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  setAuthCookies,
} from '../../lib/auth';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  deleteUser: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => 'doc-ref'),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'server-ts'),
  setDoc: jest.fn(),
}));

jest.mock('../../lib/firebase', () => ({
  auth: {},
  db: {},
}));

describe('auth lib', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    document.cookie = '';
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (signOut as jest.Mock).mockResolvedValue(undefined);
    (nextAuthSignOut as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('sets and clears auth cookies', () => {
    setAuthCookies('admin');
    expect(document.cookie).toContain('anti_fall_role=admin');

    clearAuthCookies();
    expect(document.cookie).not.toContain('anti_fall_role=admin');
  });

  it('logs in with email and resolves admin redirect', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'user-1', displayName: 'Admin', email: 'admin@test.com' },
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    });

    const result = await loginWithEmail({
      email: 'admin@test.com',
      password: 'secret',
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(result.role).toBe('admin');
    expect(result.redirectTo).toBe('/admin/dashboard');
    expect(document.cookie).toContain('anti_fall_role=admin');
  });

  it('registers user profile to firestore', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'user-2' },
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
    });

    await registerWithEmail({
      fullName: 'Budi',
      email: 'budi@test.com',
      password: 'secret',
      role: 'customer',
    });

    expect(updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ uid: 'user-2' }),
      { displayName: 'Budi' }
    );
    expect(setDoc).toHaveBeenCalledWith(
      'doc-ref',
      expect.objectContaining({
        uid: 'user-2',
        fullName: 'Budi',
        email: 'budi@test.com',
        role: 'customer',
        createdAt: 'server-ts',
      }),
      { merge: true }
    );
  });

  it('rolls back auth user when register fails after auth create', async () => {
    const createdUser = { uid: 'user-3' };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: createdUser,
    });
    (setDoc as jest.Mock).mockRejectedValue(new Error('firestore failed'));

    await expect(
      registerWithEmail({
        fullName: 'Dewi',
        email: 'dewi@test.com',
        password: 'secret',
      })
    ).rejects.toThrow('firestore failed');

    expect(deleteUser).toHaveBeenCalledWith(createdUser);
  });

  it('logs out from firebase and next-auth', async () => {
    await logoutUser();

    expect(signOut).toHaveBeenCalled();
    expect(nextAuthSignOut).toHaveBeenCalledWith({ redirect: false });
  });
});
