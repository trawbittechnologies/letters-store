import { NextResponse } from 'next/server';
import {
  getFestivalHampers,
  getFestivals,
  resolveShowcaseFestival,
  createFestival,
  updateFestival,
  deleteFestival,
  addProductToFestival,
  updateFestivalProduct,
  deleteFestivalProduct,
  toggleFestivalProduct,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const festivalHampers = getFestivalHampers();
    const festivals = getFestivals();
    const showcaseFestival = resolveShowcaseFestival(festivals);
    return NextResponse.json(
      { success: true, festivalHampers, festivals, showcaseFestival },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.festivalId && body.product) {
      const result = addProductToFestival(body.festivalId, body.product);
      const festivalHampers = getFestivalHampers();
      return NextResponse.json(
        { success: true, product: result.newProduct, festival: result.festival, festivalHampers },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // Creating festival or fallback
    const newFestival = createFestival(body);
    const festivalHampers = getFestivalHampers();
    return NextResponse.json(
      { success: true, festival: newFestival, festivalHampers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (body.action === 'toggle_product' && body.festivalId && body.productId) {
      toggleFestivalProduct(body.festivalId, body.productId);
      const festivalHampers = getFestivalHampers();
      return NextResponse.json(
        { success: true, festivalHampers },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    if (body.action === 'update_product' && body.festivalId && body.productId) {
      updateFestivalProduct(body.festivalId, body.productId, body.productData);
      const festivalHampers = getFestivalHampers();
      return NextResponse.json(
        { success: true, festivalHampers },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    if (body.id) {
      updateFestival(body.id, body.itemData || body.data || body);
      const festivalHampers = getFestivalHampers();
      return NextResponse.json(
        { success: true, festivalHampers },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    const festivalHampers = getFestivalHampers();
    return NextResponse.json(
      { success: true, festivalHampers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const festivalId = searchParams.get('id') || searchParams.get('festivalId');
    const productId = searchParams.get('productId');

    if (festivalId && productId) {
      deleteFestivalProduct(festivalId, productId);
    } else if (festivalId) {
      deleteFestival(festivalId);
    }
    const festivalHampers = getFestivalHampers();
    return NextResponse.json(
      { success: true, festivalHampers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

