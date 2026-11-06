import { createClient } from 'next-sanity';
import { stegaClean } from '@sanity/client/stega';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01';
export const sanityConfigured = Boolean(projectId && projectId !== 'your-project-id');

export function cleanSanityString(value?: string | null): string {
  return typeof value === 'string' ? stegaClean(value) : '';
}

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio' },
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ---------- Types ----------
export type SanityOffer = {
  _id: string;
  active?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
  priceText?: string;
  ctaLabel?: string;
  ctaLink?: string;
  handwrittenNote?: string;
  image?: { asset?: { _ref: string }; hotspot?: unknown };
  showCountdown?: boolean;
  countdownEnd?: string;
  backgroundStyle?: 'peach' | 'rose' | 'cream';
  order?: number;
};

export type SanityReel = {
  _id: string;
  title?: string;
  thumbnail?: { asset?: { _ref: string }; hotspot?: unknown };
  videoUrl?: string;
  instagramUrl?: string;
  category?: string;
  duration?: string;
  active?: boolean;
  order?: number;
};

export type SanityYoutubeVideo = {
  _id: string;
  title?: string;
  youtubeUrl?: string;
  thumbnail?: { asset?: { _ref: string }; hotspot?: unknown };
  duration?: string;
  category?: string;
  active?: boolean;
  order?: number;
};

export type SiteSettings = {
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitlePrefix?: string;
  heroTypedWords?: string[];
  heroSubtitle?: string;
  heroImage?: { asset?: { _ref: string }; hotspot?: unknown };
  heroSecondaryImage?: { asset?: { _ref: string }; hotspot?: unknown };
  learnersCount?: string;
  learnersText?: string;
  instagramUrl?: string;
  youtubeChannelUrl?: string;
  reelsSectionTitle?: string;
  reelsSectionKicker?: string;
  reelsSectionSubtitle?: string;
  youtubeSectionTitle?: string;
  youtubeSectionKicker?: string;
  youtubeSectionSubtitle?: string;
  statLearners?: string;
  statYears?: string;
  statBatches?: string;
  statSatisfaction?: string;
  aboutTitle?: string;
  aboutBody?: string;
  aboutImage?: { asset?: { _ref: string }; hotspot?: unknown };
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneSecondary?: string;
  contactAddress?: string;
  contactWhatsapp?: string;
};


export type SanityBookCategory = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  subtitle?: string;
  icon?: string;
  order?: number;
  active?: boolean;
};

export type SanityBook = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  cover?: { asset?: { _ref: string }; hotspot?: unknown; altText?: string };
  category?: { _id?: string; title?: string; slug?: { current?: string } };
  badge?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
  reviewCount?: number;
  shortDescription?: string;
  description?: string;
  isCombo?: boolean;
  comboLabel?: string;
  comboBooks?: Array<{
    _id: string;
    title?: string;
    cover?: { asset?: { _ref: string }; hotspot?: unknown };
  }>;
  featured?: boolean;
  heroFeatured?: boolean;
  buyUrl?: string;
  active?: boolean;
  order?: number;
};

export type SanityBookOffer = {
  _id: string;
  active?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
  highlights?: string[];
  ctaLabel?: string;
  ctaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  image?: { asset?: { _ref: string }; hotspot?: unknown };
  price?: number;
  oldPrice?: number;
  savingsText?: string;
  priceNote?: string;
  comboLabel?: string;
  includedBooks?: Array<{
    _id: string;
    title?: string;
    cover?: { asset?: { _ref: string }; hotspot?: unknown };
  }>;
  showCountdown?: boolean;
  countdownEnd?: string;
  order?: number;
};

export type SanityBookStoreSettings = {
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleAccent?: string;
  heroSubtitle?: string;
  exploreCtaLabel?: string;
  comboCtaLabel?: string;
  features?: Array<{ label?: string; icon?: string }>;
  stats?: Array<{
    value?: number;
    suffix?: string;
    decimals?: number;
    label?: string;
    icon?: string;
  }>;
  whyEyebrow?: string;
  whyTitle?: string;
  whyItems?: Array<{ title?: string; description?: string; icon?: string }>;
  testimonials?: Array<{ text?: string; by?: string }>;
  categoriesEyebrow?: string;
  categoriesTitle?: string;
  featuredEyebrow?: string;
  featuredTitle?: string;
};


export type SanitySiteCard = {
  _id: string;
  key?: { current?: string } | string;
  page?: string;
  section?: string;
  externalId?: string;
  order?: number;
  active?: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  description?: string;
  features?: string[];
  image?: { asset?: { _ref: string }; hotspot?: unknown };
  imageUrl?: string;
  imageAlt?: string;
  secondaryImage?: { asset?: { _ref: string }; hotspot?: unknown };
  secondaryImageUrl?: string;
  imageFit?: 'contain' | 'cover';
  imagePosition?: string;
  badge?: string;
  priceText?: string;
  oldPriceText?: string;
  discountText?: string;
  rating?: number;
  reviewCount?: number;
  buttonLabel?: string;
  buttonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  accent?: string;
};

