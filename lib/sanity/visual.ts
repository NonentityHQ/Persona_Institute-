import { createDataAttribute } from '@sanity/visual-editing';

const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const studioBaseUrl = `${siteOrigin}/studio`;

export function sanityFieldAttribute(
  id: string,
  type: string,
  path: string,
): string {
  return createDataAttribute({
    id,
    type,
    path,
    baseUrl: studioBaseUrl,
  }).toString();
}
