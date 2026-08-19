import { defaultProducts, defaultCategories } from '@/src/data/initialData';

export default async function sitemap() {
  const baseUrl = 'https://letters-store.vercel.app';

  const staticRoutes = [
    '',
    '/shop',
    '/custom-gift',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryRoutes = defaultCategories
    .filter((c) => c.enabled !== false)
    .map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  const productRoutes = defaultProducts
    .filter((p) => p.active !== false)
    .map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
