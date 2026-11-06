'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight, Award, BookOpen, ChevronLeft, ChevronRight, Crown, FileText, Gift, Heart,
  Layers, LayoutGrid, PenLine, Play, ShieldCheck, ShoppingCart, Star, Target, TrendingUp,
  Type, Users, Zap, Quote, ShoppingBag, Sparkles, type LucideIcon,
} from 'lucide-react';
import type {
  SanityBook,
  SanityBookCategory,
  SanityBookOffer,
  SanityBookStoreSettings,
} from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';
import { EASE_OUT } from '@/lib/motion';
import { sanityFieldAttribute } from '@/lib/sanity/visual';
import { cleanSanityString } from '@/lib/sanity/client';
import CountUp from '@/components/motion/CountUp';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

type Props = {
  books: SanityBook[];
  categories: SanityBookCategory[];
  offer: SanityBookOffer;
  settings: SanityBookStoreSettings;
};

/* ───────────── helpers / static maps ───────────── */
// false = CSS placeholder covers · true = use the PNGs already in /public/images/books
const USE_LOCAL_COVERS = false;
const LOCAL_COVERS: Array<[RegExp, string]> = [
  [/combo/i, '/images/books/combo-pack.png'], [/grammar/i, '/images/books/grammar-mastery.png'],
  [/vocab/i, '/images/books/vocabulary-booster.png'], [/compre/i, '/images/books/comprehension-practice.png'],
  [/error/i, '/images/books/error-detection.png'],
];
const AVATARS = ['/images/avatars/a1.png', '/images/avatars/a2.png', '/images/avatars/a3.png', '/images/avatars/a4.png'];
const FEATURE_ICON: Record<string, LucideIcon> = {
  book: BookOpen, zap: Zap, layers: Layers, star: Star, users: Users, play: Play,
  shield: ShieldCheck, target: Target, award: Award, trending: TrendingUp, gift: Gift, cart: ShoppingCart,
};
const CAT_ICONS: Record<string, LucideIcon> = {
  grid: LayoutGrid, book: Layers, vocab: Type, practice: FileText, comprehension: BookOpen, writing: PenLine, combo: Gift,
};
const TONES: Array<[string, string, string]> = [['#6b2f9c', '#2b0f4d', '#f7c948'], ['#12356b', '#071a3d', '#f5a524'], ['#12703d', '#06391f', '#f7c948']];
const BADGE: Record<string, string> = {
  Bestseller: 'bg-gradient-to-r from-amber-300 to-amber-400 text-[#5a3b00]',
  Trending: 'bg-gradient-to-r from-rose-500 to-red-500 text-white',
  'Combo Pack': 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
  New: 'bg-emerald-500 text-white',
};
const iconOf = (key?: string, fallback: LucideIcon = BookOpen) =>
  (key && FEATURE_ICON[key]) || fallback;

/* ───────────── helpers ───────────── */
const inr = (n?: number) => (n == null ? '' : `₹${n.toLocaleString('en-IN')}`);
const off = (p?: number, o?: number) => (p && o && o > p ? `${Math.round(((o - p) / o) * 100)}% OFF` : null);

function coverSrc(b?: SanityBook): string | null {
  if (b?.cover?.asset && sanityConfigured) { try { return urlFor(b.cover).width(560).fit('max').url(); } catch { /* ignore */ } }
  if (USE_LOCAL_COVERS && b?.title) return LOCAL_COVERS.find(([re]) => re.test(b.title!))?.[1] ?? null;
  return null;
}

/** Sanity cover → (optional local PNG) → CSS placeholder. Uploading a cover in Sanity replaces the placeholder automatically. */
function Cover({ book, i = 0 }: { book?: SanityBook; i?: number }) {
  const src = coverSrc(book);
  if (src) return <img src={src} alt={book?.cover?.altText || book?.title || 'Book cover'} data-sanity={book?._id ? sanityFieldAttribute(book._id, 'book', 'cover') : undefined} className="block h-auto w-full select-none drop-shadow-[0_18px_22px_rgba(20,20,60,.35)]" draggable={false} loading="lazy" />;
  const t = book?.title || '';
  const [a, b, c] = TONES[/vocab/i.test(t) ? 0 : /grammar/i.test(t) ? 1 : /compre|error/i.test(t) ? 2 : i % 3];
  return (
    <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-[5px_10px_10px_5px] text-center text-white shadow-[inset_7px_0_9px_-5px_rgba(0,0,0,.5),0_18px_22px_-8px_rgba(20,20,60,.45)]" style={{ containerType: 'inline-size', background: `linear-gradient(160deg,${a},${b})` }}>
      <div className="flex h-full flex-col items-center justify-between p-[9%]">
        <span className="grid aspect-square w-[22%] place-items-center rounded-full border border-white/60 font-black italic" style={{ fontSize: '9cqw' }}>pi</span>
        <span className="font-extrabold leading-[1.1]" style={{ color: c, fontSize: '9.5cqw', overflowWrap: 'anywhere' }}>{t || 'Book Title'}</span>
        <span className="opacity-60" style={{ fontSize: '6cqw' }}>cover placeholder</span>
      </div>
    </div>
  );
}

