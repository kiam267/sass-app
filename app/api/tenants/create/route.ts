import { getDb, schema } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
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

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate slug
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
      return NextResponse.json(
        { error: 'Invalid slug format (lowercase, numbers, hyphens, min 3 chars)' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Create tenant
    const [tenant] = await db
      .insert(schema.tenants)
      .values({
        userId: decoded.userId,
        name,
        slug,
        description,
      })
      .returning();

    // Create default settings
    await db
      .insert(schema.tenantSettings)
      .values({
        tenantId: tenant.id,
      });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error: any) {
    console.error('[Create Tenant Error]', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
