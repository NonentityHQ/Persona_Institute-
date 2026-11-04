import type { SanityOffer, SanityReel, SanityYoutubeVideo, SiteSettings } from './client';

/** Used when Sanity is not configured or fetch fails — keeps the site looking good in demo. */
export const fallbackOffer: SanityOffer = {
  _id: 'fallback-offer',
  active: true,
  badge: 'Limited Time Offer',
  title: "Teacher's Day Special Offer!",
  subtitle: 'Get all recorded courses at just ₹500/- · 15 Months Validity',
  priceText: '₹500/-',
  ctaLabel: 'Grab Offer Now',
  handwrittenNote: 'Invest in\na better you\nHappy Teacher\'s Day ♡',
  showCountdown: true,
  // ~4 days from a fixed demo moment — frontend will still tick
  countdownEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  backgroundStyle: 'peach',
  order: 0,
};

export const fallbackReels: SanityReel[] = [
  {
    _id: 'r1',
    title: 'How to introduce yourself confidently',
    category: 'Spoken English',
    duration: '0:32',
    active: true,
    order: 0,
    // thumbnails will fall back to local course images in the component
  },
  {
    _id: 'r2',
    title: 'Daily vocabulary — 5 words you need',
    category: 'Vocabulary',
    duration: '0:45',
    active: true,
    order: 1,
  },
  {
    _id: 'r3',
    title: 'Student story: From shy to fluent',
    category: 'Success Story',
    duration: '0:58',
    active: true,
    order: 2,
  },
  {
    _id: 'r4',
    title: 'Common grammar mistakes Indians make',
    category: 'Grammar Tip',
    duration: '0:41',
    active: true,
    order: 3,
  },
  {
    _id: 'r5',
    title: 'Live class highlight — Ajay Sir',
    category: 'Class Highlight',
    duration: '0:27',
    active: true,
    order: 4,
  },
  {
    _id: 'r6',
    title: 'Pronunciation drill — Th sounds',
    category: 'Pronunciation',
    duration: '0:36',
    active: true,
    order: 5,
  },
];



export const fallbackYoutube: SanityYoutubeVideo[] = [
  {
    _id: 'yt1',
    title: 'How to introduce yourself in English — full class',
    youtubeUrl: '',
    category: 'Spoken English',
    duration: '12:40',
    active: true,
    order: 0,
  },
  {
    _id: 'yt2',
    title: '10 grammar mistakes every student makes',
    youtubeUrl: '',
    category: 'Grammar',
    duration: '08:15',
    active: true,
    order: 1,
  },
  {
    _id: 'yt3',
    title: 'Student story: From nervous to fluent',
    youtubeUrl: '',
    category: 'Success Story',
    duration: '06:22',
    active: true,
    order: 2,
  },
  {
    _id: 'yt4',
    title: 'Daily vocabulary booster — Week 1',
    youtubeUrl: '',
    category: 'Vocabulary',
    duration: '10:05',
    active: true,
    order: 3,
  },
];

export const fallbackSettings: SiteSettings = {
  heroEyebrow: "INDIA'S TRUSTED ENGLISH LEARNING PLATFORM",
  heroTitleLine1: 'Speak English',
  heroTitlePrefix: 'with',
  heroTypedWords: ['Confidence', 'Fluency', 'Clarity'],
  heroSubtitle: 'Learn English anytime, anywhere with Persona Institute & English with Khushi.',
  learnersCount: '10,000+ Learners',
  learnersText: 'are improving their English with Persona Institute',
  reelsSectionTitle: 'Watch Our Latest Reels',
  reelsSectionKicker: 'INSTAGRAM',
  reelsSectionSubtitle: 'Quick tips, student stories and class highlights',
  youtubeSectionTitle: 'YouTube Videos',
  youtubeSectionKicker: 'Watch & Learn',
  youtubeSectionSubtitle: 'Free lessons, class highlights and student journeys.',
  youtubeChannelUrl: '',
  instagramUrl: 'https://www.instagram.com/',
  statLearners: '10,000+',
  statYears: '4+',
  statBatches: '50+',
  statSatisfaction: '98%',
  aboutTitle: 'About Persona Institute',
  aboutBody: 'Persona Institute helps students speak English with confidence through live classes, recorded courses and daily practice.',
  contactEmail: 'hello@personaenglish.in',
  contactPhone: '',
  contactAddress: '',
  contactWhatsapp: '',
  youtubeSectionTitle: 'Know About Free and Paid Courses',
  youtubeSectionKicker: 'VISIT OUR YOUTUBE CHANNEL',
};
