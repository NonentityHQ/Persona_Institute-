import { fetchAllBrandCourses, type ClassplusCourse } from '@/lib/classplus/client';
import { brands } from '@/lib/classplus/brands';
import CoursesClient, { type CourseCard } from './CoursesClient';
import { getSiteCards } from '@/lib/sanity/server';

export const revalidate = 60;

function formatInr(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function mapCourse(c: ClassplusCourse, index: number): CourseCard {
  const brand = brands[c.brandId];
  const hasDiscount = c.price > c.finalPrice && c.finalPrice >= 0;
  const discountPct =
    hasDiscount && c.price > 0
      ? `${Math.round(((c.price - c.finalPrice) / c.price) * 100)}% OFF`
      : undefined;

  const tags = ['Bestseller', 'Most Popular', 'Fast Track', 'New', 'Live', 'Recorded'];
  const features =
    c.brandId === 'khushi'
      ? ['Practice Sessions', 'Notes', 'Flexible timing', 'Certificate']
      : ['Classes', 'Practice', 'PDF Notes', 'Support'];

  const raw = (c.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let desc = raw;
  if (desc.length > 110) desc = desc.slice(0, 110).replace(/\s+\S*$/, '') + '…';
  if (!desc) desc = `Live & recorded learning with ${brand.name}.`;

  return {
    id: String(c.id),
    app: brand.name,
    title: c.title,
    image: c.imageUrl || '/images/course-recorded.webp',
    tag: tags[index % tags.length],
    category: 'All Courses',
    desc,
    price: c.isFree ? 'Free' : formatInr(c.finalPrice),
    old: hasDiscount ? formatInr(c.price) : undefined,
    discount: discountPct,
    rating: '4.8',
    learners:
      typeof c.subscriberCount === 'number' && c.subscriberCount > 0
        ? `${c.subscriberCount.toLocaleString('en-IN')} students`
        : '',
    features,
    enrollUrl: c.enrollUrl,
  };
}

const FALLBACK: CourseCard[] = [
  {
    id: 'recorded-spoken-english',
    app: 'Persona English',
    title: '4 Months Zero to Fluent Spoken English Course',
    image: '/images/course-recorded.webp',
    tag: 'Bestseller',
    category: 'All Courses',
    desc: 'Complete spoken English course from basic to advanced with real-life practice.',
    price: '₹1,199',
    old: '₹2,499',
    discount: '52% OFF',
    rating: '4.8',
    learners: '2.1K students',
    features: ['Recorded Classes', 'Practice Sessions', 'PDF Notes', 'Lifetime Access'],
    // No fabricated course ID in fallback mode; use the real Classplus catalogue.
    enrollUrl: 'https://bspkr.courses.store/courses',
  },
];

export default async function CoursesPage() {
  const siteCards = await getSiteCards('courses');
  let list: ClassplusCourse[] = [];
  try {
    list = await fetchAllBrandCourses();
  } catch (e) {
    console.warn('[courses] fetch failed', e);
  }

  const live = list.length > 0;
  const courseList = live ? list.map(mapCourse) : FALLBACK;

  return <CoursesClient courseList={courseList} live={live} siteCards={siteCards} />;
}
