import { createDataAttribute } from '@sanity/visual-editing';
import { getPublicSiteOrigin } from '@/lib/site-url';

const siteOrigin = getPublicSiteOrigin();
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
