import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

// Default single admin credentials
const defaultAdmin = {
  username: 'admin',
  email: 'admin@letters.com',
  pass: 'letters@2020',
  role: 'Store Owner',
};

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
    let authenticatedUser = null;

    // 1. Check Neon PostgreSQL database if available
    if (sql) {
      try {
        const rows = await sql`
          SELECT id, username, email, password, role 
          FROM admins 
          WHERE LOWER(username) = ${trimmed} OR LOWER(email) = ${trimmed}
          LIMIT 1;
        `;
        if (rows && rows.length > 0) {
          const dbAdmin = rows[0];
          if (dbAdmin.password === password) {
            authenticatedUser = {
              username: dbAdmin.username,
              email: dbAdmin.email,
              role: dbAdmin.role || 'Store Owner',
            };
          }
        }
      } catch (err) {
        console.warn('Neon DB login query fallback:', err.message);
      }
    }

    // 2. Check custom credentials cookie if set
    if (!authenticatedUser) {
      const customCredsCookie = request.cookies.get('letters_custom_creds')?.value;
      if (customCredsCookie) {
        try {
          const parsed = JSON.parse(Buffer.from(customCredsCookie, 'base64').toString('utf-8'));
          if (
            (trimmed === parsed.username?.toLowerCase() || trimmed === parsed.email?.toLowerCase() || trimmed === 'admin') &&
            password === parsed.pass
          ) {
            authenticatedUser = {
              username: parsed.username || 'admin',
              email: parsed.email || 'admin@letters.com',
              role: 'Store Owner',
            };
          }
        } catch (e) {}
      }
    }

    // 3. Fallback to default single admin account
    if (!authenticatedUser) {
      if ((trimmed === defaultAdmin.username || trimmed === defaultAdmin.email) && password === defaultAdmin.pass) {
        authenticatedUser = {
          username: defaultAdmin.username,
          email: defaultAdmin.email,
          role: defaultAdmin.role,
        };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials. Please try again.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
      message: 'Logged in successfully',
    });

    // Set cookie for session (7 days)
    response.cookies.set('letters_admin_token', Buffer.from(JSON.stringify(authenticatedUser)).toString('base64'), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
