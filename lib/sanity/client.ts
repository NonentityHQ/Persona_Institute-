import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const sanityConfigured = Boolean(projectId && projectId !== 'your-project-id');

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
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
  contactAddress?: string;
  contactWhatsapp?: string;
};

// ---------- Queries ----------
const offerFields = `
  _id, active, badge, title, subtitle, priceText, ctaLabel, ctaLink,
  handwrittenNote, image, showCountdown, countdownEnd, backgroundStyle, order
`;

const reelFields = `
  _id, title, thumbnail, videoUrl, instagramUrl, category, duration, active, order
`;

export async function getActiveOffer(): Promise<SanityOffer | null> {
  if (!sanityConfigured) return null;
  try {
    const offers = await client.fetch<SanityOffer[]>(
      `*[_type == "offer" && active == true] | order(order asc)[0...1]{ ${offerFields} }`
    );
    return offers?.[0] ?? null;
  } catch (e) {
    console.warn('[sanity] getActiveOffer failed', e);
    return null;
  }
}

export async function getReels(): Promise<SanityReel[]> {
  if (!sanityConfigured) return [];
  try {
    return await client.fetch<SanityReel[]>(
      `*[_type == "reel" && active == true] | order(order asc){ ${reelFields} }`
    );
  } catch (e) {
    console.warn('[sanity] getReels failed', e);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityConfigured) return null;
  try {
    return await client.fetch<SiteSettings>(
      `*[_type == "siteSettings"][0]{
        heroEyebrow, heroTitleLine1, heroTitlePrefix, heroTypedWords,
        heroSubtitle, heroImage, heroSecondaryImage, learnersCount, learnersText,
        instagramUrl, youtubeChannelUrl,
        reelsSectionTitle, reelsSectionKicker, reelsSectionSubtitle,
        youtubeSectionTitle, youtubeSectionKicker, youtubeSectionSubtitle,
        statLearners, statYears, statBatches, statSatisfaction,
        aboutTitle, aboutBody, aboutImage,
        contactEmail, contactPhone, contactAddress, contactWhatsapp
      }`
    );
  } catch (e) {
    console.warn('[sanity] getSiteSettings failed', e);
    return null;
  }
}


const youtubeFields = `
  _id, title, youtubeUrl, thumbnail, duration, category, active, order
`;

export async function getYoutubeVideos(): Promise<SanityYoutubeVideo[]> {
  if (!sanityConfigured) return [];
  try {
    return await client.fetch(
      `*[_type == "youtubeVideo" && active != false] | order(order asc) { ${youtubeFields} }`
    );
  } catch {
    return [];
  }
}
