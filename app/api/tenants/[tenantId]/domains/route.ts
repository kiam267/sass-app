import { db, schema } from '@/lib/drizzle/db';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const token = req.headers
      .get('authorization')
      ?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { tenantId } = await params;

    // Verify tenant ownership
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(
        and(
          eq(schema.tenants.id, tenantId),
          eq(schema.tenants.userId, decoded.userId)
        )
      );

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const domains = await db
      .select()
      .from(schema.customDomains)
      .where(eq(schema.customDomains.tenantId, tenantId));

    return NextResponse.json({
      subdomainUrl: `https://${tenant.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
      customDomains: domains,
    });
  } catch (error) {
    console.error('[Get Domains Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const token = req.headers
      .get('authorization')
      ?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { tenantId } = await params;
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Verify tenant ownership
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(
        and(
          eq(schema.tenants.id, tenantId),
          eq(schema.tenants.userId, decoded.userId)
        )
      );

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Generate CNAME (in real world, you'd use a service like Vercel's API)
    // For now, we'll use a simple format
    const cname = `${tenant.slug}-${tenantId.slice(
      0,
      8
    )}.cname.vercel.sh`;

    // Create custom domain
    const [customDomain] = await db
      .insert(schema.customDomains)
      .values({
        tenantId,
        domain,
        cname,
        isVerified: false,
      })
      .returning();

    return NextResponse.json(customDomain, { status: 201 });
  } catch (error: any) {
    console.error('[Add Domain Error]', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Domain already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
