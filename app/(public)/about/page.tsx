import { getSiteCards } from '@/lib/sanity/server';
import AboutPageClient from './AboutPageClient';

export const revalidate = 120;

export default async function AboutPage() {
  const siteCards = await getSiteCards('about');
  return <AboutPageClient siteCards={siteCards} />;
}
