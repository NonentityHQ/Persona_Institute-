'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const VIDEO_ID = 'd3UyoUsg-08';
const VIDEO_THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const VIDEO_THUMBNAIL_FALLBACK = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

/** Keep the official YouTube thumbnail visible while the muted autoplay player initializes. */
export default function HeroVideo() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  return (
    <div className="h3d-video-player relative">
      {!iframeLoaded && (
        <Image
          src={thumbnailFailed ? VIDEO_THUMBNAIL_FALLBACK : VIDEO_THUMBNAIL}
          alt="Persona Institute introduction video with Ajay Sir"
          fill
          priority
          sizes="(max-width: 768px) 94vw, 52vw"
          quality={80}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onError={() => setThumbnailFailed(true)}
        />
      )}
      <iframe
        className="h3d-video relative z-[1] h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
        title="Persona Institute introduction with Ajay Sir"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="eager"
        onLoad={() => setIframeLoaded(true)}
      />
      <a
        className="h3d-video-fallback"
        href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open introduction video on YouTube"
      >
        <ExternalLink size={14} /> YouTube
      </a>
    </div>
  );
}
