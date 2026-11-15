import type { MetadataRoute } from 'next';

const BASE_URL = 'https://personaenglish.in';
const routes = ['/', '/about', '/courses', '/book-store', '/free-tests', '/reviews', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route === '/' ? '' : route}`,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route === '/courses' || route === '/book-store' ? 0.9 : 0.7,
  }));
}
