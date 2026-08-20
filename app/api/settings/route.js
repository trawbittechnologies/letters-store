import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getSettings, updateSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = updateSettings(body);
    revalidateTag('settings');
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
