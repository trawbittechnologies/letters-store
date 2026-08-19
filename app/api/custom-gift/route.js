import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      occasion,
      recipientType,
      boxType,
      selectedAddons,
      recipientName,
      personalizedMessage,
      customerName,
      phone,
      totalPrice,
    } = body;

    const settings = getSettings();
    const addonsList = Array.isArray(selectedAddons)
      ? selectedAddons.map((a) => (typeof a === 'string' ? a : `${a.name} (₹${a.price})`)).join(', ')
      : 'None';

    const whatsappMsg = `*✨ Custom Bespoke Gift Inquiry — ${settings.brandName || 'LETTERS'}*

*Occasion:* ${occasion || 'Special Occasion'}
*For:* ${recipientType || 'Someone Special'} (${recipientName || 'Name not specified'})
*Packaging Box:* ${boxType?.name || boxType || 'Standard Luxury Box'}
*Selected Contents / Add-ons:* ${addonsList}

*Personalized Message / Engraving:*
"${personalizedMessage || 'No custom message specified'}"

*Customer Contact:*
• Name: ${customerName || 'Customer'}
• Phone: ${phone || 'N/A'}
*Estimated Total:* ₹${totalPrice || 0}

Please assist me in customizing this hamper!`;

    const cleanPhone = (settings.whatsappNumber || '919497219574').replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

    return NextResponse.json({
      success: true,
      whatsappUrl,
      whatsappMsg,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
