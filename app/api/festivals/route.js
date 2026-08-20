import { NextResponse } from 'next/server';
import {
  getFestivals,
  getFestivalById,
  createFestival,
  updateFestival,
  deleteFestival,
  addProductToFestival,
  updateFestivalProduct,
  deleteFestivalProduct,
  toggleFestivalProduct,
  resolveShowcaseFestival,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const festival = getFestivalById(id);
      if (!festival) {
        return NextResponse.json({ success: false, message: 'Festival not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: true, festival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    const festivals = getFestivals();
    const showcaseFestival = resolveShowcaseFestival(festivals);

    return NextResponse.json(
      { success: true, festivals, showcaseFestival },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Check if adding product to festival
    if (body.festivalId && body.product) {
      const result = addProductToFestival(body.festivalId, body.product);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, product: result.newProduct, festival: result.festival, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // Creating new festival
    const newFestival = createFestival(body);
    const festivals = getFestivals();
    const showcaseFestival = resolveShowcaseFestival(festivals);

    return NextResponse.json(
      { success: true, festival: newFestival, festivals, showcaseFestival },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // Handle product operations within festival
    if (body.action === 'toggle_product' && body.festivalId && body.productId) {
      const updated = toggleFestivalProduct(body.festivalId, body.productId);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, festival: updated, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    if (body.action === 'update_product' && body.festivalId && body.productId && body.productData) {
      const updated = updateFestivalProduct(body.festivalId, body.productId, body.productData);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, festival: updated, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // Update festival
    if (body.id) {
      const updated = updateFestival(body.id, body.data || body);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, festival: updated, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const festivalId = searchParams.get('id') || searchParams.get('festivalId');
    const productId = searchParams.get('productId');

    // If deleting a product from a festival
    if (festivalId && productId) {
      const updatedFestival = deleteFestivalProduct(festivalId, productId);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, festival: updatedFestival, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    // Deleting entire festival
    if (festivalId) {
      deleteFestival(festivalId);
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return NextResponse.json(
        { success: true, festivals, showcaseFestival },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
