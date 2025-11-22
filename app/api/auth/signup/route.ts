import { db, schema } from '@/lib/drizzle/db';
import { hashPassword } from '@/lib/auth/bcrypt';
import { generateToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/drizzle/schema';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(users.email, email));

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [user] = await db
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        name,
      })
      .returning();

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Signup Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
