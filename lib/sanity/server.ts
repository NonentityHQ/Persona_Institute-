import 'server-only';
import { unstable_cache } from 'next/cache';
import { defineQuery } from 'next-sanity';
import { client, sanityConfigured } from './client';
import { sanityFetch } from './live';
import type {
  SanityOffer,
  SanityReel,
  SanityYoutubeVideo,
  SiteSettings,
  SanityBook,
  SanityBookCategory,
  SanityBookOffer,
  SanityBookStoreSettings,
  SanitySiteCard,
} from './client';

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (process.env.SANITY_API_READ_TOKEN) {
    const result = await sanityFetch({ query: defineQuery(query), params });
    return result.data as T;
  }
  return client.fetch<T>(query, params);
}

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
    const offers = await fetchSanity<SanityOffer[]>(
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
    // Newest published Instagram reel documents appear first; order remains a fallback.
    return await fetchSanity<SanityReel[]>(
      `*[_type == "reel" && active == true] | order(_updatedAt desc, order asc){ ${reelFields}, _updatedAt }`
    );
  } catch (e) {
    console.warn('[sanity] getReels failed', e);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityConfigured) return null;
  try {
    return await fetchSanity<SiteSettings>(
      `*[_type == "siteSettings"][0]{
        heroEyebrow, heroTitleLine1, heroTitlePrefix, heroTypedWords,
        heroSubtitle, heroImage, heroSecondaryImage, learnersCount, learnersText,
        instagramUrl, youtubeChannelUrl,
        reelsSectionTitle, reelsSectionKicker, reelsSectionSubtitle,
        youtubeSectionTitle, youtubeSectionKicker, youtubeSectionSubtitle,
        statLearners, statYears, statBatches, statSatisfaction,
        aboutTitle, aboutBody, aboutImage,
        contactEmail, contactPhone, contactPhoneSecondary, contactAddress, contactWhatsapp
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

const PERSONA_YOUTUBE_CHANNEL_ID = 'UCvuIFLYgXozUGG1MI4G96eQ';
const YOUTUBE_CHANNELS = [
  { id: PERSONA_YOUTUBE_CHANNEL_ID, label: 'Persona Institute' },
  { handle: 'englishwithkhushi', label: 'English with Khushi' },
] as const;

function xmlText(entry: string, tag: string): string {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return (match?.[1] || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

const resolveYoutubeChannelIdCached = unstable_cache(
  async (handle: string): Promise<string | null> => {
    try {
      // YouTube's channel HTML can exceed Vercel's 2 MB Data Cache item limit.
      // Fetch it without the Next fetch cache, then cache only the tiny parsed channel ID.
      const response = await fetch(`https://www.youtube.com/@${handle}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PersonaWebsite/1.0)' },
        cache: 'no-store',
      });
      if (!response.ok) return null;
      const html = await response.text();
      const match = html.match(/(?:\"channelId\"|\"externalId\"|itemprop=\"channelId\" content=\")(?::\s*\"|\")?(UC[\w-]{20,})/i);
      return match?.[1] || html.match(/UC[\w-]{20,}/)?.[0] || null;
    } catch {
      return null;
    }
  },
  ['youtube-channel-id-by-handle'],
  { revalidate: 86400, tags: ['youtube-channel-id'] },
);

async function resolveYoutubeChannelId(handle: string): Promise<string | null> {
  return resolveYoutubeChannelIdCached(handle);
}

async function getLatestYoutubeFeed(): Promise<SanityYoutubeVideo[]> {
  const resolved = await Promise.all(YOUTUBE_CHANNELS.map(async (channel) => ({
    label: channel.label,
    id: 'id' in channel ? channel.id : await resolveYoutubeChannelId(channel.handle),
  })));
  const feeds = await Promise.all(resolved.filter((channel) => channel.id).map(async (channel) => {
    try {
      const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PersonaWebsite/1.0)' },
        next: { revalidate: 1800 },
      });
      if (!response.ok) return [] as Array<SanityYoutubeVideo & { publishedAt?: string }>;
      const xml = await response.text();
      return Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match, index) => {
        const entry = match[1];
        const id = xmlText(entry, 'yt:videoId');
        if (!id) return null;
        return {
          _id: `youtube-${id}`,
          title: xmlText(entry, 'title') || 'Latest lesson',
          youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
          category: channel.label,
          active: true,
          order: index,
          publishedAt: xmlText(entry, 'published'),
        };
      }).filter(Boolean) as Array<SanityYoutubeVideo & { publishedAt?: string }>;
    } catch {
      return [] as Array<SanityYoutubeVideo & { publishedAt?: string }>;
    }
  }));
  return feeds.flat().sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '')).slice(0, 12);
}

