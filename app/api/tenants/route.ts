import { getDb, schema } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
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

    const db = getDb();
    const userTenants = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.userId, decoded.userId));

    return NextResponse.json(userTenants);
  } catch (error) {
    console.error('[Get Tenants Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
