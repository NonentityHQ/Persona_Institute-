'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m as motion } from 'framer-motion';
import {
  ArrowRight, ClipboardCheck, BookOpen, Smartphone, Play,
  Video, BookMarked, LayoutGrid, MonitorPlay, X, CheckCircle2,
  Trophy, Star, ShieldCheck, ShoppingCart, Target, Layers, Users,
} from 'lucide-react';
import '../home3d.css';
import { videos, type Course } from '@/lib/data';
import { DUR, EASE_OUT } from '@/lib/motion';
import { useRouteTransition } from '@/components/motion/RouteTransition';
import { HeroFade, HeroHeading, TypedWord } from '@/components/motion/HeroText';
import Card3D from '@/components/motion/Card3D';
import CountUp from '@/components/motion/CountUp';
import Hero3D from '@/components/home3d/Hero3D';
import Reveal3D from '@/components/home3d/Reveal3D';
import OfferBanner from '@/components/OfferBanner';
import GrowCarousel from '@/components/reels/GrowCarousel';
import YoutubeSection from '@/components/YoutubeSection';
import type { SanityOffer, SanityReel, SanityYoutubeVideo, SiteSettings, SanitySiteCard } from '@/lib/sanity/client';
import { fallbackOffer, fallbackSettings } from '@/lib/sanity/fallback';
import { sanityFieldAttribute } from '@/lib/sanity/visual';
import { cleanSanityString } from '@/lib/sanity/client';

/** "10,000+" -> { n: 10000, suffix: '+' }. Falls back to the given defaults if it can't be parsed. */
function parseStat(raw: string | undefined, n: number, suffix: string) {
  const m = raw?.match(/^\s*([\d,.]+)\s*(.*)$/);
  if (!m) return { n, suffix };
  const num = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(num)) return { n, suffix };
  const suf = m[2].trim();
  return { n: num, suffix: suf === '+' || suf === '%' ? suf : suffix };
}

const HERO_STATS: Array<{
  icon: typeof Trophy; label: string; n?: number; suffix?: string; decimals?: number; text?: string; fill?: boolean;
}> = [
  { icon: Trophy, n: 10000, suffix: '+', label: 'Happy Learners' },
  { icon: Video, n: 500, suffix: '+', label: 'Video Lessons' },
  { icon: Star, n: 4.8, decimals: 1, suffix: '/5', label: 'Student Rating', fill: true },
  { icon: BookOpen, n: 25000, suffix: '+', label: 'Vocabulary Words' },
  { icon: ClipboardCheck, text: '100%', label: 'Exam Focused' },
  { icon: ShieldCheck, text: '100%', label: 'At Your Own Pace' },
];

/** Home course card — Classplus-mapped or static fallback from lib/data */
export type HomeCourse = Course & { enrollUrl?: string; buttonLabel?: string; imageAlt?: string; imageFit?: 'contain' | 'cover'; imagePosition?: string };

type Props = {
  offer: SanityOffer | null;
  reels: SanityReel[];
  youtube: SanityYoutubeVideo[];
  settings: SiteSettings | null;
  courses: HomeCourse[];
  siteCards: SanitySiteCard[];
};

