'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import TransitionLink from '@/components/motion/TransitionLink';
import Card3D from '@/components/motion/Card3D';
import { HeroFade, HeroHeading } from '@/components/motion/HeroText';
import { Reveal } from '@/components/motion/Reveal';
import { DUR, EASE_IN_OUT, cardItem, staggerParent } from '@/lib/motion';
import {
  ArrowRight,
  Search,
  Grid2X2,
  Star,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type CourseCard = {
  id: string;
  app: string;
  title: string;
  image: string;
  tag: string;
  category: string;
  desc: string;
  price: string;
  old?: string;
  discount?: string;
  rating: string;
  learners: string;
  features: string[];
  enrollUrl?: string;
};

type Props = {
  courseList: CourseCard[];
  live?: boolean;
};

function CourseCta({
  c,
  children,
  className,
}: {
  c: CourseCard;
  children: React.ReactNode;
  className?: string;
}) {
  const href = c.enrollUrl || `/courses/${c.id}`;
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={className}>
      {children}
    </TransitionLink>
  );
}

export default function CoursesClient({ courseList, live = false }: Props) {
  const [appFilter, setAppFilter] = useState('All Courses');
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const boxes = useRef<Record<string, HTMLElement | null>>({});

  const filtered = useMemo(() => {
    return courseList.filter((c) => {
      const appOk = appFilter === 'All Courses' || c.app === appFilter;
      const q = query.trim().toLowerCase();
      const textOk =
        !q ||
        `${c.title} ${c.desc} ${c.app} ${c.tag}`.toLowerCase().includes(q);
      return appOk && textOk;
    });
  }, [courseList, appFilter, query]);

  const visible =
    filtered.length > 4
      ? [
          ...filtered.slice(offset % filtered.length),
          ...filtered.slice(0, offset % filtered.length),
        ].slice(0, 4)
      : filtered;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fffdfb] text-[#102d70]">
      {/* Hero — same as original */}
      <section className="courses-hero-section relative isolate overflow-hidden bg-[#fff4e9]">
        <div
          aria-hidden
          className="courses-hero-bg absolute inset-0 -z-20"
          style={{ backgroundImage: "url('/images/about-hero-background.webp')" }}
        />
        <div aria-hidden className="courses-hero-wash absolute inset-0 -z-10" />
        <div aria-hidden className="courses-hero-bottom absolute inset-x-0 bottom-0 -z-0 h-14" />

        <div className="relative mx-auto grid max-w-[1600px] items-center gap-5 px-5 pb-7 pt-5 sm:px-7 md:min-h-[340px] md:grid-cols-[minmax(0,1fr)_260px] md:gap-7 md:px-10 md:py-7 lg:min-h-[360px] lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
          <div className="courses-hero-copy relative z-10 max-w-[780px]">
            <HeroFade>
              <span className="inline-flex rounded-full bg-white/75 px-4 py-1.5 text-[11px] font-extrabold tracking-[.12em] text-[#f04422] shadow-sm">
                OUR COURSES
              </span>
            </HeroFade>
            <HeroHeading
              ariaLabel="Learn English Your Way"
              className="mt-3 max-w-[780px] text-[clamp(2.35rem,4.4vw,4rem)] font-black leading-[1.02] tracking-[-.05em] text-[#102d70]"
              lines={[['Learn English', { text: 'Your Way', className: 'courses-title-accent' }]]}
            />
            <HeroFade delay={0.35}>
              <p className="mt-3 max-w-[590px] text-sm leading-relaxed text-[#183d78] sm:text-base lg:text-[17px]">
                Choose from structured courses designed by Ajay Sir. Learn at your own pace with live classes,
                recorded lectures, practice materials and personal guidance.
              </p>
            </HeroFade>
            <HeroFade delay={0.45}>
              <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold text-[#234783]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  Live & Recorded Classes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  Practice Tests & Worksheets
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  PDF Study Materials
                </span>
              </div>
            </HeroFade>
          </div>

          <div className="courses-hero-stats relative z-10 hidden md:block">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[#52658d]">Happy Learners</span>
                  <strong>10,000+</strong>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[#52658d]">Video Lessons</span>
                  <strong>500+</strong>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[#52658d]">Average Rating</span>
                  <strong>4.8/5</strong>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[#52658d]">Visible Improvement</span>
                  <strong>95%</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App picker — NO course counts */}
      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-2">
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">Choose Your Learning App</h2>
          <p className="mt-1 text-sm text-[#52658d]">Browse both apps together, or filter courses by app.</p>
        </div>
        <div className="course-app-picker grid gap-3 md:grid-cols-3" role="group" aria-label="Filter courses by app">
          <button
            type="button"
            onClick={() => {
              setAppFilter('All Courses');
              setOffset(0);
            }}
            className={`course-app-tile course-app-all ${appFilter === 'All Courses' ? 'is-active' : ''}`}
          >
            <span className="course-app-icon">
              <Grid2X2 size={27} />
            </span>
            <span className="course-app-copy">
              <strong>All Courses</strong>
              <small>All courses from both apps</small>
            </span>
            {appFilter === 'All Courses' && <CheckCircle2 className="course-app-check" size={22} />}
          </button>

          <button
            type="button"
            onClick={() => {
              setAppFilter('Persona English');
              setOffset(0);
            }}
            className={`course-app-tile course-app-persona ${appFilter === 'Persona English' ? 'is-active' : ''}`}
          >
            <span className="course-app-icon">
              <Image src="/images/persona-logo.png" alt="" width={56} height={56} />
            </span>
            <span className="course-app-copy">
              <strong>Persona English</strong>
              <small>Learn with Ajay Sir</small>
            </span>
            {appFilter === 'Persona English' && <CheckCircle2 className="course-app-check" size={22} />}
          </button>

          <button
            type="button"
            onClick={() => {
              setAppFilter('English with Khushi');
              setOffset(0);
            }}
            className={`course-app-tile course-app-khushi ${appFilter === 'English with Khushi' ? 'is-active' : ''}`}
          >
            <span className="course-app-icon">
              <Image
                src="/images/course-khushi.jpg"
                alt=""
                width={56}
                height={56}
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <span className="course-app-copy">
              <strong>English with Khushi</strong>
              <small>Learn with Khushi Ma&apos;am</small>
            </span>
            {appFilter === 'English with Khushi' && <CheckCircle2 className="course-app-check" size={22} />}
          </button>
        </div>

        {/* Optional search only — no vocabulary/category chips */}
        <div className="mt-5">
          <label className="relative block max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOffset(0);
              }}
              placeholder="Search courses..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-[#ff1744]/20 focus:ring-2"
            />
          </label>
        </div>
      </section>

      {/* Popular courses grid */}
      <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-3 sm:px-6 lg:px-10">
        <Reveal className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-[-.04em] sm:text-[34px]">Popular Courses</h2>
            <p className="mt-1 text-sm text-[#52658d] sm:text-base">
              {live ? 'Live prices from Classplus. ' : ''}
              Most loved courses by our students. Start learning today and see the difference!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - 1))}
              aria-label="Previous courses"
              className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 bg-white text-red-500 shadow-sm transition hover:-translate-y-0.5"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => setOffset((offset + 1) % Math.max(1, filtered.length))}
              aria-label="Next courses"
              className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 bg-white text-red-500 shadow-sm transition hover:-translate-y-0.5"
            >
              <ChevronRight />
            </button>
          </div>
        </Reveal>

        {visible.length ? (
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerParent(0.06)}
            className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((c, i) => (
                <m.div
                  key={c.id}
                  layout="position"
                  variants={cardItem}
                  exit="exit"
                  transition={{ layout: { duration: DUR.routeEnter, ease: EASE_IN_OUT } }}
                  className="min-w-0"
                >
                  <Card3D
                    as="article"
                    className="course-product-card flex h-full min-w-0 flex-col rounded-[20px] border border-slate-100 bg-white p-2.5 shadow-[0_5px_20px_rgba(15,39,87,.07)]"
                  >
                    <div
                      ref={(el) => {
                        boxes.current[c.id] = el;
                      }}
                      className="c3d-z1 relative overflow-hidden rounded-xl bg-[#f8f6f4]"
                    >
                      <Image
                        src={c.image}
                        alt={c.title}
                        width={720}
                        height={540}
                        sizes="(max-width:640px) 92vw, (max-width:1280px) 46vw, 24vw"
                        className="course-product-image h-[190px] w-full object-cover sm:h-[180px] xl:h-[200px]"
                        unoptimized={typeof c.image === 'string' && c.image.startsWith('http')}
                      />
                      <span
                        className={`absolute left-2 top-2 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow ${
                          i === 0
                            ? 'bg-[#ff1744]'
                            : i === 1
                              ? 'bg-blue-600'
                              : i === 2
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                      >
                        {c.tag}
                      </span>
                      <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-black/65 text-white shadow-lg">
                        <Play size={16} fill="currentColor" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-2 pb-1 pt-3">
                      <div className="mb-2 flex">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            c.app === 'Persona English'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-violet-50 text-violet-700'
                          }`}
                        >
                          {c.app}
                        </span>
                      </div>
                      <h3 className="c3d-z1 text-[17px] font-extrabold leading-[1.2] text-[#092969]">{c.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-snug text-[#526b9f]">{c.desc}</p>

                      <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-[#234783]">
                        {c.features.map((f) => (
                          <span key={f} className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="shrink-0 text-[#ff4b28]" />
                            {f}
                          </span>
                        ))}
                      </div>

                      {c.learners ? (
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#526b9f]">
                          <Star size={15} fill="#ffb000" stroke="#ffb000" />
                          <strong className="text-[#173879]">{c.rating}</strong>
                          <span>({c.learners})</span>
                        </div>
                      ) : null}

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <strong className="text-xl font-black text-[#092969]">{c.price}</strong>
                        {c.old ? <span className="text-xs text-slate-400 line-through">{c.old}</span> : null}
                        {c.discount ? (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-600">
                            {c.discount}
                          </span>
                        ) : null}
                      </div>

                      <div className="c3d-z2 mt-auto grid grid-cols-2 gap-2 pt-3">
                        <CourseCta
                          c={c}
                          className="rounded-xl border border-red-500 px-2 py-2.5 text-center text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          View Details
                        </CourseCta>
                        <CourseCta
                          c={c}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#ff1744] to-[#ff4b18] px-2 py-2.5 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
                        >
                          Get this course <ArrowRight size={14} />
                        </CourseCta>
                      </div>
                    </div>
                  </Card3D>
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
            <Search className="mx-auto mb-3 text-slate-400" />
            <p className="font-semibold">No courses match your search.</p>
            <button
              type="button"
              className="mt-3 text-sm font-bold text-red-600"
              onClick={() => {
                setQuery('');
                setAppFilter('All Courses');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="courses-bottom-cta relative overflow-hidden px-5 py-10 sm:px-8">
        <div className="relative mx-auto flex max-w-[1450px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-extrabold tracking-wider text-red-600">
              YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Build confidence. <span className="text-[#f04422]">Speak English.</span> Grow every day.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#284779] sm:text-base">
              Choose the learning path that fits your goals and get guidance at every step.
            </p>
            <TransitionLink
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1744] to-[#ff4b18] px-6 py-3 font-bold text-white shadow-lg shadow-rose-200/60"
            >
              Need help choosing? Contact us <ArrowRight size={17} />
            </TransitionLink>
          </div>
          <div className="courses-cta-badge flex items-center gap-3 rounded-2xl border border-white bg-white/85 p-4 shadow-lg">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-orange-500">
              <Sparkles size={28} />
            </span>
            <span>
              <strong className="block text-xl font-black">Learn your way</strong>
              <span className="text-sm text-[#52658d]">Live · Recorded · Practice</span>
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-[#102d70] px-5 py-4 text-center text-xs text-white/80">
        © 2026 Persona Institute. Learn · Practice · Grow.
      </footer>
    </main>
  );
}
