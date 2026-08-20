import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getProducts, createProduct } from '@/lib/db';
import { sql } from '@/lib/neon';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Try Neon first
    if (sql) {
      try {
        let rows;
        if (category && category !== 'All') {
          rows = await sql`
            SELECT id, name, slug, category, category_slug, price, original_price,
                   images, stock, featured, active, tag, rating, reviews_count,
                   customizable, show_price, description, created_at, updated_at
            FROM products
            WHERE active = true
              AND (LOWER(category) = LOWER(${category}) OR category_slug = LOWER(${category}))
            ORDER BY created_at DESC;
          `;
        } else if (featured === 'true') {
          rows = await sql`
            SELECT id, name, slug, category, category_slug, price, original_price,
                   images, stock, featured, active, tag,
                   customizable, show_price, description, created_at, updated_at
            FROM products
            WHERE active = true AND featured = true
            ORDER BY created_at DESC;
          `;
        } else if (search) {
          const q = `%${search.toLowerCase()}%`;
          rows = await sql`
            SELECT id, name, slug, category, category_slug, price, original_price,
                   images, stock, featured, active, tag,
                   customizable, show_price, description, created_at, updated_at
            FROM products
            WHERE active = true
              AND (LOWER(name) LIKE ${q} OR LOWER(description) LIKE ${q} OR LOWER(category) LIKE ${q})
            ORDER BY created_at DESC;
          `;
        } else {
          rows = await sql`
            SELECT id, name, slug, category, category_slug, price, original_price,
                   images, stock, featured, active, tag,
                   customizable, show_price, description, created_at, updated_at
            FROM products
            ORDER BY created_at DESC;
          `;
        }

        const products = rows.map((row) => ({
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
        }));

        return NextResponse.json({ success: true, products });
      } catch (err) {
        console.warn('[/api/products GET] Neon error, falling back to JSON db:', err.message);
      }
    }

    // Fallback to JSON db
    let products = getProducts();

    if (category && category !== 'All') {
      products = products.filter(
        (p) =>
          p.category.toLowerCase() === category.toLowerCase() ||
          p.categorySlug === category.toLowerCase()
      );
    }

    if (featured === 'true') {
      products = products.filter((p) => p.featured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    if (sql) {
      try {
        const newProduct = {
          id: body.id || `prod-${Date.now()}`,
          name: body.name,
          slug: body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
          category: body.category,
          category_slug: (body.category || '').toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
          price: Number(body.price),
          original_price: body.originalPrice ? Number(body.originalPrice) : null,
          images: JSON.stringify(body.images || []),
          stock: Number(body.stock) || 10,
          featured: !!body.featured,
          active: body.active !== undefined ? !!body.active : true,
          tag: body.tag || 'New',
          rating: 5.0,
          reviews_count: 0,
          customizable: body.customizable !== undefined ? !!body.customizable : true,
          show_price: body.showPrice !== undefined ? !!body.showPrice : true,
          description: body.description || '',
        };

        await sql`
          INSERT INTO products (
            id, name, slug, category, category_slug, price, original_price,
            images, stock, featured, active, tag, rating, reviews_count,
            customizable, show_price, description
          ) VALUES (
            ${newProduct.id}, ${newProduct.name}, ${newProduct.slug},
            ${newProduct.category}, ${newProduct.category_slug}, ${newProduct.price},
            ${newProduct.original_price}, ${newProduct.images}, ${newProduct.stock},
            ${newProduct.featured}, ${newProduct.active}, ${newProduct.tag},
            ${newProduct.rating}, ${newProduct.reviews_count}, ${newProduct.customizable},
            ${newProduct.show_price}, ${newProduct.description}
          )
          ON CONFLICT (id) DO NOTHING;
        `;

        revalidateTag('products');
        return NextResponse.json(
          { success: true, product: { ...newProduct, images: body.images || [] } },
          { status: 201 }
        );
      } catch (err) {
        console.warn('[/api/products POST] Neon error, falling back to JSON db:', err.message);
      }
    }

    const newProduct = createProduct(body);
    revalidateTag('products');
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
