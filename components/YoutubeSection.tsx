'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Youtube } from 'lucide-react';
import type { SanityYoutubeVideo } from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';

function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace(/^\//, '') || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'embed' && parts[1]) return parts[1];
    if (parts[0] === 'shorts' && parts[1]) return parts[1];
  } catch {
    /* ignore */
  }
  return null;
}

function thumbFor(video: SanityYoutubeVideo, index: number): string {
  if (video.thumbnail?.asset && sanityConfigured) {
    try {
      return urlFor(video.thumbnail).width(720).height(405).fit('crop').url();
    } catch {
      /* */
    }
  }
  const id = extractYoutubeId(video.youtubeUrl);
  if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const fallbacks = [
    '/images/course-live-spoken.jpg',
    '/images/course-recorded.jpg',
    '/images/course-grammar-booster.jpg',
    '/images/course-winter-special.jpg',
  ];
  return fallbacks[index % fallbacks.length];
}

type Props = {
  videos: SanityYoutubeVideo[];
  title?: string;
  kicker?: string;
  subtitle?: string;
  channelUrl?: string;
};

/**
 * Template YouTube strip — all fields from Sanity:
 * title, youtubeUrl, custom thumbnail, duration, category.
 */
export default function YoutubeSection({
  videos,
  title = 'YouTube Videos',
  kicker = 'Watch & Learn',
  subtitle = 'Free lessons, class highlights and student journeys.',
  channelUrl,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const list = useMemo(() => videos.filter((v) => v.active !== false), [videos]);

  const scrollBy = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  if (!list.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0b1220] py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-5 lg:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
              <Youtube size={14} className="text-red-500" /> {kicker}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-2 max-w-lg text-sm text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {channelUrl && (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 sm:inline-flex"
              >
                <Youtube size={14} /> Visit channel
              </a>
            )}
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {list.map((video, index) => {
            const ytId = extractYoutubeId(video.youtubeUrl);
            const isPlaying = playingId === video._id && Boolean(ytId);

            return (
              <article
                key={video._id}
                className="group relative w-[min(88vw,340px)] shrink-0 snap-start"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 transition hover:border-white/20">
                  <div className="relative aspect-video bg-black">
                    {isPlaying && ytId ? (
                      <iframe
                        title={video.title || 'YouTube'}
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <Image
                          src={thumbFor(video, index)}
                          alt={video.title || 'Video'}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="340px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                        <button
                          type="button"
                          onClick={() => {
                            if (ytId) setPlayingId(video._id);
                            else if (video.youtubeUrl) window.open(video.youtubeUrl, '_blank');
                          }}
                          className="absolute inset-0 grid place-items-center"
                          aria-label={`Play ${video.title || 'video'}`}
                        >
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40 transition group-hover:scale-110">
                            <Play size={22} fill="currentColor" className="ml-0.5" />
                          </span>
                        </button>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-white">
                            {video.duration}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    {video.category && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        {video.category}
                      </p>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-white">
                      {video.title}
                    </h3>
                    {video.youtubeUrl && !isPlaying && (
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Open on YouTube →
                      </a>
                    )}
                    {!video.youtubeUrl && (
                      <p className="mt-2 text-[11px] text-slate-500">Add YouTube URL in Sanity</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
