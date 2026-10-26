import CourseDetailView from "@/components/CourseDetailView";
import { courseDetails } from "@/lib/course-details";

// Pre-rendered at build time: course navigation is instant (no server round trip on click).
export function generateStaticParams() {
  return courseDetails.map((course) => ({ slug: course.id }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Unknown slugs keep the original behaviour: fall back to the first course.
  const course = courseDetails.find((item) => item.id === slug) ?? courseDetails[0];
  return <CourseDetailView course={course} />;
}
