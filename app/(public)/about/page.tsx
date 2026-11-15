import { getSiteCards } from '@/lib/sanity/server';
import AboutPageClient from './AboutPageClient';

export const metadata = { title: 'About Persona Institute', description: 'Learn about Persona Institute, our English learning approach, instructors and commitment to practical communication skills.', alternates: { canonical: '/about' } };

export const revalidate = 120;

export default async function AboutPage() {
  const siteCards = await getSiteCards('about');
  return <AboutPageClient siteCards={siteCards} />;
}
