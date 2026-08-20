import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getProductBySlug, updateProduct, deleteProduct } from '@/lib/db';
import { sql } from '@/lib/neon';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (sql) {
      try {
        const rows = await sql`
          SELECT id, name, slug, category, category_slug, price, original_price,
                 images, stock, featured, active, tag,
                 customizable, show_price, description, created_at, updated_at
          FROM products
          WHERE slug = ${id} OR id = ${id}
          LIMIT 1;
        `;
        if (rows.length > 0) {
          const row = rows[0];
          const product = {
            id: row.id,
            name: row.name,
            slug: row.slug,
            category: row.category,
            categorySlug: row.category_slug,
            price: Number(row.price),
            originalPrice: row.original_price ? Number(row.original_price) : undefined,
            images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
            stock: Number(row.stock),
            featured: !!row.featured,
            active: !!row.active,
            tag: row.tag,
            rating: 5.0,
            reviewsCount: 0,
            customizable: !!row.customizable,
            showPrice: row.show_price !== false,
            description: row.description || '',
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
          return NextResponse.json({ success: true, product });
        }
      } catch (err) {
        console.warn('[/api/products/[id] GET] Neon error:', err.message);
      }
    }

    const product = getProductBySlug(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (sql) {
      try {
        // Build dynamic update — only set fields that were provided
        const setClauses = [];
        const values = [];

        if (body.name !== undefined) { setClauses.push('name'); values.push(body.name); }
        if (body.price !== undefined) { setClauses.push('price'); values.push(Number(body.price)); }
        if (body.originalPrice !== undefined) { setClauses.push('original_price'); values.push(body.originalPrice ? Number(body.originalPrice) : null); }
        if (body.category !== undefined) { setClauses.push('category'); values.push(body.category); }
        if (body.category !== undefined) {
          setClauses.push('category_slug');
          values.push(body.category.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
        }
        if (body.images !== undefined) { setClauses.push('images'); values.push(JSON.stringify(body.images)); }
        if (body.stock !== undefined) { setClauses.push('stock'); values.push(Number(body.stock)); }
        if (body.featured !== undefined) { setClauses.push('featured'); values.push(!!body.featured); }
        if (body.active !== undefined) { setClauses.push('active'); values.push(!!body.active); }
        if (body.tag !== undefined) { setClauses.push('tag'); values.push(body.tag); }
        if (body.description !== undefined) { setClauses.push('description'); values.push(body.description); }
        if (body.customizable !== undefined) { setClauses.push('customizable'); values.push(!!body.customizable); }
        if (body.showPrice !== undefined) { setClauses.push('show_price'); values.push(!!body.showPrice); }

        if (setClauses.length > 0) {
          // Build parameterised UPDATE via raw template
          const setStr = setClauses.map((col, i) => `${col} = $${i + 1}`).join(', ');
          const whereIdx = values.length + 1;
          await sql.query(
            `UPDATE products SET ${setStr}, updated_at = NOW() WHERE id = $${whereIdx} OR slug = $${whereIdx}`,
            [...values, id]
          );
        }

        revalidateTag('products');
        return NextResponse.json({ success: true, product: { id, ...body } });
      } catch (err) {
        console.warn('[/api/products/[id] PUT] Neon error, falling back:', err.message);
      }
    }

    const updated = updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found or not updated' }, { status: 404 });
    }
    revalidateTag('products');
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (sql) {
      try {
        await sql`DELETE FROM products WHERE id = ${id} OR slug = ${id};`;
        revalidateTag('products');
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
      } catch (err) {
        console.warn('[/api/products/[id] DELETE] Neon error, falling back:', err.message);
      }
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    revalidateTag('products');
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
