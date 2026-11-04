'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { m as motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { SanityOffer } from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';


type Props = {
  offer: SanityOffer;
  onCta?: () => void;
};

function useCountdown(endIso?: string, enabled = true) {
  const [parts, setParts] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!enabled || !endIso) return;
    const end = new Date(endIso).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setParts({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endIso, enabled]);

  return parts;
}

const bgMap = {
  peach: 'from-[#fff5eb] via-[#ffe8d4] to-[#ffd4b8]',
  rose: 'from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
  cream: 'from-[#fffbeb] via-[#fef3c7] to-[#fde68a]',
};

export default function OfferBanner({ offer, onCta }: Props) {
  const countdown = useCountdown(offer.countdownEnd, offer.showCountdown !== false);
  const bg = bgMap[offer.backgroundStyle || 'peach'] || bgMap.peach;

  let imageSrc: string | null = null;
  if (offer.image?.asset && sanityConfigured) {
    try {
      imageSrc = urlFor(offer.image).width(400).height(400).fit('crop').url();
    } catch {
      imageSrc = null;
    }
  }

  const handleCta = () => {
    if (offer.ctaLink) {
      if (offer.ctaLink.startsWith('http')) window.open(offer.ctaLink, '_blank');
      else window.location.href = offer.ctaLink;
      return;
    }
    onCta?.();
  };

  // Split subtitle to highlight priceText if present
  const renderSubtitle = () => {
    if (!offer.subtitle) return null;
    if (offer.priceText && offer.subtitle.includes(offer.priceText)) {
      const [before, after] = offer.subtitle.split(offer.priceText);
      return (
        <p className="mt-2 text-sm">
          {before}
          <b className="text-persona-red">{offer.priceText}</b>
          {after}
        </p>
      );
    }
    return (
      <p className="mt-2 text-sm">
        {offer.subtitle}
        {offer.priceText && (
          <>
            {' '}
            <b className="text-persona-red">{offer.priceText}</b>
          </>
        )}
      </p>
    );
  };

  return (
    <section className="section-wrap pt-5">
      <motion.div
        className={`offer-banner relative grid items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r ${bg} px-6 py-7 md:grid-cols-[.65fr_1.6fr] md:px-10`}
      >
        {/* Left gift / image */}
        <div className="relative z-10 hidden md:block">
          {imageSrc ? (
            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl shadow-lg">
              <Image src={imageSrc} alt="" fill className="object-cover" sizes="144px" />
            </div>
          ) : (
            <div className="gift-box">
              <span>🎁</span>
            </div>
          )}
        </div>

        <div className="relative z-10">
          {offer.badge && (
            <span className="rounded-full bg-persona-red px-3 py-1 text-[11px] font-bold text-white">
              {offer.badge}
            </span>
          )}
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {offer.title}
          </h2>
          {renderSubtitle()}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {offer.showCountdown !== false && (
              <>
                {[
                  [countdown.d, 'Days'],
                  [countdown.h, 'Hours'],
                  [countdown.m, 'Minutes'],
                  [countdown.s, 'Seconds'],
                ].map(([n, l]) => (
                  <div
                    key={l as string}
                    className="min-w-[64px] rounded-xl bg-white/75 px-3 py-2 text-center"
                  >
                    <b className="block text-lg">{n}</b>
                    <small className="text-[10px] text-slate-500">{l}</small>
                  </div>
                ))}
              </>
            )}
            <button
              onClick={handleCta}
              className="ml-1 inline-flex items-center gap-2 rounded-xl bg-persona-red px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
            >
              {offer.ctaLabel || 'Grab Offer Now'} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {offer.handwrittenNote && (
          <p className="handwritten absolute right-7 top-5 hidden rotate-6 text-2xl leading-tight md:block whitespace-pre-line">
            {offer.handwrittenNote.split('\n').map((line, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-persona-red">
                  {line}
                </span>
              ) : (
                <span key={i}>
                  {line}
                  <br />
                </span>
              )
            )}
          </p>
        )}
      </motion.div>
    </section>
  );
}
