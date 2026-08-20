/**
 * Neon PostgreSQL Migration Script
 * Run with: node scripts/migrate-neon.js
 *
 * This script:
 * 1. Creates the products table if it doesn't exist
 * 2. Adds performance indexes on products and categories
 * 3. Seeds products from the local JSON db into Neon if the table is empty
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL or POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log('🔌  Connecting to Neon PostgreSQL...');

  // ── 1. Create products table ──────────────────────────────────────────────
  console.log('\n📋  Creating products table if not exists...');
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      slug          TEXT UNIQUE NOT NULL,
      category      TEXT NOT NULL DEFAULT '',
      category_slug TEXT NOT NULL DEFAULT '',
      price         NUMERIC(10, 2) NOT NULL DEFAULT 0,
      original_price NUMERIC(10, 2),
      images        JSONB NOT NULL DEFAULT '[]',
      stock         INTEGER NOT NULL DEFAULT 10,
      featured      BOOLEAN NOT NULL DEFAULT false,
      active        BOOLEAN NOT NULL DEFAULT true,
      tag           TEXT DEFAULT 'New',
      customizable  BOOLEAN NOT NULL DEFAULT true,
      show_price    BOOLEAN NOT NULL DEFAULT true,
      description   TEXT DEFAULT '',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  console.log('  ✅  products table ready');

  // ── 2. Add indexes for performance ───────────────────────────────────────
  console.log('\n🔍  Adding performance indexes...');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active
    ON products(active);`;
  console.log('  ✅  idx_products_active');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug
    ON products(slug);`;
  console.log('  ✅  idx_products_slug');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_active
    ON products(category_slug, active);`;
  console.log('  ✅  idx_products_category_active');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured_active
    ON products(featured, active) WHERE featured = true AND active = true;`;
  console.log('  ✅  idx_products_featured_active');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_created_at
    ON products(created_at DESC);`;
  console.log('  ✅  idx_products_created_at');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price
    ON products(price) WHERE active = true;`;
  console.log('  ✅  idx_products_price');

  // Categories indexes
  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug
    ON categories(slug);`;
  console.log('  ✅  idx_categories_slug');

  await sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_enabled
    ON categories(enabled) WHERE enabled = true;`;
  console.log('  ✅  idx_categories_enabled');

  // ── 3. Seed products from JSON db if Neon products table is empty ─────────
  const countRows = await sql`SELECT COUNT(*) as count FROM products;`;
  const existingCount = parseInt(countRows[0].count, 10);

  if (existingCount === 0) {
    console.log('\n🌱  Products table is empty — seeding from local db.json...');

    try {
      const dbPath = join(process.cwd(), '.data', 'db.json');
      const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
      const localProducts = db.products || [];

      if (localProducts.length === 0) {
        console.log('  ℹ️   No local products found in .data/db.json — skipping seed.');
      } else {
        let seeded = 0;
        for (const p of localProducts) {
          try {
            await sql`
              INSERT INTO products (
                id, name, slug, category, category_slug, price, original_price,
                images, stock, featured, active, tag,
                customizable, show_price, description
              ) VALUES (
                ${p.id},
                ${p.name},
                ${p.slug || p.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')},
                ${p.category || ''},
                ${p.categorySlug || (p.category || '').toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')},
                ${Number(p.price) || 0},
                ${p.originalPrice ? Number(p.originalPrice) : null},
                ${JSON.stringify(p.images || [])},
                ${Number(p.stock) || 10},
                ${!!p.featured},
                ${p.active !== undefined ? !!p.active : true},
                ${p.tag || 'New'},
                ${p.customizable !== undefined ? !!p.customizable : true},
                ${p.showPrice !== false},
                ${p.description || ''}
              )
              ON CONFLICT (id) DO NOTHING;
            `;
            seeded++;
          } catch (err) {
            console.warn(`  ⚠️   Failed to seed product "${p.name}":`, err.message);
          }
        }
        console.log(`  ✅  Seeded ${seeded}/${localProducts.length} products into Neon`);
      }
    } catch (err) {
      console.warn('  ⚠️   Could not read .data/db.json for seeding:', err.message);
    }
  } else {
    console.log(`\n  ℹ️   Products table already has ${existingCount} rows — skipping seed.`);
  }

  console.log('\n🎉  Migration complete!');
  console.log('\nNext steps:');
  console.log('  1. Deploy to Vercel: vercel --prod');
  console.log('  2. Run on Vercel to set env vars: vercel env add DATABASE_URL');
  console.log('  3. Verify at https://letters-store.vercel.app');
}

migrate().catch((err) => {
  console.error('❌  Migration failed:', err);
  process.exit(1);
});
