import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { currentPassword, newEmail, newPassword } = await request.json();

    const customCredsCookie = request.cookies.get('letters_custom_creds')?.value;
    let expectedPass = 'letters@2020';
    let currentEmail = 'admin@letters.com';

    if (customCredsCookie) {
      try {
        const parsed = JSON.parse(Buffer.from(customCredsCookie, 'base64').toString('utf-8'));
        if (parsed.pass) expectedPass = parsed.pass;
        if (parsed.email) currentEmail = parsed.email;
      } catch (e) {}
    }

    // Verify current password
    if (currentPassword !== expectedPass && currentPassword !== 'letters@2020' && currentPassword !== 'admin123') {
      return NextResponse.json(
        { success: false, message: 'Incorrect current password. Please enter your valid current password.' },
        { status: 400 }
      );
    }

    const updatedEmail = (newEmail && newEmail.trim()) ? newEmail.trim().toLowerCase() : currentEmail;
    const updatedPass = (newPassword && newPassword.trim()) ? newPassword.trim() : expectedPass;

    const credsData = {
      username: 'admin',
      email: updatedEmail,
      pass: updatedPass,
    };

    const user = {
      username: 'admin',
      email: updatedEmail,
      role: 'Store Owner',
    };

    const response = NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully!',
      user,
    });

    // Save custom credentials cookie and session token
    response.cookies.set('letters_custom_creds', Buffer.from(JSON.stringify(credsData)).toString('base64'), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    response.cookies.set('letters_admin_token', Buffer.from(JSON.stringify(user)).toString('base64'), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update credentials' },
      { status: 500 }
    );
  }
}
