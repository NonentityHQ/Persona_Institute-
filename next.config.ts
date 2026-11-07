import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Serve responsive, cached WebP variants for Classplus/Sanity/Youtube assets.
    formats: ['image/webp'],
    // Next.js 16 requires an explicit quality allowlist for the image optimizer.
    qualities: [75, 78, 80],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'cdn-wl-assets.classplus.co' },
      { protocol: 'https', hostname: 'ali-cdn-wl-assets.classplus.co' },
      { protocol: 'https', hostname: 'cdn-cloudn.classplus.co' },
      { protocol: 'https', hostname: 'cdn-diy-public.classplus.co' },
      { protocol: 'https', hostname: 'ali-cdn-cp-assets-public.classplus.co' },
      { protocol: 'https', hostname: 'cp-assets.classplus.app' },
      { protocol: 'https', hostname: 'cdn.classplusapp.com' },
      { protocol: 'https', hostname: 'media.classplusapp.com' },
      { protocol: 'https', hostname: '**.classplus.co' },
      { protocol: 'https', hostname: '**.classplusapp.com' },
      { protocol: 'https', hostname: '**.classplus.app' },
    ],
  },
};

export default nextConfig;
