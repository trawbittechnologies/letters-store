/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats: AVIF first (best compression), then WebP
    formats: ['image/avif', 'image/webp'],

    // Cache optimized images for 1 hour on CDN/browser
    minimumCacheTTL: 3600,

    // Allow images from all https origins (existing wildcard) plus Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Cloudinary images (current and future CDN delivery)
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Allow any other https origin (existing catch-all)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
