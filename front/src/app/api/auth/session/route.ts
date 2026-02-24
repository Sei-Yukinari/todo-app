import { NextRequest, NextResponse } from 'next/server';

// This route exchanges a Firebase ID token for a session cookie set via the API (BFF).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;
    if (!idToken) {
      return NextResponse.json({ error: { message: 'Missing idToken' } }, { status: 400 });
    }

    // Forward to backend API that uses firebase-admin to create session cookie
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include',
    });

    if (!res.ok) {
      const json = await res.json();
      return NextResponse.json({ error: { message: json.error?.message || 'Failed to create session' } }, { status: res.status });
    }

    // Propagate Set-Cookie header from backend
    const cookie = res.headers.get('set-cookie');
    const response = NextResponse.json({ data: { message: 'Session created' } }, { status: 200 });
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, { status: 500 });
  }
}
