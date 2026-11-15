import { getSiteCards } from '@/lib/sanity/server';
import FreeTestsPageClient from './FreeTestsPageClient';

export const metadata = { title: 'Free English Tests & Practice', description: 'Practice English with grammar, vocabulary, reading and demo tests from Persona Institute.', alternates: { canonical: '/free-tests' } };

export const revalidate = 120;

export default async function FreeTestsPage() {
  const siteCards = await getSiteCards('free-tests');
  return <FreeTestsPageClient siteCards={siteCards} />;
}
