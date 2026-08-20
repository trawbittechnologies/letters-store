import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/db';
import { sql } from '@/lib/neon';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (sql) {
      try {
        const rows = await sql`
          UPDATE categories
          SET name = COALESCE(${body.name}, name),
              slug = COALESCE(${body.slug}, slug),
              enabled = COALESCE(${body.enabled}, enabled),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id} OR slug = ${id}
          RETURNING *;
        `;
        if (rows.length > 0) {
          const row = rows[0];
          return NextResponse.json({ 
            success: true, 
            category: { 
              ...row, 
              group: row.group_name, 
              itemCount: row.item_count, 
              createdAt: row.created_at, 
              updatedAt: row.updated_at 
            } 
          });
        }
      } catch (err) {
        console.warn('Neon DB categories PUT error:', err.message);
      }
    }

    const updated = updateCategory(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (sql) {
      try {
        const rows = await sql`
          DELETE FROM categories
          WHERE id = ${id} OR slug = ${id}
          RETURNING id;
        `;
        if (rows.length > 0) {
          return NextResponse.json({ success: true, message: 'Category deleted successfully' });
        }
      } catch (err) {
        console.warn('Neon DB categories DELETE error:', err.message);
      }
    }

    const deleted = deleteCategory(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
