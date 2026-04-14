const redirectMock = jest.fn((url: URL) => ({
  type: 'redirect',
  destination: url.toString(),
}));
const nextMock = jest.fn(() => ({ type: 'next' }));

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => redirectMock(url),
    next: () => nextMock(),
  },
}));

import { config, proxy } from '../proxy';

function createRequest(pathname: string, cookies: Record<string, string> = {}) {
  return {
    url: `http://localhost:3000${pathname}`,
    nextUrl: { pathname },
    cookies: {
      get: (key: string) =>
        cookies[key] ? { value: cookies[key] } : undefined,
    },
  } as any;
}

describe('proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects unauthenticated users to login', () => {
    const response = proxy(createRequest('/customer/dashboard'));

    expect(redirectMock).toHaveBeenCalled();
    expect(response).toEqual({
      type: 'redirect',
      destination: 'http://localhost:3000/auth/login',
    });
  });

  it('redirects customer away from admin route', () => {
    const response = proxy(
      createRequest('/admin/users', {
        anti_fall_session: 'active',
        anti_fall_role: 'customer',
      })
    );

    expect(response).toEqual({
      type: 'redirect',
      destination: 'http://localhost:3000/customer/dashboard',
    });
  });

  it('redirects admin away from customer route', () => {
    const response = proxy(
      createRequest('/customer/logs', {
        anti_fall_session: 'active',
        anti_fall_role: 'admin',
      })
    );

    expect(response).toEqual({
      type: 'redirect',
      destination: 'http://localhost:3000/admin/dashboard',
    });
  });

  it('allows request when role cookie is still missing during hydration', () => {
    const response = proxy(
      createRequest('/customer/dashboard', {
        anti_fall_session: 'active',
      })
    );

    expect(nextMock).toHaveBeenCalled();
    expect(response).toEqual({ type: 'next' });
  });

  it('redirects authenticated auth page access to dashboard', () => {
    const response = proxy(
      createRequest('/auth/login', {
        anti_fall_session: 'active',
        anti_fall_role: 'admin',
      })
    );

    expect(response).toEqual({
      type: 'redirect',
      destination: 'http://localhost:3000/admin/dashboard',
    });
  });

  it('exports matcher configuration', () => {
    expect(config.matcher).toEqual([
      '/admin/:path*',
      '/customer/:path*',
      '/auth/:path*',
    ]);
  });
});
