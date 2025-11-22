import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { account } = await createAdminClient();

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true, userId: session.userId });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Invalid credentials' },
      { status: 401 }
    );
  }
}
