import { NextRequest, NextResponse } from 'next/server';
import { getTenantByHost } from './lib/tenant-utils';

export async function proxy(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Allow auth routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // For dashboard routes, check if accessing via subdomain/custom domain
  if (pathname.startsWith('/dashboard')) {
    const tenant = await getTenantByHost(hostname);

    if (tenant && pathname === '/dashboard') {
      // Redirect to tenant-specific dashboard
      return NextResponse.redirect(
        new URL(`/dashboard/${tenant.id}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|public|static).*)'],
};
