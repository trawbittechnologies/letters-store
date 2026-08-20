import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getCategories, createCategory } from '@/lib/db';
import { sql } from '@/lib/neon';

export async function GET() {
  try {
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM categories ORDER BY created_at DESC;`;
        const mappedCategories = rows.map(row => ({
          ...row,
          group: row.group_name,
          itemCount: row.item_count,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        return NextResponse.json({ success: true, categories: mappedCategories });
      } catch (err) {
        console.warn('Neon DB categories GET error:', err.message);
      }
    }

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

    if (sql) {
      try {
        const newCat = {
          id: body.id || `cat-${Date.now()}`,
          name: body.name,
          slug: body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
          group: body.group || 'Hampers',
          description: body.description || '',
          image: body.image || '',
          enabled: body.enabled ?? true,
          itemCount: body.itemCount || 0
        };
        
        await sql`
          INSERT INTO categories (id, name, slug, group_name, description, image, enabled, item_count)
          VALUES (${newCat.id}, ${newCat.name}, ${newCat.slug}, ${newCat.group}, ${newCat.description}, ${newCat.image}, ${newCat.enabled}, ${newCat.itemCount})
        `;
        
        revalidateTag('categories');
        return NextResponse.json({ success: true, category: newCat }, { status: 201 });
      } catch (err) {
        console.warn('Neon DB categories POST error:', err.message);
      }
    }

    const newCategory = createCategory(body);
    revalidateTag('categories');
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