export async function getYoutubeVideos(): Promise<SanityYoutubeVideo[]> {
  // Pull the current public uploads/Shorts from both official channels. Sanity is a fallback
  // for curated videos if YouTube's public RSS feed is temporarily unavailable.
  const latest = await getLatestYoutubeFeed();
  if (latest.length) return latest;
  if (!sanityConfigured) return [];
  try {
    return await fetchSanity<SanityYoutubeVideo[]>(
      `*[_type == "youtubeVideo" && active != false] | order(order asc) { ${youtubeFields} }`
    );
  } catch {
    return [];
  }
}

// ---------- Book Store ----------
const bookFields = `
  _id, title, slug, cover, badge, price, oldPrice, rating, reviewCount,
  shortDescription, description, isCombo, comboLabel, featured, heroFeatured,
  buyUrl, active, order,
  category->{ _id, title, slug },
  comboBooks[]->{ _id, title, cover }
`;

const bookCategoryFields = `_id, title, slug, subtitle, icon, order, active`;

const bookOfferFields = `
  _id, active, badge, title, subtitle, highlights, ctaLabel, ctaLink,
  secondaryCtaLabel, secondaryCtaLink, image, price, oldPrice, savingsText,
  priceNote, comboLabel, showCountdown, countdownEnd, order,
  includedBooks[]->{ _id, title, cover }
`;

const bookStoreSettingsFields = `
  heroEyebrow, heroTitleLine1, heroTitleAccent, heroSubtitle,
  exploreCtaLabel, comboCtaLabel, features, stats,
  whyEyebrow, whyTitle, whyItems, testimonials,
  categoriesEyebrow, categoriesTitle, featuredEyebrow, featuredTitle
`;

export async function getBooks(): Promise<SanityBook[]> {
  if (!sanityConfigured) return [];
  try {
    return await fetchSanity<SanityBook[]>(
      `*[_type == "book" && active != false] | order(order asc) { ${bookFields} }`
    );
  } catch (e) {
    console.warn('[sanity] getBooks failed', e);
    return [];
  }
}

export async function getBookCategories(): Promise<SanityBookCategory[]> {
  if (!sanityConfigured) return [];
  try {
    return await fetchSanity<SanityBookCategory[]>(
      `*[_type == "bookCategory" && active != false] | order(order asc) { ${bookCategoryFields} }`
    );
  } catch (e) {
    console.warn('[sanity] getBookCategories failed', e);
    return [];
  }
}

export async function getBookOffer(): Promise<SanityBookOffer | null> {
  if (!sanityConfigured) return null;
  try {
    const rows = await fetchSanity<SanityBookOffer[]>(
      `*[_type == "bookOffer" && active == true] | order(order asc)[0...1]{ ${bookOfferFields} }`
    );
    return rows?.[0] ?? null;
  } catch (e) {
    console.warn('[sanity] getBookOffer failed', e);
    return null;
  }
}

export async function getBookStoreSettings(): Promise<SanityBookStoreSettings | null> {
  if (!sanityConfigured) return null;
  try {
    const rows = await fetchSanity<SanityBookStoreSettings[]>(
      `*[_type == "bookStoreSettings"][0...1]{ ${bookStoreSettingsFields} }`
    );
    return rows?.[0] ?? null;
  } catch (e) {
    console.warn('[sanity] getBookStoreSettings failed', e);
    return null;
  }
}


export async function getSiteCards(page: string): Promise<SanitySiteCard[]> {
  if (!sanityConfigured) return [];
  try {
    return await fetchSanity<SanitySiteCard[]>(
      `*[_type == "siteCard" && page == $page && active != false] | order(order asc) {
        _id, key, page, section, externalId, order, active,
        eyebrow, title, subtitle, location, description, features,
        image, "imageUrl": image.asset->url, imageAlt,
        secondaryImage, "secondaryImageUrl": secondaryImage.asset->url, imageFit, imagePosition,
        badge, priceText, oldPriceText, discountText, rating, reviewCount,
        buttonLabel, buttonUrl, secondaryButtonLabel, secondaryButtonUrl, accent
      }`,
      { page }
    );
  } catch (e) {
    console.warn('[sanity] getSiteCards failed', e);
    return [];
  }
}
