import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
