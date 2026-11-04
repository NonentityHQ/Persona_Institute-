/**
 * Dual-brand config: Persona English + English with Khushi
 *
 * Persona (from live site personaenglish.in):
 *   orgCode = bspkr
 *   orgId   = 279110
 *   login   = https://login.personaenglish.in/login?orgCode=bspkr
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
const khushiOrg = process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE?.trim() || '';
const personaOrgId = Number(process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_ID || '') || 279110;
const khushiOrgId = Number(process.env.NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_ID || '') || undefined;

export const brands: Record<BrandId, BrandConfig> = {
  persona: {
    id: 'persona',
    name: 'Persona English',
    shortName: 'Persona',
    tagline: 'Persona Institute',
    orgCode: personaOrg,
    orgId: personaOrgId,
    loginBaseUrl: process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_LOGIN_URL?.trim() || 'https://login.personaenglish.in/login',
    storeBaseUrl: process.env.NEXT_PUBLIC_CLASSPLUS_PERSONA_STORE_URL?.trim() || 'https://www.personaenglish.in',
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
    logo: '/images/course-khushi.jpg',
    description: 'Friendly English practice, confidence building and daily speaking with Khushi.',
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
  return `${store}/courses/${courseId}`;
}

export function isBrandConfigured(brand: BrandConfig): boolean {
  return Boolean(brand.orgCode);
}
