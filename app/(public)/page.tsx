import { getActiveOffer, getReels, getYoutubeVideos, getSiteSettings, getSiteCards } from '@/lib/sanity/server';
import { fetchAllBrandCourses, toHomeCourse } from '@/lib/classplus/client';
import HomePageClient from './HomePageClient';

export const metadata = { title: 'Spoken English Courses, Grammar & Vocabulary', description: 'Learn spoken English with Persona Institute through live classes, recorded courses, grammar lessons, vocabulary practice and learning resources.', alternates: { canonical: '/' }, openGraph: { title: 'Spoken English Courses | Persona Institute', description: 'Live and recorded English learning, grammar, vocabulary and practice.', url: 'https://personaenglish.in/' } };

export const revalidate = 60; // ISR — marketing + Classplus courses

export default async function HomePage() {
  const [offer, reels, youtube, settings, siteCards, classplusCourses] = await Promise.all([
    getActiveOffer(),
    getReels(),
    getYoutubeVideos(),
    getSiteSettings(),
    getSiteCards('home'),
    fetchAllBrandCourses().catch(() => []),
  ]);

  const homeCourses = classplusCourses.slice(0, 8).map((c, i) => toHomeCourse(c, i));

  return (
    <HomePageClient
      offer={offer}
      reels={reels}
      youtube={youtube}
      settings={settings}
      courses={homeCourses}
      siteCards={siteCards}
    />
  );
}
