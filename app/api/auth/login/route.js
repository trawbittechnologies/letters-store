import { NextResponse } from 'next/server';

const validUsers = [
  { username: 'admin', email: 'admin@letters.com', pass: 'letters@2020' },
  { username: 'owner', email: 'owner@letters.com', pass: 'admin123' },
];

export async function POST(request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    const trimmed = usernameOrEmail.trim().toLowerCase();

    // Check custom credentials cookie if set
    const customCredsCookie = request.cookies.get('letters_custom_creds')?.value;
    if (customCredsCookie) {
      try {
        const parsed = JSON.parse(Buffer.from(customCredsCookie, 'base64').toString('utf-8'));
        if (
          (trimmed === parsed.username?.toLowerCase() || trimmed === parsed.email?.toLowerCase() || trimmed === 'admin') &&
          password === parsed.pass
        ) {
          const user = {
            username: parsed.username || 'admin',
            email: parsed.email || 'admin@letters.com',
            role: 'Store Owner',
          };

          const response = NextResponse.json({
            success: true,
            user,
            message: 'Logged in successfully',
          });

          response.cookies.set('letters_admin_token', Buffer.from(JSON.stringify(user)).toString('base64'), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          });

          return response;
        }
      } catch (e) {}
    }

    const matched = validUsers.find(
      (u) => (u.username === trimmed || u.email === trimmed) && u.pass === password
    );

    if (!matched) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials. Please try again.' },
        { status: 401 }
      );
    }

    const user = {
      username: matched.username,
      email: matched.email,
      role: 'Store Owner',
    };

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Logged in successfully',
    });

    // Set cookie for session
    response.cookies.set('letters_admin_token', Buffer.from(JSON.stringify(user)).toString('base64'), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
