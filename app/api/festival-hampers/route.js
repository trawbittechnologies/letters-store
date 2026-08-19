import { NextResponse } from 'next/server';
import {
  getFestivalHampers,
  updateFestivalHampersSection,
  addFestivalHamper,
  updateFestivalHamper,
  deleteFestivalHamper,
  toggleFestivalHamper,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const festivalHampers = getFestivalHampers();
    return NextResponse.json(
      { success: true, festivalHampers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = addFestivalHamper(body);
    return NextResponse.json(
      { success: true, item: result.newItem, festivalHampers: result.festivalHampers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (body.action === 'toggle' && body.id) {
      const updated = toggleFestivalHamper(body.id);
      return NextResponse.json(
        { success: true, festivalHampers: updated },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }
    if (body.id) {
      const updated = updateFestivalHamper(body.id, body.itemData || body);
      return NextResponse.json(
        { success: true, festivalHampers: updated },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }
    const updated = updateFestivalHampersSection(body);
    return NextResponse.json(
      { success: true, festivalHampers: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }
    const updated = deleteFestivalHamper(id);
    return NextResponse.json(
      { success: true, festivalHampers: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
