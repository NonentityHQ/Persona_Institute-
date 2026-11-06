'use client';

import { cleanSanityString } from '@/lib/sanity/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import type { SanityReel } from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';

const FALLBACKS = [
  '/images/course-live-spoken.jpg',
  '/images/course-recorded.jpg',
  '/images/course-grammar-booster.jpg',
  '/images/course-winter-special.jpg',
  '/images/course-persona.jpg',
  '/images/english-with-khushi-logo.png',
];

type Props = {
  reels: SanityReel[];
  className?: string;
  instagramUrl?: string;
  /** Full loop duration in seconds (lower = faster). Default 36 */
  speedSeconds?: number;
};

/**
 * Premium Instagram Reels strip.
 * - Continuous auto-scroll when idle (scrollLeft based so it shares the same axis as drag)
 * - Manual drag / swipe / click-and-drag always available
 * - Hover / touch pauses auto-scroll
 * - No play-button overlay — card opens Instagram on tap
 */
export default function GrowCarousel({
  reels,
  className = '',
  instagramUrl = 'https://www.instagram.com/',
  speedSeconds = 36,
}: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef(0);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    pointerId: -1,
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
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

  const clearResume = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  const scheduleResume = (ms = 2600) => {
    clearResume();
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimer.current = null;
    }, ms);
  };

  /* Auto-scroll via requestAnimationFrame — same axis as manual drag */
  useEffect(() => {
    if (reduceMotion || reels.length < 2) return;

    const tick = (ts: number) => {
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (vp && track && !pausedRef.current && !drag.current.active) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          // pixels per second so full loop ≈ speedSeconds
          const pxPerSec = half / speedSeconds;
          const dt = lastTs.current ? Math.min(48, ts - lastTs.current) / 1000 : 0;
          lastTs.current = ts;
          let next = vp.scrollLeft + pxPerSec * dt;
          if (next >= half) next -= half;
          vp.scrollLeft = next;
        }
      } else {
        lastTs.current = ts;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = 0;
    };
  }, [reduceMotion, reels.length, speedSeconds]);

  const onPointerDown = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: vp.scrollLeft,
      moved: false,
      pointerId: e.pointerId,
    };
    pausedRef.current = true;
    clearResume();
    try {
      vp.setPointerCapture(e.pointerId);
    } catch {
      /* */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    vp.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const vp = viewportRef.current;
    try {
      vp?.releasePointerCapture(drag.current.pointerId);
    } catch {
      /* */
    }
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    scheduleResume(2800);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  if (!reels.length) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-orange-50 px-6 py-10 text-center">
        <Instagram className="mx-auto h-8 w-8 text-[#dd2a7b]" />
        <h3 className="mt-3 text-lg font-extrabold text-slate-900">Latest Reels from Persona</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Watch the newest public reels on our official Instagram account.</p>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-2.5 text-sm font-bold text-white shadow-md">
          <Instagram size={16} /> View latest Instagram Reels
        </a>
      </div>
    );
  }

  // Double the list so seamless loop works with scrollLeft
  const loop = [...reels, ...reels];

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
            Short lessons, classroom energy and student wins — auto-scroll or drag to explore.
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

      <div
        className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-slate-50 via-white to-white p-3 ring-1 ring-slate-100/80 sm:p-6"
        onMouseEnter={() => {
          pausedRef.current = true;
          clearResume();
        }}
        onMouseLeave={() => scheduleResume(700)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-slate-50 to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-white to-transparent sm:w-16" />

        <div
          ref={viewportRef}
          className="scrollbar-hide relative overflow-x-auto overflow-y-hidden overscroll-x-contain select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
            touchAction: 'pan-y',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <div
            ref={trackRef}
            className="flex gap-4 py-2 sm:gap-5"
            style={{ width: 'max-content' }}
          >
            {loop.map((reel, i) => {
              const base = i % reels.length;
              const thumb = getThumb(reel, base);
              const href = cleanSanityString(reel.instagramUrl) || cleanSanityString(reel.videoUrl) || instagramUrl;

              return (
                <a
                  key={`${reel._id}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-[160px] shrink-0 sm:w-[190px] md:w-[210px]"
                  draggable={false}
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
                        draggable={false}
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

                      {/* Play button removed — entire card opens Instagram */}

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
            })}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Auto-scroll · Drag or swipe to browse · Tap opens Instagram
      </p>
    </div>
  );
}
