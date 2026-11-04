import { getActiveOffer, getReels, getYoutubeVideos, getSiteSettings } from '@/lib/sanity/client';
import HomePageClient from './HomePageClient';

export const revalidate = 60; // ISR — refresh marketing content every minute

export default async function HomePage() {
  const [offer, reels, youtube, settings] = await Promise.all([
    getActiveOffer(),
    getReels(),
    getYoutubeVideos(),
    getSiteSettings(),
  ]);

  return <HomePageClient offer={offer} reels={reels} youtube={youtube} settings={settings} />;
}
