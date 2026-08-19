import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, message: 'Name and message are required' }, { status: 400 });
    }

    const settings = getSettings();
    const whatsappMsg = `*New Contact Inquiry — ${settings.brandName || 'LETTERS'}*
• Name: ${name}
• Email: ${email || 'N/A'}
• Phone: ${phone || 'N/A'}
• Subject: ${subject || 'General Inquiry'}

*Message:*
${message}`;

    const cleanPhone = (settings.whatsappNumber || '919497219574').replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. Thank you for reaching out!',
      whatsappUrl,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
