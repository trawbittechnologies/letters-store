import { unstable_cache } from 'next/cache';
import { sql } from '@/lib/neon';
import { getCategories } from '@/lib/db';

export const getCachedCategories = unstable_cache(
  async () => {
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
          return mappedCategories;
        } catch (err) {
          console.warn('Neon DB categories GET error in cache:', err.message);
        }
      }

      const categories = getCategories();
      return categories;
    } catch (error) {
      console.error('Failed to fetch cached categories:', error);
      return [];
    }
  },
  ['categories-cache'],
  { tags: ['categories'] }
);
