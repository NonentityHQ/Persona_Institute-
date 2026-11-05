'use client';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import TransitionLink from '@/components/motion/TransitionLink';
import SharedImage from '@/components/motion/SharedImage';
import { HeroFade } from '@/components/motion/HeroText';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export type CourseDetailViewModel = {
  id: string;
  title: string;
  image: string;
  tag: string;
  price: string;
  old: string;
  duration: string;
  description: string;
  features: string[];
  enrollUrl?: string;
};

/** Course details — data comes from Classplus (live) with static fallback. */
export default function CourseDetailView({ course }: { course: CourseDetailViewModel }) {
  const enroll = course.enrollUrl || '/contact';
  const isExternal = /^https?:\/\//i.test(enroll);

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#102d70]">
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2 md:py-16">
        <div>
          <TransitionLink
            href="/courses"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#52658d] transition-colors hover:text-[#f04422]"
          >
            <ArrowLeft size={16} /> All courses
          </TransitionLink>
          <SharedImage
            id={`course-${course.id}`}
            src={course.image}
            alt={course.title}
            width={1448}
            height={1086}
            className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <HeroFade delay={0.15}>
            <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              {course.tag}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-4 leading-relaxed text-[#52658d]">{course.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-black">{course.price}</span>
              {course.old ? <span className="text-slate-400 line-through">{course.old}</span> : null}
              <span className="flex items-center gap-1 text-sm text-amber-600">
                <Star size={16} fill="currentColor" /> 4.8 learner rating
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-[#52658d]">
              <Clock3 size={17} />
              {course.duration}
            </div>
          </HeroFade>
          <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" delay={0.25}>
            {course.features.map((feature) => (
              <StaggerItem
                key={feature}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-3 text-sm"
              >
                <CheckCircle2 size={17} className="text-orange-500" />
                {feature}
              </StaggerItem>
            ))}
          </Stagger>
          <HeroFade delay={0.45}>
            <div className="mt-7 flex flex-wrap gap-3">
              {isExternal ? (
                <a
                  href={enroll}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1744] to-[#ff4b18] px-6 py-3 font-bold text-white shadow-lg"
                >
                  Enroll now <ExternalLink size={17} />
                </a>
              ) : (
                <TransitionLink
                  href={enroll}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1744] to-[#ff4b18] px-6 py-3 font-bold text-white shadow-lg"
                >
                  Enquire about this course <ArrowRight size={17} />
                </TransitionLink>
              )}
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white px-5 py-3 font-bold"
              >
                <Headphones size={17} /> Talk to our team
              </TransitionLink>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#52658d]">
              <ShieldCheck size={16} className="shrink-0" /> Prices &amp; batch details sync from
              Classplus. Confirm inclusions with the institute before enrolment.
            </p>
          </HeroFade>
        </div>
      </section>
      <footer className="bg-[#102d70] px-5 py-4 text-center text-xs text-white/80">
        © 2026 Persona Institute. Learn · Practice · Grow.
      </footer>
    </main>
  );
}
