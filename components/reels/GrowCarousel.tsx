'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';
import type { SanityReel } from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';

const FALLBACKS = [
  '/images/course-live-spoken.jpg',
  '/images/course-recorded.jpg',
  '/images/course-grammar-booster.jpg',
  '/images/course-winter-special.jpg',
  '/images/course-persona.jpg',
  '/images/course-khushi.jpg',
];

type Props = {
  reels: SanityReel[];
  className?: string;
  instagramUrl?: string;
  /** Full loop duration in seconds (lower = faster). Default 32 */
  speedSeconds?: number;
};

/**
 * Premium rolling Instagram Reels.
 * Desktop: continuous marquee (hover to pause).
 * Mobile: native horizontal scroll + snap — swipe to slide. No arrow buttons.
 */
export default function GrowCarousel({
  reels,
  className = '',
  instagramUrl = 'https://www.instagram.com/',
  speedSeconds = 32,
}: Props) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 767px)');
    const update = () => setIsCoarse(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const id = 'reels-marquee-keyframes-v3';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes reels-marquee-x-v3 {
        0% { transform: translate3d(0,0,0); }
        100% { transform: translate3d(-50%,0,0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const getThumb = useCallback((reel: SanityReel, i: number) => {
    if (reel.thumbnail?.asset && sanityConfigured) {
      try {
        return urlFor(reel.thumbnail).width(600).height(1066).fit('crop').url();
      } catch {
        /* */
      }
    }
    return FALLBACKS[i % FALLBACKS.length];
  }, []);

  if (!reels.length) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-16 text-center text-sm text-slate-500">
        No reels yet. Add <strong>Instagram Reel</strong> in Sanity (title + thumbnail + link).
      </div>
    );
  }

  const loop = [...reels, ...reels];
  // Marquee only on fine pointer / desktop; mobile uses swipe scroll
  const shouldAnimate = !reduceMotion && !isCoarse && reels.length >= 2;

  const renderCard = (reel: SanityReel, i: number, key: string) => {
    const base = i % reels.length;
    const thumb = getThumb(reel, base);
    const href = reel.instagramUrl || reel.videoUrl || instagramUrl;

    return (
      <a
        key={key}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-[170px] shrink-0 snap-start sm:w-[190px] md:w-[210px]"
      >
        <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-rose-400/0 to-fuchsia-400/0 opacity-0 blur transition duration-500 group-hover:from-rose-400/35 group-hover:to-fuchsia-400/25 group-hover:opacity-100" />

        <div className="relative overflow-hidden rounded-[1.55rem] bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_55px_rgba(15,23,42,0.26)]">
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-[18px] w-22 -translate-x-1/2 rounded-b-2xl bg-slate-950" />

          <div className="relative aspect-[9/16] w-full">
            <Image
              src={thumb}
              alt={reel.title || 'Reel'}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              sizes="210px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20" />

            <span className="absolute left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#e1306c] shadow">
              <Instagram size={14} />
            </span>
            {reel.duration && (
              <span className="absolute right-3 top-3 z-10 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {reel.duration}
              </span>
            )}

            <span className="absolute inset-0 z-10 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:border-transparent group-hover:bg-persona-red">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </span>
            </span>

            <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
              {reel.category && (
                <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {reel.category}
                </span>
              )}
              <p className="mt-1 line-clamp-2 text-[13px] font-bold leading-snug text-white">
                {reel.title}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-persona-red">
            <Instagram size={14} /> Instagram
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Latest Reels
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Short lessons, classroom energy and student wins
            {isCoarse ? ' — swipe to explore.' : ' — auto-rolling feed.'}
          </p>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-200/50"
        >
          <Instagram size={14} /> Follow us
        </a>
      </div>

      {/* Mobile / touch: native horizontal scroll + snap */}
      {isCoarse ? (
        <div
          ref={trackRef}
          className="relative -mx-1 overflow-x-auto overscroll-x-contain px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex snap-x snap-mandatory gap-4 py-2 pl-1 pr-6">
            {reels.map((reel, i) => renderCard(reel, i, reel._id))}
          </div>
        </div>
      ) : (
        /* Desktop: CSS marquee */
        <div
          className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-slate-50 via-white to-white p-4 ring-1 ring-slate-100/80 sm:p-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />

          <div
            className="flex gap-5 py-2 will-change-transform"
            style={{
              width: 'max-content',
              ...(shouldAnimate
                ? {
                    animationName: 'reels-marquee-x-v3',
                    animationDuration: `${speedSeconds}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: paused ? 'paused' : 'running',
                  }
                : {}),
            }}
          >
            {loop.map((reel, i) => renderCard(reel, i, `${reel._id}-${i}`))}
          </div>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-400">
        {isCoarse ? 'Swipe sideways · Tap opens Instagram' : 'Auto-rolling · Hover to pause · Click opens Instagram'}
      </p>
    </div>
  );
}
