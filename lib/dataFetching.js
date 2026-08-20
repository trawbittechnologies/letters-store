import { unstable_cache } from 'next/cache';
import { sql } from '@/lib/neon';
import {
  getCategories,
  getProducts,
  getSettings,
  getSaleBanner,
  getFestivals,
  resolveShowcaseFestival,
} from '@/lib/db';

// ─── Categories ────────────────────────────────────────────────────────────────

export const getCachedCategories = unstable_cache(
  async () => {
    try {
      if (sql) {
        try {
          const rows = await sql`
            SELECT id, name, slug, group_name, description, image, enabled, item_count,
                   created_at, updated_at
            FROM categories
            ORDER BY created_at DESC;
          `;
          return rows.map((row) => ({
            ...row,
            group: row.group_name,
            itemCount: row.item_count,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
        } catch (err) {
          console.warn('[dataFetching] Neon categories error:', err.message);
        }
      }
      return getCategories();
    } catch (error) {
      console.error('[dataFetching] getCachedCategories failed:', error);
      return [];
    }
  },
  ['categories-cache'],
  { tags: ['categories'], revalidate: 300 }
);

// ─── Products ──────────────────────────────────────────────────────────────────

export const getCachedProducts = unstable_cache(
  async () => {
    try {
      if (sql) {
        try {
          const rows = await sql`
            SELECT id, name, slug, category, category_slug, price, original_price,
                   images, stock, featured, active, tag,
                   customizable, show_price, description, created_at, updated_at
            FROM products
            ORDER BY created_at DESC;
          `;
          return rows.map((row) => ({
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
        } catch (err) {
          console.warn('[dataFetching] Neon products error:', err.message);
        }
      }
      return getProducts();
    } catch (error) {
      console.error('[dataFetching] getCachedProducts failed:', error);
      return [];
    }
  },
  ['products-cache'],
  { tags: ['products'], revalidate: 60 }
);

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getCachedSettings = unstable_cache(
  async () => {
    try {
      if (sql) {
        try {
          const rows = await sql`SELECT key, value FROM settings;`;
          if (rows.length > 0) {
            const settings = {};
            for (const row of rows) {
              settings[row.key] = row.value;
            }
            return settings;
          }
        } catch (err) {
          // Settings table may not exist — fall through to JSON db
          console.warn('[dataFetching] Neon settings error (falling back to JSON):', err.message);
        }
      }
      return getSettings();
    } catch (error) {
      console.error('[dataFetching] getCachedSettings failed:', error);
      return getSettings();
    }
  },
  ['settings-cache'],
  { tags: ['settings'], revalidate: 300 }
);

// ─── Sale Banner ──────────────────────────────────────────────────────────────

export const getCachedSaleBanner = unstable_cache(
  async () => {
    try {
      return getSaleBanner();
    } catch (error) {
      console.error('[dataFetching] getCachedSaleBanner failed:', error);
      return { enabled: false, showTopBar: false };
    }
  },
  ['sale-banner-cache'],
  { tags: ['sale-banner'], revalidate: 60 }
);

// ─── Festivals ────────────────────────────────────────────────────────────────

export const getCachedFestivals = unstable_cache(
  async () => {
    try {
      const festivals = getFestivals();
      const showcaseFestival = resolveShowcaseFestival(festivals);
      return { festivals, showcaseFestival };
    } catch (error) {
      console.error('[dataFetching] getCachedFestivals failed:', error);
      return { festivals: [], showcaseFestival: null };
    }
  },
  ['festivals-cache'],
  { tags: ['festivals'], revalidate: 60 }
);
