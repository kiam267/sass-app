import { db, schema } from '@/lib/drizzle/db';
import { verifyPassword } from '@/lib/auth/bcrypt';
import { generateToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// CORS helper for Next.js route handler
function handleCors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*'); // or your frontend domain
  res.headers.set(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return res;
}

export async function POST(req: NextRequest) {
  try {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return handleCors(
        NextResponse.json({}, { status: 204 })
      );
    }

    const { email, password } = await req.json();
    console.log(email, password, 'login');

    if (!email || !password) {
      return handleCors(
        NextResponse.json(
          { error: 'Missing email or password' },
          { status: 400 }
        )
      );
    }

    // Find user
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (!user) {
      return handleCors(
        NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      );
    }

    // Verify password
    const isValid = await verifyPassword(
      password,
      user.password
    );
    if (!isValid) {
      return handleCors(
        NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return handleCors(
      NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    );
  } catch (error) {
    console.error('[Login Error]', error);
    return handleCors(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    );
  }
}

// Optional: handle preflight requests for OPTIONS
export async function OPTIONS(req: NextRequest) {
  return handleCors(NextResponse.json({}, { status: 204 }));
}
