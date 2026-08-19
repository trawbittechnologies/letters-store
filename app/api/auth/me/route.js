import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.cookies.get('letters_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
