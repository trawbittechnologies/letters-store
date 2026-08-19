import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const newCategory = createCategory(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
