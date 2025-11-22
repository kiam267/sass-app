import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db'; // your drizzle client
import {
  tenants,
  customDomains,
} from '@/lib/drizzle/schema';
import { eq, or } from 'drizzle-orm';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const hostname = req.headers.get('host') || '';
  // kiam.localhost:3000

  console.log(hostname, 'hostname', pathname);

  let currentHost: string | null = hostname;

  // 🟦 DEVELOPMENT — subdomain.localhost:3000
  if (process.env.NODE_ENV === 'development') {
    currentHost = hostname.replace('.localhost:3000', '');
    // kiam
  }
  // 🟦 PRODUCTION — remove base domain (e.g., kiam.shariarkobirkiam.xyz)
  if (process.env.NODE_ENV === 'production') {
    const base = process.env.NEXT_PUBLIC_MAIN_DOMAIN; // e.g. "shariarkobirkiam.xyz"
    currentHost = hostname.replace(`.${base}`, '');
    // kiam
  }

  // If opening root domain (shariarkobirkiam.xyz) → do nothing
  if (
    !currentHost ||
    currentHost === process.env.NEXT_PUBLIC_MAIN_DOMAIN
  ) {
    return NextResponse.next();
  }

  // 🟦 1. Try Matching Custom Domain
  const customDomain = await db
    .select({
      tenantId: customDomains.tenantId,
      domain: customDomains.domain,
    })
    .from(customDomains)
    .where(eq(customDomains.domain, hostname))
    .limit(1);
  if (customDomain.length > 0) {
    const siteId = customDomain[0].tenantId;

    return NextResponse.rewrite(
      new URL(`/${siteId}${pathname}`, req.url)
    );
  }

  // 🟦 2. Try Matching Tenant Subdomain (slug)
  const tenant = await db
    .select({
      tenantId: tenants.id,
      slug: tenants.slug,
    })
    .from(tenants)
    .where(eq(tenants.slug, currentHost))
    .limit(1);

  if (tenant.length > 0) {
    const siteId = tenant[0].tenantId;
    return NextResponse.rewrite(
      new URL(`/${siteId}${pathname}`, req.url)
    );
  }

  // 🟥 No matching tenant → let root website load
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|public|static|favicon.ico).*)'],
};
