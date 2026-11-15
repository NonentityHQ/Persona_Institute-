'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const DEFAULT_VIDEO_ID = 'd3UyoUsg-08';

function extractYoutubeId(value?: string): string {
  if (!value) return DEFAULT_VIDEO_ID;
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || DEFAULT_VIDEO_ID;
    const queryId = url.searchParams.get('v');
    if (queryId) return queryId;
    const parts = url.pathname.split('/').filter(Boolean);
    if (['embed', 'shorts', 'live'].includes(parts[0]) && parts[1]) return parts[1];
  } catch {
    // Invalid CMS URL: retain the existing introduction video.
  }
  return DEFAULT_VIDEO_ID;
}

type Props = { videoUrl?: string };

/** Editable from Sanity > Site Settings > Hero. */
export default function HeroVideo({ videoUrl }: Props) {
  const videoId = useMemo(() => extractYoutubeId(videoUrl), [videoUrl]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/${thumbnailFailed ? 'hqdefault' : 'maxresdefault'}.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="h3d-video-player relative">
      {!iframeLoaded && (
        <Image
          src={thumbnail}
          alt="Persona Institute introduction video"
          fill
          priority
          sizes="(max-width: 768px) 94vw, 52vw"
          quality={80}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onError={() => setThumbnailFailed(true)}
        />
      )}
      <iframe
        key={videoId}
        className="h3d-video relative z-[1] h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
        title="Persona Institute introduction video"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="eager"
        onLoad={() => setIframeLoaded(true)}
      />
      <a className="h3d-video-fallback" href={watchUrl} target="_blank" rel="noopener noreferrer" aria-label="Open introduction video on YouTube">
        <ExternalLink size={14} /> YouTube
      </a>
    </div>
  );
}
