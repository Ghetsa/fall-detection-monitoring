import { NextRequest, NextResponse } from 'next/server';

function getDashboardByRole(role: string | undefined) {
  return role === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('anti_fall_session')?.value;
  const role = request.cookies.get('anti_fall_role')?.value;
  const isAuthenticated = session === 'active';

  const isAdminRoute = pathname.startsWith('/admin');
  const isCustomerRoute = pathname.startsWith('/customer');
  const isAuthRoute = pathname.startsWith('/auth');

  if ((isAdminRoute || isCustomerRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(
      new URL(getDashboardByRole(role), request.url)
    );
  }

  if (isCustomerRoute && role !== 'customer') {
    return NextResponse.redirect(
      new URL(getDashboardByRole(role), request.url)
    );
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL(getDashboardByRole(role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/auth/:path*'],
};