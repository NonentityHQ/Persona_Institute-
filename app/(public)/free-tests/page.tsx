import { getSiteCards } from '@/lib/sanity/server';
import FreeTestsPageClient from './FreeTestsPageClient';

export const revalidate = 120;

export default async function FreeTestsPage() {
  const siteCards = await getSiteCards('free-tests');
  return <FreeTestsPageClient siteCards={siteCards} />;
}
