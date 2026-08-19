import { NextResponse } from 'next/server';
import { getOrders, createOrder, getSettings } from '@/lib/db';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.customerName && !body.name) {
      return NextResponse.json({ success: false, message: 'Customer name is required' }, { status: 400 });
    }

    const order = createOrder(body);
    const settings = getSettings();

    // Generate WhatsApp link and prefilled message
    let itemsText = '';
    (order.items || []).forEach((item, index) => {
      itemsText += `${index + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}\n`;
      if (item.customization?.recipientName || item.customization?.personalizedMessage) {
        itemsText += `   ↳ For: ${item.customization.recipientName || 'N/A'}${item.customization.personalizedMessage ? ` | Msg: "${item.customization.personalizedMessage}"` : ''}\n`;
      }
    });

    const whatsappMessage = `*${settings.orderMessagePrefix || 'New Order — LETTERS'}*
Order ID: #${order.id}

*Customer:*
• Name: ${order.customerName}
• Phone: ${order.phone}
• WhatsApp: ${order.whatsappNumber}
• Address: ${order.address}, PIN: ${order.pincode}
• Preferred Delivery: ${order.deliveryDate || 'Standard'}
• Occasion: ${order.occasion || 'Celebration'}

*Items Ordered:*
${itemsText}*Total Amount:* ₹${order.total}

*Customization Details:*
${order.customization || 'None'}

*Special Instructions:*
${order.specialInstructions || 'None'}

Please confirm this order.`;

    const cleanPhone = (settings.whatsappNumber || '919497219574').replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json(
      {
        success: true,
        order,
        whatsappMessage,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
