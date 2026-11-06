/**
 * Dual-brand config: Persona English + English with Khushi
 *
 * Persona (from live site personaenglish.in):
 *   orgCode = bspkr
 *   orgId   = 279110
 *   login   = https://web.classplusapp.com/login?orgCode=bspkr
 *
 * Khushi: fill from client when available.
 */
export type BrandId = 'persona' | 'khushi';

export type BrandConfig = {
  id: BrandId;
  name: string;
  shortName: string;
  tagline: string;
  orgCode: string;
  orgId?: number;
  /** Override default web.classplusapp.com login host */
  loginBaseUrl?: string;
  /** Override default {org}.courses.store for course links */
  storeBaseUrl?: string;
  accent: string;
  accentSoft: string;
  logo?: string;
  description: string;
};

const personaOrg = process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_CODE?.trim() || 'bspkr';
const khushiOrg = process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE?.trim() || 'ZUFVSJ';
const personaOrgId = Number(process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_ID || '') || 279110;
const khushiOrgId = Number(process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_ID || '') || 617819;

export const brands: Record<BrandId, BrandConfig> = {
  persona: {
    id: 'persona',
    name: 'Persona English',
    shortName: 'Persona',
    tagline: 'Persona Institute',
    orgCode: personaOrg,
    orgId: personaOrgId,
    // Use the same standard Classplus login host as English with Khushi.
    // Do not route Persona through the retired personaenglish.in login subdomain.
    storeBaseUrl: process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_STORE_URL?.trim() || 'https://bspkr.courses.store',
    accent: '#f51632',
    accentSoft: '#fff1f2',
    logo: '/images/persona-logo.png',
    description: 'Live & recorded spoken English, grammar and vocabulary with Ajay Sir.',
  },
  khushi: {
    id: 'khushi',
    name: 'English with Khushi',
    shortName: 'Khushi',
    tagline: 'English with Khushi',
    orgCode: khushiOrg,
    orgId: khushiOrgId,
    loginBaseUrl: process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_LOGIN_URL?.trim() || undefined,
    storeBaseUrl: process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_STORE_URL?.trim() || undefined,
    accent: '#7c3aed',
    accentSoft: '#f5f3ff',
    logo: '/images/english-with-khushi-logo.png',
    description: 'English learning, daily speaking practice and confidence-building lessons in the English with Khushi app.',
  },
};

export const brandList: BrandConfig[] = [brands.persona, brands.khushi];

export function getBrand(id: BrandId): BrandConfig {
  return brands[id];
}

export function classplusLoginUrl(brand: BrandConfig): string | null {
  if (!brand.orgCode) return null;
  if (brand.loginBaseUrl) {
    const base = brand.loginBaseUrl.replace(/\/$/, '');
    const join = base.includes('?') ? '&' : '?';
    return `${base}${join}orgCode=${encodeURIComponent(brand.orgCode)}`;
  }
  return `https://web.classplusapp.com/login?orgCode=${encodeURIComponent(brand.orgCode)}`;
}

export function classplusStoreUrl(brand: BrandConfig): string | null {
  if (brand.storeBaseUrl) return brand.storeBaseUrl.replace(/\/$/, '');
  if (!brand.orgCode) return null;
  return `https://${brand.orgCode}.courses.store`;
}

export function classplusCourseUrl(brand: BrandConfig, courseId: string | number): string | null {
  const store = classplusStoreUrl(brand);
  if (!store) return null;
  // Persona's public Classplus storefront uses /{courseId} (not /courses/{courseId}).
  if (brand.id === 'persona') return `${store}/${encodeURIComponent(String(courseId))}`;
  return `${store}/courses/${encodeURIComponent(String(courseId))}`;
}

export function isBrandConfigured(brand: BrandConfig): boolean {
  return Boolean(brand.orgCode);
}
