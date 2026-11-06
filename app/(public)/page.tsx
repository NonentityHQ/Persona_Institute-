import { getActiveOffer, getReels, getYoutubeVideos, getSiteSettings, getSiteCards } from '@/lib/sanity/server';
import { fetchAllBrandCourses, toHomeCourse } from '@/lib/classplus/client';
import { courses as staticCourses } from '@/lib/data';
import HomePageClient from './HomePageClient';

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

  const homeCourses =
    classplusCourses.length > 0
      ? classplusCourses.slice(0, 8).map((c, i) => toHomeCourse(c, i))
      : staticCourses;

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
