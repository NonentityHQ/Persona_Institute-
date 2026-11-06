'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const VIDEO_ID = 'd3UyoUsg-08';
const VIDEO_THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

/**
 * Muted autoplay is the most broadly permitted autoplay mode across browsers.
 * The YouTube player remains visible with native controls; the thumbnail is
 * shown as a fallback/background while the iframe initializes.
 */
export default function HeroVideo() {
  const [loaded, setLoaded] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  return (
    <div className="h3d-video-player relative">
      {!loaded && (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={thumbnailFailed
            ? `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`
            : VIDEO_THUMBNAIL}
          alt="Persona Institute introduction video thumbnail"
          onError={() => setThumbnailFailed(true)}
        />
      )}
      <iframe
        className="h3d-video relative z-[1] h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
        title="Persona Institute introduction with Ajay Sir"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="eager"
        onLoad={() => setLoaded(true)}
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
