describe('nextauth config', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = 'secret';
    process.env.GOOGLE_CLIENT_ID = 'google-id';
    process.env.GOOGLE_CLIENT_SECRET = 'google-secret';
    process.env.GITHUB_CLIENT_ID = 'github-id';
    process.env.GITHUB_CLIENT_SECRET = 'github-secret';
  });

  it('builds providers and maps existing oauth users in jwt/session callbacks', async () => {
    jest.doMock('next-auth', () => {
      const nextAuth = jest.fn(() => 'nextauth-handler');
      return {
        __esModule: true,
        default: nextAuth,
      };
    });
    jest.doMock('next-auth/providers/google', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'google', ...config })),
    }));
    jest.doMock('next-auth/providers/github', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'github', ...config })),
    }));
    jest.doMock('firebase/firestore', () => ({
      doc: jest.fn((_db, col, id) => `${col}-${id}`),
      getDoc: jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: 'stored@test.com',
          fullName: 'Stored User',
          photoURL: 'stored.png',
          role: 'admin',
        }),
      }),
      serverTimestamp: jest.fn(() => 'server-ts'),
      setDoc: jest.fn(),
    }));
    jest.doMock('../../lib/firebase', () => ({
      db: {},
    }));

    const mod = await import('../../pages/api/auth/[...nextauth]');
    const nextAuth = (await import('next-auth')).default as jest.Mock;

    expect(nextAuth).toHaveBeenCalledWith(mod.authOptions);
    expect(mod.authOptions.providers).toHaveLength(2);

    const token = await mod.authOptions.callbacks!.jwt!({
      token: {},
      account: { provider: 'google' },
      user: {
        name: 'Google User',
        email: 'oauth@test.com',
        image: 'oauth.png',
      },
    } as any);

    expect(token).toEqual(
      expect.objectContaining({
        email: 'stored@test.com',
        name: 'Stored User',
        picture: 'stored.png',
        fullname: 'Stored User',
        role: 'admin',
        type: 'google',
      })
    );

    const session = await mod.authOptions.callbacks!.session!({
      session: { user: {} },
      token,
    } as any);

    expect(session.user).toEqual(
      expect.objectContaining({
        email: 'stored@test.com',
        name: 'Stored User',
        image: 'stored.png',
        fullname: 'Stored User',
        role: 'admin',
        type: 'google',
      })
    );
    expect(mod.authOptions.pages?.signIn).toBe('/auth/login');
  });

  it('creates a customer profile for new oauth users and preserves non-oauth tokens', async () => {
    jest.doMock('next-auth', () => ({
      __esModule: true,
      default: jest.fn(() => 'nextauth-handler'),
    }));
    jest.doMock('next-auth/providers/google', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'google', ...config })),
    }));
    jest.doMock('next-auth/providers/github', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'github', ...config })),
    }));
    const setDocMock = jest.fn();
    jest.doMock('firebase/firestore', () => ({
      doc: jest.fn((_db, col, id) => `${col}-${id}`),
      getDoc: jest.fn().mockResolvedValue({
        exists: () => false,
      }),
      serverTimestamp: jest.fn(() => 'server-ts'),
      setDoc: setDocMock,
    }));
    jest.doMock('../../lib/firebase', () => ({
      db: {},
    }));

    const mod = await import('../../pages/api/auth/[...nextauth]');

    const token = await mod.authOptions.callbacks!.jwt!({
      token: { keep: 'value' },
      account: { provider: 'github' },
      user: {
        name: 'GitHub User',
        email: 'newuser@test.com',
        image: 'new.png',
      },
    } as any);

    expect(setDocMock).toHaveBeenCalledWith(
      'users-newuser@test.com',
      expect.objectContaining({
        uid: 'newuser@test.com',
        fullName: 'GitHub User',
        email: 'newuser@test.com',
        role: 'customer',
        provider: 'github',
        createdAt: 'server-ts',
      }),
      { merge: true }
    );
    expect(token).toEqual(
      expect.objectContaining({
        keep: 'value',
        email: 'newuser@test.com',
        fullname: 'GitHub User',
        role: 'customer',
        type: 'github',
      })
    );

    const untouched = await mod.authOptions.callbacks!.jwt!({
      token: { keep: 'still-here' },
      account: { provider: 'credentials' },
      user: undefined,
    } as any);

    expect(untouched).toEqual({ keep: 'still-here' });
  });

  it('throws when oauth profile has no email and can omit providers without env', async () => {
    process.env.GOOGLE_CLIENT_ID = '';
    process.env.GOOGLE_CLIENT_SECRET = '';
    process.env.GITHUB_CLIENT_ID = '';
    process.env.GITHUB_CLIENT_SECRET = '';

    jest.doMock('next-auth', () => ({
      __esModule: true,
      default: jest.fn(() => 'nextauth-handler'),
    }));
    jest.doMock('next-auth/providers/google', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'google', ...config })),
    }));
    jest.doMock('next-auth/providers/github', () => ({
      __esModule: true,
      default: jest.fn((config) => ({ id: 'github', ...config })),
    }));
    jest.doMock('firebase/firestore', () => ({
      doc: jest.fn(),
      getDoc: jest.fn(),
      serverTimestamp: jest.fn(() => 'server-ts'),
      setDoc: jest.fn(),
    }));
    jest.doMock('../../lib/firebase', () => ({
      db: {},
    }));

    const mod = await import('../../pages/api/auth/[...nextauth]');

    expect(mod.authOptions.providers).toHaveLength(0);
    await expect(
      mod.authOptions.callbacks!.jwt!({
        token: {},
        account: { provider: 'google' },
        user: { name: 'No Email User', email: null, image: null },
      } as any)
    ).rejects.toThrow('OAuth account does not have an email address.');
  });
});