const SLOTS = [[0, 32, .94], [30, 40, 1], [68, 32, .94]];

function Trio({ books }: { books: Array<SanityBook | undefined> }) {
  return (
    <div className="relative mx-auto h-full w-full">
      {SLOTS.map(([l, w, sc], k) => (
        <div key={k} className="absolute bottom-0" style={{ left: `${l}%`, width: `${w}%`, zIndex: k === 1 ? 3 : 1, transform: `scale(${sc})`, transformOrigin: 'bottom' }}>
          <Cover book={books[k]} i={k} />
        </div>
      ))}
    </div>
  );
}

function Shine() {
  return <m.span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/5 skew-x-[-20deg] bg-white/25 blur-[3px]" animate={{ x: ['-150%', '520%'] }} transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.6 }} />;
}

function Head({ eyebrow, title, right }: { eyebrow: string; title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <Reveal className="flex items-end justify-between gap-4">
      <div className="flex gap-3">
        <m.span className="mt-1 h-12 w-[5px] origin-top rounded-full bg-[#f51632]" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: .6, ease: EASE_OUT }} />
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.22em] text-[#b1173a]">{eyebrow}</p>
          <h2 className="text-[clamp(24px,3vw,32px)] font-black italic leading-tight tracking-tight text-[#0c1f4a]">{title}</h2>
        </div>
      </div>
      {right}
    </Reveal>
  );
}

/* ───────────── 3D gift box (pure CSS 3D — no WebGL / no extra deps) ───────────── */
const RED = 'linear-gradient(160deg,#ff4468,#cf0a2e)';
const RED_LID = 'linear-gradient(160deg,#ff5875,#dc1038)';
const GOLD = 'linear-gradient(90deg,#f2ae1c,#ffe9a6 50%,#f2ae1c)';
const SHADE = ['rgba(0,0,0,0)', 'rgba(0,0,0,.32)', 'rgba(0,0,0,.14)', 'rgba(0,0,0,.26)', 'rgba(255,255,255,.18)', 'rgba(0,0,0,.5)'];

function Cuboid({ w, h, d, oy = 0, base, topBg, plain }: { w: number; h: number; d: number; oy?: number; base: string; topBg?: string; plain?: boolean }) {
  const faces: Array<[number, number, string]> = [
    [w, h, `translateZ(${d / 2}px)`], [w, h, `rotateY(180deg) translateZ(${d / 2}px)`],
    [d, h, `rotateY(90deg) translateZ(${w / 2}px)`], [d, h, `rotateY(-90deg) translateZ(${w / 2}px)`],
    [w, d, `rotateX(90deg) translateZ(${h / 2}px)`], [w, d, `rotateX(-90deg) translateZ(${h / 2}px)`],
  ];
  return (
    <div style={{ position: 'absolute', width: w, height: h, left: -w / 2, top: -h / 2 + oy, transformStyle: 'preserve-3d' }}>
      {faces.map(([fw, fh, t], i) => (
        <div key={i} style={{ position: 'absolute', width: fw, height: fh, left: (w - fw) / 2, top: (h - fh) / 2, transform: t, overflow: 'hidden', backfaceVisibility: 'hidden',
          background: `linear-gradient(135deg,rgba(255,255,255,.28),transparent 55%),linear-gradient(${SHADE[i]},${SHADE[i]}),${i === 4 && topBg ? topBg : base}` }}>
          {!plain && i < 5 && <span style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: '24%', background: GOLD }} />}
          {!plain && i === 4 && <span style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: '24%', background: GOLD }} />}
        </div>
      ))}
    </div>
  );
}

function Bow({ y }: { y: number }) {
  const loop = (s: number): React.CSSProperties => ({ position: 'absolute', width: 40, height: 30, left: -20 + s * 17, top: -28, border: '7px solid #ffd45c', borderRadius: '50%', boxShadow: 'inset 0 0 7px rgba(130,70,0,.45),0 3px 5px rgba(0,0,0,.25)', transform: `rotateZ(${s * 30}deg)` });
  return (
    <div style={{ position: 'absolute', left: 0, top: y, transformStyle: 'preserve-3d' }}>
      {[0, 90].map((a) => (
        <div key={a} style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `rotateY(${a}deg)` }}>
          <span style={loop(-1)} /><span style={loop(1)} />
        </div>
      ))}
      <Cuboid w={20} h={14} d={20} oy={-4} base="linear-gradient(160deg,#ffe58f,#f0a500)" plain />
    </div>
  );
}

