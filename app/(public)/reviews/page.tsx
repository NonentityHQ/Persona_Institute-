import { getSiteCards } from '@/lib/sanity/server';
import ReviewsPageClient from './ReviewsPageClient';

export const revalidate = 120;

export default async function ReviewsPage() {
  const siteCards = await getSiteCards('success-stories');
  return <ReviewsPageClient siteCards={siteCards} />;
}
