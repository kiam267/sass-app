import { db, schema } from './db';
import { eq } from 'drizzle-orm';

export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'shariarkobirkiam.xyz';

/**
 * Extract tenant slug from hostname
 * Examples:
 * - alif.shariarkobirkiam.xyz -> alif
 * - shariarkobirkiam.xyz -> null (main app)
 * - alif.com -> null (custom domain, handle separately)
 */
export function getTenantSlugFromHost(host: string): string | null {
  // Remove port if exists
  const hostname = host.split(':')[0];
  
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    return null;
  }

  // Check if it's a subdomain of main domain
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    return hostname.replace(`.${MAIN_DOMAIN}`, '');
  }

  // It's a custom domain
  return null;
}

/**
 * Find tenant by slug or custom domain
 */
export async function getTenantByHost(host: string) {
  const hostname = host.split(':')[0];

  // Check if it's a subdomain
  const slug = getTenantSlugFromHost(hostname);
  if (slug) {
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, slug))
      .limit(1);
    return tenant;
  }

  // Check if it's a custom domain
  const [customDomain] = await db
    .select()
    .from(schema.customDomains)
    .where(eq(schema.customDomains.domain, hostname))
    .limit(1);

  if (customDomain && customDomain.isVerified) {
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, customDomain.tenantId))
      .limit(1);
    return tenant;
  }

  return null;
}

/**
 * Get full subdomain URL
 */
export function getSubdomainUrl(slug: string) {
  return `https://${slug}.${MAIN_DOMAIN}`;
}