export default function HomePageClient({ offer, reels, youtube, settings, courses, siteCards }: Props) {
  const [modal, setModal] = useState<'video' | 'checkout' | 'offer' | null>(null);
  const [selected, setSelected] = useState<HomeCourse | null>(null);
  const { navigate } = useRouteTransition();

  const s = settings || fallbackSettings;
  const activeOffer = offer || fallbackOffer;
  const activeReels = reels;
  const activeYoutube = youtube;
  const cardByKey = (key: string) => siteCards.find((card) => cleanSanityString(typeof card.key === 'string' ? card.key : card.key?.current) === key);
  const editableHomeCourses = courses.map((course) => {
    const override = siteCards.find((card) => cleanSanityString(card.externalId) === course.id && cleanSanityString(card.section) === 'course-card');
    if (!override) return course;
    const oldPriceText = cleanSanityString(override.oldPriceText);
    const oldPrice = oldPriceText ? Number(oldPriceText.replace(/[^0-9.]/g, '')) : course.oldPrice;
    return {
      ...course,
      title: override.title || course.title,
      subtitle: override.description || override.subtitle || course.subtitle,
      image: cleanSanityString(override.imageUrl) || course.image,
      imageAlt: override.imageAlt || override.title || course.title,
      imageFit: cleanSanityString(override.imageFit) === 'cover' ? 'cover' : 'contain',
      imagePosition: cleanSanityString(override.imagePosition) || 'center',
      tag: override.badge || course.tag,
      priceLabel: override.priceText || course.priceLabel,
      oldPrice: Number.isFinite(oldPrice) ? oldPrice : course.oldPrice,
      // Keep Persona's real Classplus course-ID URL; a stale CMS buttonUrl
      // must not override the destination.
      enrollUrl: course.duration === 'Persona English' ? course.enrollUrl : (cleanSanityString(override.buttonUrl) || course.enrollUrl),
      buttonLabel: override.buttonLabel || undefined,
    };
  });
  const openCheckout = (course: Course) => {
    setSelected(course);
    setModal('checkout');
  };
  const goCourses = () => navigate('/courses');
  const goTests = () => navigate('/free-tests');

  const trust = [
    { ...parseStat(s.statLearners, 10000, '+'), label: 'Happy Learners' },
    { ...parseStat(s.statYears, 4, '+'), label: 'Years Teaching' },
    { ...parseStat(s.statBatches, 50, '+'), label: 'Live Batches' },
    { ...parseStat(s.statSatisfaction, 98, '%'), label: 'Satisfaction' },
  ];

  // Keep the original six headline metrics. The additional trust metrics remain
  // in the community section below instead of overcrowding this compact card deck.
  const deckStats = HERO_STATS.map((stat) => stat.label === 'Happy Learners'
    ? { ...stat, ...parseStat(s.statLearners, 10000, '+') }
    : stat);

  return (
    <main className="h3d-page">
      {/* ===== HERO: copy on the left, the video lives in a real 3D stage on the right ===== */}
      <Hero3D
        learnersLabel={s.learnersCount || '10,000+ Learners'}
        after={
          <>
            <HeroFade delay={0.55}>
              <div className="h3d-features">
                {[
                  { icon: Video, label: 'Live & Recorded', sub: 'Classes' },
                  { icon: ClipboardCheck, label: 'Practice Tests', sub: '& Worksheets' },
                  { icon: BookOpen, label: 'Vocabulary', sub: 'Booster' },
                  { icon: Smartphone, label: 'Learn on', sub: 'Mobile App' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="h3d-feature">
                    <span className="h3d-feature-ico"><Icon size={18} /></span>
                    <span>{label}<br />{sub}</span>
                  </div>
                ))}
              </div>
            </HeroFade>
            <HeroFade delay={0.65}>
              <div className="h3d-cta">
                <button type="button" className="h3d-btn h3d-btn-primary" onClick={goCourses}>
                  Explore Courses <ArrowRight size={17} />
                </button>
                <button type="button" className="h3d-btn h3d-btn-ghost" onClick={goTests}>
                  <Play size={16} fill="currentColor" /> Try a Free Test
                </button>
              </div>
            </HeroFade>
            <HeroFade delay={0.75}>
              <div className="h3d-proof">
                <div className="h3d-avatars" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n}><Image src={`/images/avatars/a${n}.webp`} alt="" width={96} height={96} sizes="24px" quality={75} /></span>
                  ))}
                </div>
                <p>
                  <b>{s.learnersCount || '10,000+ Learners'}</b>
                  {s.learnersText || 'are improving their English with Persona Institute'}
                </p>
              </div>
            </HeroFade>
          </>
        }
      >
        <HeroFade>
          <span className="eyebrow">{s.heroEyebrow || "India's Trusted English Learning Platform"}</span>
        </HeroFade>
        <HeroHeading
          ariaLabel="Speak English with Confidence"
          delay={0.1}
          className="h3d-title"
          lines={[
            [{ node: <span className="h3d-l1">{s.heroTitleLine1 || 'Speak English'}</span> }],
            [s.heroTitlePrefix || 'with'],
            [
              {
                node: (
                  <span className="h3d-conf">
                    <TypedWord
                      words={s.heroTypedWords?.length ? s.heroTypedWords : ['Confidence', 'Fluency', 'Clarity']}
                      className="h3d-accent"
                      suffix="."
                    />
                  </span>
                ),
              },
            ],
          ]}
        />
        <HeroFade delay={0.45}>
          <p className="h3d-sub">{s.heroSubtitle}</p>
        </HeroFade>
      </Hero3D>

      {/* ===== SIX RESPONSIVE NUMBER CARDS ===== */}
      <div className="h3d-stats">
        <div className="h3d-stats-grid">
          {deckStats.map(({ icon: Icon, label, n, suffix, decimals, text, fill }, i) => (
            <Reveal3D key={label} delay={i * 70}>
              <Card3D className="h3d-stat" maxTilt={0} lift={4} glare={false}>
                <span className="h3d-stat-ico c3d-z2"><Icon size={22} fill={fill ? 'currentColor' : 'none'} /></span>
                <span className="h3d-stat-txt c3d-z1">
                  <b>{text ?? <CountUp value={n} suffix={suffix} decimals={decimals} />}</b>
                  <small>{label}</small>
                </span>
              </Card3D>
            </Reveal3D>
          ))}
        </div>
      </div>

      {/* ===== OFFER (Sanity-driven) ===== */}
      <div className="h3d-offer-wrap h3d-section">
        <Reveal3D>
          <OfferBanner offer={activeOffer} onCta={() => setModal('offer')} />
        </Reveal3D>
      </div>

      {/* ===== COURSES ===== */}
      <section className="section-wrap h3d-section" id="courses">
        <Reveal3D className="h3d-head">
          <div>
            <p className="section-kicker">POPULAR PROGRAMMES</p>
            <h2 className="section-title">Choose Your Learning Path</h2>
            <p className="h3d-lead">Course list &amp; pricing sync from Classplus. Offer banners &amp; reels are managed in Sanity.</p>
          </div>
          <button type="button" onClick={goCourses} className="h3d-link">
            View all courses <ArrowRight size={16} />
          </button>
        </Reveal3D>

        <div className="h3d-grid">
          {editableHomeCourses.map((course, i) => (
            <Reveal3D key={course.id} delay={i * 90}>
              <Card3D as="article" className="h3d-course" maxTilt={7} lift={10}>
                <div className="h3d-course-img">
                  <Image
                    src={course.image}
                    alt={course.imageAlt || course.title}
                    data-sanity={siteCards.find((card) => cleanSanityString(card.externalId) === course.id && cleanSanityString(card.section) === 'course-card')?._id ? sanityFieldAttribute(siteCards.find((card) => cleanSanityString(card.externalId) === course.id && cleanSanityString(card.section) === 'course-card')!._id, 'siteCard', 'image') : undefined}
                    fill
                    className="c3d-img"
                    style={{ objectFit: (course.imageFit || 'contain') as React.CSSProperties['objectFit'], objectPosition: course.imagePosition || 'center' }}
                    sizes="(max-width: 640px) 100vw, 25vw"
                    quality={75}
                  />
                </div>
                {course.tag && <span className="h3d-tag c3d-z2">{course.tag}</span>}
                <div className="h3d-course-body c3d-z1" data-sanity-edit-target>
                  <h3>{course.title}</h3>
                  <p>{course.subtitle}</p>
                  <div className="h3d-course-foot">
                    <div>
                      {course.oldPrice != null && (
                        <span className="h3d-old">₹{course.oldPrice.toLocaleString('en-IN')}</span>
                      )}
                      <b className="h3d-price">
                        {course.priceLabel ??
                          (course.price === 0 ? 'Enquire' : `₹${course.price.toLocaleString('en-IN')}`)}
                      </b>
                    </div>
                    <button
                      type="button"
                      className="h3d-enroll"
                      onClick={() => {
                        const url = (course as HomeCourse).enrollUrl;
                        if (url && /^https?:\/\//i.test(url)) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                          return;
                        }
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      {course.buttonLabel || 'Enroll'}
                    </button>
                  </div>
                </div>
              </Card3D>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* ===== VIDEO STRIP ===== */}
      <section className="section-wrap h3d-section">
        <Reveal3D className="h3d-head">
          <div>
            <p className="section-kicker">{s.youtubeSectionKicker}</p>
            <h2 className="section-title">{s.youtubeSectionTitle}</h2>
          </div>
          <button type="button" onClick={() => setModal('video')} className="h3d-link">
            View All Videos <ArrowRight size={16} />
          </button>
        </Reveal3D>
        <div className="h3d-grid">
          {videos.map((v, i) => (
            <Reveal3D key={v.title} delay={i * 80}>
              <Card3D as="article" className="h3d-vid" maxTilt={8} lift={8}>
                <div className="h3d-vid-stage">
                  <div className="h3d-vid-thumb">
                    <Image
                      src={v.image}
                      alt={v.title}
                      width={800}
                      height={450}
                      className="c3d-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="h3d-vid-time">{v.duration}</span>
                  </div>
                  <button type="button" className="h3d-vid-play c3d-z2" onClick={() => setModal('video')} aria-label={`Play ${v.title}`}>
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                <button type="button" className="h3d-vid-meta c3d-z1" onClick={() => setModal('video')}>
                  <h3>{v.title}</h3>
                  <span>{v.category}</span>
                </button>
              </Card3D>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* ===== WHAT DO YOU WANT ===== */}
      <section id="about" className="section-wrap h3d-section">
        <Reveal3D className="h3d-head">
          <div>
            <p className="section-kicker">COURSES AND BOOKS</p>
            <h2 className="section-title">What Do you want?</h2>
          </div>
        </Reveal3D>
        <div className="h3d-tiles">
          {[
            { key: 'home-live-courses', icon: Video, title: 'Live Courses', desc: 'Join live classes and interact with the teacher' },
            { key: 'home-vocabulary-book', icon: BookMarked, title: 'Vocabulary Book', desc: '25,000+ useful words with examples' },
            { key: 'home-practice-book', icon: LayoutGrid, title: 'Spoken English & Practice Book', desc: 'Complete syllabus book with exercises' },
            { key: 'home-recorded-courses', icon: MonitorPlay, title: 'Recorded Courses', desc: 'Learn anytime, anywhere with lifetime access' },
          ].map((base, i) => {
            const override = cardByKey(base.key);
            const overrideImageUrl = cleanSanityString(override?.imageUrl);
            const overrideImageAlt = override?.imageAlt || override?.title || base.title;
            const overrideId = override?._id;
            const overrideImageFit = cleanSanityString(override?.imageFit) === 'cover' ? 'cover' : 'contain';
            const overrideImagePosition = cleanSanityString(override?.imagePosition) || 'center';
            const title = override?.title || base.title;
            const desc = override?.description || base.desc;
            const Icon = base.icon;
            return (
              <Reveal3D key={base.key} delay={i * 80}>
                <Card3D className="h3d-tile" maxTilt={9} lift={8}>
                  <button type="button" className="h3d-tile-btn" onClick={goCourses} data-sanity-edit-target>
                    <span className="h3d-tile-ico c3d-z2">
                      {overrideImageUrl ? <img src={overrideImageUrl} alt={overrideImageAlt || title} data-sanity={overrideId ? sanityFieldAttribute(overrideId, 'siteCard', 'image') : undefined} className="h-8 w-8" style={{ objectFit: overrideImageFit, objectPosition: overrideImagePosition }} /> : <Icon size={22} />}
                    </span>
                    <span className="c3d-z1">
                      <b>{title}</b>
                      <small>{desc}</small>
                    </span>
                  </button>
                </Card3D>
              </Reveal3D>
            );
          })}
        </div>
      </section>

      {/* ===== PERSONA BOOK STORE FEATURE ===== */}
      <section className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <Reveal3D className="mx-auto max-w-[1600px]">
          <div className="relative isolate overflow-hidden rounded-[28px] border border-white/90 bg-gradient-to-br from-[#fffaf8] via-[#fff7fb] to-[#f0f5ff] px-5 py-8 shadow-[0_24px_70px_rgba(35,55,110,.10)] sm:rounded-[36px] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-purple-200/35 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-[38%] h-80 w-80 rounded-full bg-orange-100/55 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-10 xl:gap-14">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-[11px] font-extrabold tracking-[0.04em] text-rose-600 shadow-sm"><BookOpen size={16} /> {cardByKey('home-book-store')?.eyebrow || 'Persona Book Store'}</span>
                <h2 className="mt-5 max-w-[640px] text-[clamp(2rem,3.8vw,3.7rem)] font-black leading-[1.02] tracking-[-.045em] text-[#102d70]">{cardByKey('home-book-store')?.title || <>Study Better with <span className="inline-block bg-gradient-to-r from-[#c51e55] via-[#ed2450] to-[#f04422] bg-clip-text text-transparent">Persona Books</span></>}</h2>
                <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#4b5e86] sm:text-base"> {cardByKey('home-book-store')?.description || 'Handpicked books to build your English grammar, vocabulary and spoken skills.'}</p>
                <div className="mt-7 grid max-w-[650px] grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-3">
                  {[{ icon: BookOpen, label: "Expert", sub: "Curated", color: "text-rose-500" },{ icon: Target, label: "Exam", sub: "Focused", color: "text-orange-500" },{ icon: Layers, label: "Practice", sub: "Rich", color: "text-violet-600" },{ icon: Users, label: "Learner", sub: "Friendly", color: "text-blue-600" }].map(({ icon: Icon, label, sub, color }, i) => (
                    <div key={label} className={`flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center ${i > 0 ? 'sm:border-l sm:border-slate-200/90' : ''}`}>
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_5px_18px_rgba(24,45,90,.09)] ${color}`}><Icon size={23} strokeWidth={2.3} /></span>
                      <span className="text-sm font-extrabold leading-tight text-[#102d70]">{label}<span className="block">{sub}</span></span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={cleanSanityString(cardByKey('home-book-store')?.buttonUrl) || '/book-store'} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff7417] to-[#f22c16] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(244,75,28,.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(244,75,28,.3)]"><ShoppingCart size={18} /> {cardByKey('home-book-store')?.buttonLabel || 'Explore Book Store'} <ArrowRight size={17} /></a>
                  <a href={cleanSanityString(cardByKey('home-book-store')?.secondaryButtonUrl) || '/book-store'} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-6 py-3 text-sm font-extrabold text-[#102d70] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg"><BookOpen size={18} className="text-rose-500" /> {cardByKey('home-book-store')?.secondaryButtonLabel || 'View All Books'}</a>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[700px] lg:ml-auto">
                <div aria-hidden="true" className="absolute -inset-3 rounded-[30px] bg-gradient-to-br from-violet-200/60 via-rose-100/50 to-orange-100/70 blur-xl" />
                <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-white/70 shadow-[0_22px_55px_rgba(69,48,120,.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(69,48,120,.22)]">
                  <Image data-sanity={cardByKey('home-book-store')?._id ? sanityFieldAttribute(cardByKey('home-book-store')!._id, 'siteCard', 'image') : undefined} src={cleanSanityString(cardByKey('home-book-store')?.imageUrl) || "/images/persona-books-display.webp"} alt={cardByKey('home-book-store')?.imageAlt || "Persona Institute Spoken English, English Grammar and Vocabulary Booster books"} width={1200} height={900} sizes="(max-width: 1024px) 100vw, 52vw" quality={78} className={`block h-auto w-full ${cleanSanityString(cardByKey('home-book-store')?.imageFit) === 'cover' ? 'object-cover' : 'object-contain'}`} style={{ objectPosition: cleanSanityString(cardByKey('home-book-store')?.imagePosition) || 'center' }} />
                </div>
              </div>
            </div>
          </div>
        </Reveal3D>
      </section>

      {/* ===== INSTAGRAM REELS — Grow Carousel ===== */}
      <section className="section-wrap pt-16 pb-10 sm:pt-20" id="reels">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-5 lg:px-10">
          <GrowCarousel reels={activeReels} instagramUrl={s.instagramUrl || fallbackSettings.instagramUrl} />
        </div>
      </section>

      <YoutubeSection
        videos={activeYoutube}
        title={s.youtubeSectionTitle}
        kicker={s.youtubeSectionKicker}
        subtitle={s.youtubeSectionSubtitle}
        channelUrl={s.youtubeChannelUrl || fallbackSettings.youtubeChannelUrl}
      />

      {/* ===== COMMUNITY + TRUST NUMBERS (3D, real numbers from first paint) ===== */}
      <section className="section-wrap h3d-section h3d-trust-wrap">
        <Reveal3D>
          <div className="h3d-trust">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="section-kicker">PERSONA COMMUNITY</p>
              <h2>Be a Part of Growing Persona Community</h2>
              <p className="h3d-trust-p">
                Join thousands of students who are building their English skills and confidence every day.
              </p>
              <a href="/login" target="_blank" rel="noopener noreferrer" className="h3d-btn h3d-btn-primary">
                Join Now <ArrowRight size={17} />
              </a>
            </div>
            <div className="h3d-trust-grid">
              {trust.map((t) => (
                <Card3D key={t.label} className="h3d-trust-tile" maxTilt={10} lift={8}>
                  <b className="c3d-z2"><CountUp value={t.n} suffix={t.suffix} /></b>
                  <small className="c3d-z1">{t.label}</small>
                </Card3D>
              ))}
            </div>
          </div>
        </Reveal3D>
      </section>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: DUR.hover, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {modal === 'checkout' && selected && (
                <>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-persona-red">
                    COURSE ENROLLMENT
                  </span>
                  <h2 className="mt-3 text-2xl font-black">{selected.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{selected.description}</p>
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <span>
                      <small className="block text-slate-500">Course price</small>
                      <b className="text-2xl">
                        {selected.priceLabel ??
                          (selected.price === 0
                            ? 'Free'
                            : `₹ ${selected.price.toLocaleString('en-IN')}`)}
                      </b>
                    </span>
                    <span className="text-right">
                      <small className="block text-slate-500">Access</small>
                      <b>{selected.duration}</b>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setModal(null);
                      navigate(
                        selected.price === 0 && !selected.priceLabel ? '/free-tests' : '/login'
                      );
                    }}
                    className="mt-4 w-full rounded-xl bg-persona-red py-3 font-bold text-white"
                  >
                    {selected.priceLabel
                      ? 'Ask About This Course'
                      : selected.price === 0
                        ? 'Start Free Test'
                        : 'Continue to Enroll'}{' '}
                    <ArrowRight className="ml-1 inline" size={16} />
                  </button>
                  <p className="mt-3 text-xs text-slate-400">Demo flow only. No payment is processed.</p>
                </>
              )}

              {(modal === 'video' || modal === 'offer') && (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-persona-red">
                    {modal === 'video' ? <Play /> : <CheckCircle2 />}
                  </span>
                  <h2 className="mt-4 text-2xl font-black">
                    {modal === 'video' ? 'Start learning today' : 'Special offer'}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {modal === 'video'
                      ? 'Choose a learning option to continue. Open the course catalogue or start a free practice test.'
                      : 'Explore available courses and contact the institute to confirm the current offer and validity.'}
                  </p>
                  <div className="mt-5 grid gap-3">
                    <button
                      onClick={() => {
                        setModal(null);
                        goCourses();
                      }}
                      className="w-full rounded-xl bg-persona-red py-3 font-bold text-white"
                    >
                      Explore Courses <ArrowRight className="ml-1 inline" size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setModal(null);
                        navigate('/free-tests');
                      }}
                      className="w-full rounded-xl border border-rose-200 py-3 font-bold text-persona-red"
                    >
                      Try a Free Test <ArrowRight className="ml-1 inline" size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
