import { notFound } from 'next/navigation';
import CourseDetailView from '@/components/CourseDetailView';
import {
  fetchAllBrandCourses,
  fetchCourseById,
  toCourseDetail,
} from '@/lib/classplus/client';
import { courseDetails } from '@/lib/course-details';

export const revalidate = 60;

/** Prefer Classplus IDs; keep static ids so old links still build */
export async function generateStaticParams() {
  try {
    const list = await fetchAllBrandCourses();
    if (list.length) {
      return list.map((c) => ({ slug: c.id }));
    }
  } catch {
    /* offline build */
  }
  return courseDetails.map((course) => ({ slug: course.id }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1) Live Classplus course
  const live = await fetchCourseById(slug);
  if (live) {
    return <CourseDetailView course={toCourseDetail(live)} />;
  }

  // 2) Legacy static fallback (old marketing slugs)
  const staticCourse = courseDetails.find((item) => item.id === slug);
  if (staticCourse) {
    return (
      <CourseDetailView
        course={{
          ...staticCourse,
          enrollUrl: '/contact',
        }}
      />
    );
  }

  notFound();
}