/** Rotating, floating gift box. The lid pops open every few seconds and sparkles fly out. */
function GiftBox3D() {
  const W = 92, H = 70, LH = 26, LW = W + 10;
  const cycle = { duration: 5.5, times: [0, .45, .58, .82, 1], repeat: Infinity, ease: 'easeInOut' as const };
  return (
    <div aria-hidden className="relative mx-auto h-[190px] w-[170px]">
      <m.span className="absolute bottom-2 left-[calc(50%-48px)] h-4 w-24 rounded-[50%] bg-black/45 blur-md" animate={{ scale: [1, .78, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <m.div className="absolute inset-0" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute left-1/2 top-[64%]" style={{ perspective: 800 }}>
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-22deg)' }}>
            <m.div style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
              <Cuboid w={W} h={H} d={W} base={RED} topBg="radial-gradient(circle,#fff6c4,#ffb703 70%)" />
              <m.div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }} animate={{ y: [0, 0, -40, -40, 0], rotateZ: [0, 0, -9, -9, 0] }} transition={cycle}>
                <Cuboid w={LW} h={LH} d={LW} oy={-(H / 2 + LH / 2) + 2} base={RED_LID} />
                <Bow y={-(H / 2 + LH) + 2} />
              </m.div>
            </m.div>
          </div>
        </div>
      </m.div>
      {[-26, -6, 14, 30, 0].map((x, i) => (
        <m.span key={i} className="absolute left-1/2 top-[30%] text-amber-200" style={{ marginLeft: x }} animate={{ y: [0, 0, -30, -56, -56], opacity: [0, 0, 1, 0, 0], scale: [.3, .3, 1.1, .5, .3] }} transition={{ ...cycle, delay: i * .05 }}>
          <Sparkles className="h-4 w-4" />
        </m.span>
      ))}
    </div>
  );
}

function Tick({ v, label }: { v: number; label: string }) {
  const t = String(v).padStart(2, '0');
  return (
    <div className="grid w-[56px] place-items-center rounded-xl bg-white py-2 text-center text-[#14214f] shadow-lg sm:w-[62px]">
      <span className="relative block h-6 w-full overflow-hidden text-xl font-black leading-6 tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span key={t} className="absolute inset-0" initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 22, opacity: 0 }} transition={{ duration: .3, ease: EASE_OUT }}>{t}</m.span>
        </AnimatePresence>
      </span>
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}

function useCountdown(end?: string, on = true) {
  const [p, setP] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!on || !end) return;
    const tick = () => {
      const x = Math.max(0, new Date(end).getTime() - Date.now());
      setP({ d: Math.floor(x / 864e5), h: Math.floor((x % 864e5) / 36e5), m: Math.floor((x % 36e5) / 6e4), s: Math.floor((x % 6e4) / 1e3) });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [end, on]);
  return p;
}

