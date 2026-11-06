/**
 * Returns a valid absolute origin for the public website.
 * NEXT_PUBLIC_SITE_URL is sometimes entered as a bare domain in Vercel;
 * normalize it so Sanity Presentation never treats it as a relative URL.
 */
export function getPublicSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === 'production'
    ? 'https://persona-institute.vercel.app'
    : 'http://localhost:3000';

  const raw = configured || fallback;
  const withProtocol = /^https?:\/\//i.test(raw)
    ? raw
    : /^(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(raw)
      ? `http://${raw}`
      : `https://${raw}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return fallback;
    if (process.env.NODE_ENV === 'production' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}
