import { getSiteCards } from '@/lib/sanity/server';
import ReviewsPageClient from './ReviewsPageClient';

export const metadata = { title: 'Student Reviews & Success Stories', description: 'Read student experiences and success stories from learners at Persona Institute and English with Khushi.', alternates: { canonical: '/reviews' } };

export const revalidate = 120;

export default async function ReviewsPage() {
  const siteCards = await getSiteCards('success-stories');
  return <ReviewsPageClient siteCards={siteCards} />;
}