/** "Loved by Thousands" banner. Testimonials come from Sanity Book Store Settings. */
function TrustBanner({
  wrap,
  testimonials,
}: {
  wrap: string;
  testimonials: Array<{ text?: string; by?: string }>;
}) {
  const list = testimonials.length
    ? testimonials
    : [{ text: 'Persona books made English so simple and score-friendly!', by: 'A Verified Learner' }];
  const [ti, setTi] = useState(0);
  useEffect(() => {
    if (list.length < 2) return;
    const id = window.setInterval(() => setTi((i) => (i + 1) % list.length), 4800);
    return () => window.clearInterval(id);
  }, [list.length]);
  const t = list[ti] || list[0];
  const stars = (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((k) => (
        <m.span key={k} initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: .4 + k * .08, type: 'spring', stiffness: 400, damping: 14 }}>
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </m.span>
      ))}
    </div>
  );
  return (
    <section className={`${wrap} mt-10`}>
      <Reveal>
        <div className="relative grid items-center gap-7 overflow-hidden rounded-[28px] bg-[linear-gradient(110deg,#101a44,#1b2a63_60%,#2a2170)] px-6 py-8 text-white shadow-[0_28px_60px_-28px_rgba(20,33,79,.95)] md:grid-cols-[1.1fr_auto_1.2fr] md:px-10">
          <m.span aria-hidden className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#f51632]/25 blur-3xl" animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
          <m.span aria-hidden className="absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" animate={{ x: [0, -26, 0], y: [0, -18, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
          <span aria-hidden className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="relative">
            <p className="text-[11px] font-extrabold uppercase tracking-[.22em] text-rose-300">Learners’ Trust</p>
            <h3 className="mt-1 pr-2 text-[clamp(26px,3vw,36px)] font-black leading-[1.12]">
              Loved by <span className="bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text pr-1 text-transparent">Thousands</span><br />of Students
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <b className="text-3xl font-black tabular-nums"><CountUp value={4.8} decimals={1} /></b>
              <div>{stars}<span className="text-[12px] text-white/70">Average student rating</span></div>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="flex -space-x-3">
              {[...AVATARS, AVATARS[0]].map((a, i) => (
                <m.img key={i} src={a} alt="" initial={{ opacity: 0, scale: .5, x: -20 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .15 + i * .09, type: 'spring', stiffness: 260, damping: 18 }} whileHover={{ y: -6 }} className="h-14 w-14 rounded-full border-[3px] border-white object-cover shadow-lg" />
              ))}
            </div>
            <m.span className="-ml-3 grid h-14 w-14 place-items-center rounded-full border-[3px] border-white bg-[#f51632] text-[13px] font-black shadow-lg" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: .75, type: 'spring', stiffness: 300, damping: 16 }}>10k+</m.span>
          </div>

          <div className="relative rounded-2xl border border-white/15 bg-white/[.07] p-5 backdrop-blur">
            <Quote className="absolute right-4 top-3 h-9 w-9 text-[#f51632]/80" />
            {stars}
            <div className="relative mt-2 min-h-[76px]">
              <AnimatePresence mode="wait" initial={false}>
                <m.div key={ti} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .4, ease: EASE_OUT }}>
                  <p className="text-[16px] font-semibold italic leading-snug">“{t?.text}”</p>
                  <p className="mt-1.5 text-[12px] text-white/70">— {t?.by}</p>
                </m.div>
              </AnimatePresence>
            </div>
            {list.length > 1 && (
              <div className="mt-3 flex gap-1.5">
                {list.map((_, k) => <button key={k} aria-label={`Testimonial ${k + 1}`} onClick={() => setTi(k)} className={`h-1.5 rounded-full transition-all ${k === ti ? 'w-6 bg-[#f51632]' : 'w-1.5 bg-white/35'}`} />)}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────── page ───────────── */
export default function BookStoreClient({ books, categories, offer, settings }: Props) {
  const [cat, setCat] = useState('all');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<string | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const cd = useCountdown(offer.countdownEnd, offer.showCountdown !== false);

  const features = (settings.features?.length
    ? settings.features.map((f) => [iconOf(f.icon, BookOpen), f.label || ''] as [LucideIcon, string])
    : [[BookOpen, 'Exam Focused'], [Zap, 'Concept Clarity'], [Layers, 'Practice Sets'], [Star, 'Student Preferred']] as Array<[LucideIcon, string]>);

  const stats = (settings.stats?.length
    ? settings.stats.map((s) => [iconOf(s.icon, Users), s.value ?? 0, s.suffix || '', s.decimals ?? 0, s.label || ''] as [LucideIcon, number, string, number, string])
    : [
      [Users, 10000, '+', 0, 'Happy Learners'], [Play, 500, '+', 0, 'Video Lessons'], [Star, 4.8, '/5', 1, 'Student Rating'],
      [Layers, 25000, '+', 0, 'Vocabulary Words'], [ShieldCheck, 100, '%', 0, 'Exam Focused'],
    ] as Array<[LucideIcon, number, string, number, string]>);

  const whyItems = (settings.whyItems?.length
    ? settings.whyItems.map((w) => [iconOf(w.icon, Target), w.title || '', w.description || ''] as [LucideIcon, string, string])
    : [
      [Target, 'By Ajay Sir', 'Curated by Ajay Singh Rajput (Ajay Sir)'], [Award, 'Exam Oriented', 'Syllabus-based and completely practical'],
      [BookOpen, 'Concept + Practice', 'Complete learning with examples & sets'], [TrendingUp, 'Proven Results', 'Trusted by 10,000+ learners across India'],
    ] as Array<[LucideIcon, string, string]>);

  const savings =
    offer.savingsText ||
    (offer.price && offer.oldPrice && offer.oldPrice > offer.price
      ? `Save ₹${(offer.oldPrice - offer.price).toLocaleString('en-IN')}`
      : null);

  const offerTrioBooks: Array<SanityBook | undefined> = (() => {
    if (offer.includedBooks?.length) {
      return [0, 1, 2].map((i) => offer.includedBooks?.[i] as SanityBook | undefined);
    }
    return undefined as unknown as Array<SanityBook | undefined>;
  })();

  // hero mouse-parallax
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 }), sy = useSpring(my, { stiffness: 120, damping: 20 });
  const rotY = useTransform(sx, [-.5, .5], [-9, 9]), rotX = useTransform(sy, [-.5, .5], [6, -6]);

  const cats = useMemo(() => (categories.some((c) => c.slug?.current === 'all') ? categories : [{ _id: 'all', title: 'All Books', slug: { current: 'all' }, subtitle: 'Explore Complete Collection', icon: 'grid' }, ...categories]), [categories]);
  const featured = useMemo(() => { const f = books.filter((b) => b.featured); return (f.length ? f : books).slice(0, 8); }, [books]);
  const list = useMemo(() => {
    if (cat === 'all') return featured;
    return books.filter((b) => { const s = b.category?.slug?.current || ''; return cat === 'combo' ? b.isCombo || s === 'combo' : s === cat; });
  }, [cat, books, featured]);
  const hero = useMemo(() => { const h = books.filter((b) => b.heroFeatured); const p = h.length >= 3 ? h : books; return [p[1], p[0], p[2]] as Array<SanityBook | undefined>; }, [books]);

  const toggleLike = (id: string) => setLiked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const wrap = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6';
  const btnRed = 'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#ff3355] to-[#e30f2f] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_24px_-8px_rgba(245,22,50,.65)]';

  return (
    <main data-pm-skip className="relative overflow-x-clip bg-[linear-gradient(180deg,#ffe6ec_0,#fff3f6_420px,#fff_800px)] pb-16 text-slate-900">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5); }}>
        <m.div aria-hidden className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-rose-300/40 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 24, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <m.div aria-hidden className="absolute -left-24 top-40 h-[300px] w-[300px] rounded-full bg-pink-200/50 blur-3xl" animate={{ x: [0, 26, 0], y: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
        <div className={`${wrap} relative grid items-center gap-6 pb-10 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-12`}>
          <div>
            <m.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: EASE_OUT }} className="inline-flex items-center gap-2 rounded-full bg-[#ffd9e0] px-3.5 py-1.5 text-[13px] font-bold text-[#d6123a]">
              <ShoppingCart className="h-4 w-4" /> {settings.heroEyebrow || 'Official Book Store'}
            </m.span>
            <h1 className="mt-5 whitespace-nowrap text-[clamp(32px,4.2vw,56px)] font-black italic leading-[1.1] tracking-tight">
              {(settings.heroTitleLine1 || 'Persona Institute').split(/\s+/).map((w, i) => (
                <m.span key={`${w}-${i}`} className="mr-[.26em] inline-block pr-[.1em] text-[#0c1f4a]" initial={{ opacity: 0, y: 38, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .8, ease: EASE_OUT, delay: .1 + i * .12 }}>{w}</m.span>
              ))}
              <br />
              <m.span className="inline-block bg-gradient-to-r from-[#ff2547] to-[#e30f2f] bg-clip-text pb-[.1em] pr-[.18em] text-transparent" initial={{ opacity: 0, y: 38, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .8, ease: EASE_OUT, delay: .38 }}>{settings.heroTitleAccent || 'Book Store'}</m.span>
            </h1>
            <m.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .6, ease: EASE_OUT }} className="mt-5 max-w-[470px] text-[17px] leading-relaxed text-[#0c1f4a]">
              {settings.heroSubtitle || 'Ajay Singh Rajput (Ajay Sir) की trusted books for English preparation — Concept, Practice & Exams.'}
            </m.p>
            <Stagger className="mt-6 flex flex-wrap gap-x-3 gap-y-4 lg:flex-nowrap" delay={.6}>
              {features.map(([Ic, l]) => (
                <StaggerItem key={l} className="flex items-center gap-2.5">
                  <m.span whileHover={{ rotate: -10, scale: 1.12 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#f51632] shadow-[0_6px_16px_-6px_rgba(245,22,50,.4)] ring-1 ring-rose-100"><Ic className="h-5 w-5" /></m.span>
                  <span className="max-w-[64px] text-[12px] font-semibold leading-tight text-[#0c1f4a]">{l}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={.8} className="mt-7 flex flex-wrap gap-3">
              <m.a href="#featured" whileHover={{ y: -3 }} whileTap={{ scale: .97 }} className={btnRed}><Shine />{settings.exploreCtaLabel || 'Explore Books'} <ArrowRight className="h-4 w-4" /></m.a>
              <m.a href="#offer" whileHover={{ y: -3 }} whileTap={{ scale: .97 }} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-6 py-3.5 text-[15px] font-bold text-[#e30f2f] shadow-sm"><Gift className="h-4 w-4" /> {settings.comboCtaLabel || 'View Combos'}</m.a>
            </Reveal>
            <Reveal delay={.95} className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-3">{AVATARS.map((a, i) => <m.img key={i} src={a} alt="" whileHover={{ y: -4, zIndex: 5 }} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow" />)}</div>
              <p className="text-[13px] text-slate-600"><b className="block text-[#e30f2f]">10,000+ Students</b>are already studying with Persona Books</p>
            </Reveal>
          </div>

          {/* Official branded book display — shared with the homepage book-store feature. */}
          <m.div
            className="relative mx-auto w-full max-w-[650px] overflow-hidden rounded-[28px] border border-white/80 bg-white/45 shadow-[0_24px_60px_-24px_rgba(91,45,110,.35)]"
            initial={{ opacity: 0, y: 28, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .8, ease: EASE_OUT, delay: .18 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <img
              src="/images/persona-books-display.png"
              alt="Persona Institute books: Spoken English Practice Book, English Grammar and Vocabulary Booster, with the official Persona Institute logo on the mug"
              className="block h-auto w-full object-contain"
              loading="eager"
            />
          </m.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div className={wrap}>
        <Stagger className="grid grid-cols-2 gap-y-5 rounded-[22px] bg-white/90 px-3 py-5 shadow-[0_18px_45px_-20px_rgba(15,39,79,.25)] ring-1 ring-rose-50 backdrop-blur sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-rose-100">
          {stats.map(([Ic, v, suf, dec, l]) => (
            <StaggerItem key={l} className="flex items-center justify-center gap-3 px-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-[#f51632]"><Ic className="h-6 w-6" /></span>
              <div><b className="block text-[22px] font-extrabold leading-none text-[#0c1f4a]"><CountUp value={v} suffix={suf} decimals={dec} /></b><span className="text-[12px] text-slate-500">{l}</span></div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* ─── CATEGORIES ─── */}
      <section className={`${wrap} mt-14`}>
        <Head eyebrow={settings.categoriesEyebrow || 'Browse by category'} title={settings.categoriesTitle || 'Find the Right Book for You'} right={<a href="#featured" onClick={() => setCat('all')} className="hidden items-center gap-1 text-[13px] font-bold text-[#e30f2f] sm:flex">View All Categories <ArrowRight className="h-4 w-4" /></a>} />
        <Stagger className="mt-6 flex gap-3 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:overflow-visible" stagger={.06}>
          {cats.map((c) => {
            const slug = c.slug?.current || 'all', Ic = CAT_ICONS[c.icon || 'book'] || Layers, on = cat === slug;
            return (
              <StaggerItem key={c._id} className="min-w-[138px] lg:min-w-0">
                <m.button onClick={() => setCat(slug)} whileHover={{ y: -5 }} whileTap={{ scale: .96 }} className={`relative h-full w-full overflow-hidden rounded-2xl px-2 py-4 text-center ring-1 transition-shadow ${on ? 'text-white shadow-[0_16px_28px_-10px_rgba(245,22,50,.6)] ring-transparent' : 'bg-white text-[#0c1f4a] shadow-[0_8px_22px_-12px_rgba(15,39,79,.25)] ring-rose-50 hover:shadow-[0_14px_28px_-12px_rgba(245,22,50,.3)]'}`}>
                  {on && <m.span layoutId="cat-bg" className="absolute inset-0 bg-gradient-to-br from-[#ff5f7b] to-[#ef1239]" transition={{ type: 'spring', stiffness: 320, damping: 32 }} />}
                  <span className="relative block">
                    <m.span className="mx-auto block w-fit" whileHover={{ rotate: [0, -12, 10, 0] }} transition={{ duration: .5 }}><Ic className="h-6 w-6" /></m.span>
                    <b className="mt-2 block text-[13px] font-extrabold">{c.title}</b>
                    <span className={`mt-0.5 block text-[10.5px] leading-tight ${on ? 'text-white/85' : 'text-slate-500'}`}>{c.subtitle}</span>
                  </span>
                </m.button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ─── FEATURED ─── */}
      <section id="featured" className={`${wrap} mt-12 scroll-mt-24`}>
        <Head eyebrow={settings.featuredEyebrow || 'Featured books'} title={settings.featuredTitle || 'Most Popular Books'} right={
          <div className="flex gap-2">{[-1, 1].map((d) => (
            <m.button key={d} aria-label={d < 0 ? 'Previous' : 'Next'} whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} onClick={() => row.current?.scrollBy({ left: d * 260, behavior: 'smooth' })} className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0c1f4a] shadow-md ring-1 ring-rose-100">{d < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</m.button>
          ))}</div>
        } />
        <p className="ml-4 mt-1 text-[14px] text-slate-600">Trusted by thousands of learners for English mastery.</p>
        <div ref={row} className="-mx-2 mt-5 overflow-x-auto px-2 pb-8 pt-2 [scrollbar-width:none] snap-x snap-mandatory">
          {list.length === 0 && <p className="py-10 text-center text-slate-500">No books in this category yet.</p>}
          <Stagger key={cat} className="grid grid-flow-col auto-cols-[218px] gap-4 lg:auto-cols-[calc((100%-4rem)/5)]" stagger={.08}>
            {list.map((b, i) => {
              const d = off(b.price, b.oldPrice), isLiked = liked.has(b._id), done = added === b._id, buyUrl = cleanSanityString(b.buyUrl);
              return (
                <StaggerItem key={b._id} className="snap-start h-full">
                  <m.article whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="group relative flex h-full min-h-[445px] flex-col rounded-[20px] bg-white p-3 pb-4 shadow-[0_14px_34px_-16px_rgba(15,39,79,.3)] ring-1 ring-rose-50" data-sanity-edit-target>
                    {b.badge && <span className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${BADGE[b.badge] || BADGE.New}`}>{b.badge === 'Bestseller' && <Crown className="h-3 w-3" />}{b.badge}</span>}
                    <m.button aria-label="Wishlist" whileTap={{ scale: .75 }} onClick={() => toggleLike(b._id)} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-rose-100">
                      <m.span key={String(isLiked)} initial={{ scale: .5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}><Heart className={`h-4 w-4 ${isLiked ? 'fill-[#f51632] text-[#f51632]' : 'text-[#f51632]'}`} /></m.span>
                    </m.button>
                    <div className="flex h-[196px] items-end justify-center pb-2 pt-9 [perspective:800px]">
                      <m.div className={b.isCombo && !coverSrc(b) ? 'h-[132px] w-[92%]' : 'w-[54%]'} whileHover={{ rotateY: -14, scale: 1.07 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
                        {b.isCombo && !coverSrc(b) ? (
                          <Trio books={(b.comboBooks?.length ? b.comboBooks : offer.includedBooks || []) as Array<SanityBook | undefined>} />
                        ) : (
                          <Cover book={b} i={i} />
                        )}
                      </m.div>
                    </div>
                    <h3 className="mt-2 min-h-[34px] line-clamp-2 text-[14px] font-extrabold leading-tight text-[#0c1f4a]">{b.title}</h3>
                    <p className="mt-1 min-h-[30px] line-clamp-2 text-[10px] leading-[15px] text-slate-500">{b.shortDescription || (b.isCombo ? b.comboLabel : '') || '\u00a0'}</p>
                    <div className="mt-1.5 flex h-[18px] items-center gap-1.5 text-[12px]"><span className="flex">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span><b className="text-[#0c1f4a]">{b.rating?.toFixed(1)}</b><span className="text-slate-400">({(b.reviewCount ?? 0).toLocaleString('en-IN')})</span></div>
                    <div className="mt-2 flex min-h-[28px] flex-wrap items-center gap-1.5"><b className="text-[17px] font-black text-[#0c1f4a]">{inr(b.price)}</b>{b.oldPrice && <s className="text-[12px] text-slate-400">{inr(b.oldPrice)}</s>}{d && <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-600">{d}</span>}</div>
                    <m.a href={buyUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (!buyUrl) { e.preventDefault(); setAdded(b._id); window.setTimeout(() => setAdded(null), 1800); } }} whileHover={{ y: -2 }} whileTap={{ scale: .95 }} className={`relative mt-auto flex h-12 min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-3 text-[13px] font-bold leading-none text-white transition-colors ${done ? 'bg-slate-500' : 'bg-gradient-to-b from-[#ff3355] to-[#e30f2f] shadow-[0_10px_20px_-10px_rgba(245,22,50,.7)]'}`}>
                      <AnimatePresence mode="wait" initial={false}>
                        <m.span key={String(done)} className="flex items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: .18 }}>
                          {done ? 'Link coming soon' : <><ShoppingBag className="h-4 w-4" /> Buy Now</>}
                        </m.span>
                      </AnimatePresence>
                    </m.a>
                  </m.article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ─── OFFER / COMBO BANNER (fully Sanity-driven) ─── */}
      <section id="offer" className={`${wrap} scroll-mt-24`}>
        <Reveal>
          <div className="relative grid items-center gap-4 overflow-hidden rounded-[28px] bg-[linear-gradient(100deg,#1a1347_0,#3b1767_55%,#7b1d6d_100%)] px-6 py-8 text-white shadow-[0_28px_60px_-28px_rgba(40,10,80,.8)] md:grid-cols-[170px_1fr_300px] md:px-10">
            {[8, 22, 40, 63, 78, 91].map((l, i) => <m.span key={i} aria-hidden className="absolute h-1.5 w-1.5 rounded-full bg-amber-300" style={{ left: `${l}%`, top: `${(i * 37) % 80 + 8}%` }} animate={{ opacity: [0, 1, 0], scale: [.5, 1.4, .5] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * .45 }} />)}
            <GiftBox3D />
            <div className="relative">
              <span className="inline-block rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-3 py-1 text-[11px] font-bold">{offer.badge || 'Limited Time Offer'}</span>
              <h3 className="mt-2 pb-1 pr-3 text-[clamp(28px,3.4vw,40px)] font-black italic leading-[1.15]">
                {(offer.title || 'Book Combo – Save More!').split(/[–-]/)[0]}–{' '}
                <span className="text-[#ff3b5c]">
                  {(offer.title || 'Book Combo – Save More!').split(/[–-]/).slice(1).join('–').trim() || 'Save More!'}
                </span>
              </h3>
              <p className="mt-1 text-[14px] text-white/80">{offer.subtitle}</p>
              {offer.comboLabel && (
                <p className="mt-1 text-[12px] font-semibold text-amber-200/90">{offer.comboLabel}</p>
              )}
              {!!offer.highlights?.length && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {offer.highlights.map((h) => (
                    <li key={h} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 ring-1 ring-white/15">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {(offer.price != null || savings) && (
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  {offer.price != null && <b className="text-2xl font-black tabular-nums">{inr(offer.price)}</b>}
                  {offer.oldPrice != null && <s className="text-[14px] text-white/50">{inr(offer.oldPrice)}</s>}
                  {savings && <span className="rounded-md bg-emerald-400/20 px-2 py-0.5 text-[12px] font-extrabold text-emerald-300">{savings}</span>}
                  {offer.priceNote && <span className="w-full text-[11px] text-white/55">{offer.priceNote}</span>}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {offer.showCountdown !== false && (
                  <div className="flex gap-2">
                    <Tick v={cd.d} label="Days" />
                    <Tick v={cd.h} label="Hours" />
                    <Tick v={cd.m} label="Minutes" />
                    <Tick v={cd.s} label="Seconds" />
                  </div>
                )}
                <m.a href={cleanSanityString(offer.ctaLink) || '#featured'} whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: .97 }} className={btnRed}>
                  <Shine />{offer.ctaLabel || 'Grab the Combo'} <ArrowRight className="h-4 w-4" />
                </m.a>
                {offer.secondaryCtaLabel && (
                  <m.a href={cleanSanityString(offer.secondaryCtaLink) || '#featured'} whileHover={{ y: -2 }} className="text-[13px] font-bold text-white/85 underline-offset-4 hover:underline">
                    {offer.secondaryCtaLabel}
                  </m.a>
                )}
              </div>
            </div>
            <div className="relative mx-auto hidden h-[190px] w-full md:block">
              <div className="absolute inset-x-0 bottom-0 h-10 rounded-[50%] bg-white/10 ring-1 ring-white/20" />
              <m.div className="absolute inset-x-2 bottom-3 top-0" animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                <Trio books={(offerTrioBooks?.[0] ? offerTrioBooks : hero) as Array<SanityBook | undefined>} />
              </m.div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── WHY ─── */}
      <section className={`${wrap} mt-14`}>
        <Head
          eyebrow={settings.whyEyebrow || 'Why choose Persona Books?'}
          title={settings.whyTitle || 'Designed for Real Learning & Exam Success'}
        />
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map(([Ic, t, d]) => (
            <StaggerItem key={t}>
              <m.div whileHover={{ y: -6 }} className="flex h-full items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_10px_28px_-16px_rgba(15,39,79,.3)] ring-1 ring-rose-50">
                <m.span whileHover={{ rotate: 12, scale: 1.1 }} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-rose-100 text-[#f51632]"><Ic className="h-7 w-7" /></m.span>
                <div><b className="block text-[14px] font-extrabold text-[#0c1f4a]">{t}</b><span className="text-[12px] leading-snug text-slate-500">{d}</span></div>
              </m.div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <TrustBanner wrap={wrap} testimonials={settings.testimonials || []} />
    </main>
  );
}
