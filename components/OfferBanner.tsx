'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m as motion } from 'framer-motion';
import { ArrowRight, Clock3 } from 'lucide-react';
import type { SanityOffer } from '@/lib/sanity/client';
import { urlFor, sanityConfigured } from '@/lib/sanity/client';
import { EASE_OUT } from '@/lib/motion';
import GiftBox3D from '@/components/GiftBox3D';

type Props = {
  offer: SanityOffer;
  onCta?: () => void;
};

function useCountdown(endIso?: string, enabled = true) {
  const [p, setP] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!enabled || !endIso) return;
    const end = new Date(endIso).getTime();
    const tick = () => {
      const x = Math.max(0, end - Date.now());
      setP({ d: Math.floor(x / 86400000), h: Math.floor((x % 86400000) / 3600000), m: Math.floor((x % 3600000) / 60000), s: Math.floor((x % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endIso, enabled]);
  return p;
}

const bgMap = {
  peach: 'from-[#fff5eb] via-[#ffe8d4] to-[#ffd4b8]',
  rose: 'from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
  cream: 'from-[#fffbeb] via-[#fef3c7] to-[#fde68a]',
};

/** One countdown cell; the digits roll when the value changes. */
function Tick({ v, label }: { v: number; label: string }) {
  const t = String(v).padStart(2, '0');
  return (
    <div className="min-w-[62px] rounded-xl bg-white/90 px-3 py-2 text-center shadow-[0_10px_20px_-12px_rgba(245,22,50,.5)] ring-1 ring-white">
      <span className="relative block h-6 overflow-hidden text-lg font-black leading-6 tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={t} className="absolute inset-0" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.28, ease: EASE_OUT }}>{t}</motion.span>
        </AnimatePresence>
      </span>
      <small className="text-[10px] text-slate-500">{label}</small>
    </div>
  );
}

const SPARKS: Array<[number, number, string, number]> = [[8, 18, '#fb7185', 5], [22, 78, '#fbbf24', 6], [48, 12, '#fb7185', 4], [63, 84, '#fbbf24', 7], [78, 22, '#f43f5e', 5], [92, 70, '#fbbf24', 6]];

export default function OfferBanner({ offer, onCta }: Props) {
  const c = useCountdown(offer.countdownEnd, offer.showCountdown !== false);
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

  const pill = 'mx-0.5 rounded-md bg-persona-red/10 px-1.5 py-0.5 font-extrabold text-persona-red';
  // Highlight priceText (if present) inside the subtitle
  const renderSubtitle = () => {
    if (!offer.subtitle) return null;
    if (offer.priceText && offer.subtitle.includes(offer.priceText)) {
      const [before, after] = offer.subtitle.split(offer.priceText);
      return <p className="mt-2 text-sm">{before}<b className={pill}>{offer.priceText}</b>{after}</p>;
    }
    return <p className="mt-2 text-sm">{offer.subtitle}{offer.priceText && <> <b className={pill}>{offer.priceText}</b></>}</p>;
  };

  const note = offer.handwrittenNote?.split('\n') ?? [];

  return (
    <section className="section-wrap pt-5">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className={`offer-banner relative grid items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-r ${bg} px-6 py-7 shadow-[0_26px_50px_-30px_rgba(245,22,50,.5)] ring-1 ring-white/70 md:grid-cols-[.65fr_1.6fr] md:px-10`}
      >
        {/* ambient: drifting glows, floating sparks, slow light sweep */}
        <motion.span aria-hidden className="pointer-events-none absolute -left-10 top-[15%] h-56 w-56 rounded-full bg-white/70 blur-3xl" animate={{ x: [0, 24, 0], y: [0, 16, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span aria-hidden className="pointer-events-none absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-rose-300/40 blur-3xl" animate={{ x: [0, -20, 0], y: [0, -14, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
        {SPARKS.map(([l, t, col, s], i) => (
          <motion.span key={i} aria-hidden className="pointer-events-none absolute rounded-full" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, background: col }} animate={{ y: [0, -14, 0], opacity: [0.15, 0.85, 0.15], scale: [0.7, 1.3, 0.7] }} transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
        ))}
        <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/55 to-transparent" animate={{ x: ['-120%', '420%'] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }} />

        {/* Left: Sanity image, else the 3D gift */}
        <div className="relative z-10 hidden md:block">
          {imageSrc ? (
            <motion.div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl shadow-lg" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Image src={imageSrc} alt="" fill className="object-cover" sizes="144px" />
            </motion.div>
          ) : (
            <GiftBox3D tone="gold" />
          )}
        </div>

        <div className="relative z-10">
          {offer.badge && (
            <motion.span initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE_OUT }} className="inline-flex items-center gap-1.5 rounded-full bg-persona-red px-3 py-1 text-[11px] font-bold text-white shadow-[0_8px_16px_-8px_rgba(245,22,50,.8)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {offer.badge}
            </motion.span>
          )}
          <h2 aria-label={offer.title} className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {(offer.title || '').split(' ').map((w, i) => (
              <motion.span key={i} aria-hidden className="mr-[.28em] inline-block pr-[.04em]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.07, duration: 0.55, ease: EASE_OUT }}>{w}</motion.span>
            ))}
          </h2>
          {renderSubtitle()}

          {offer.showCountdown !== false && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-slate-500">
              <Clock3 size={13} className="text-persona-red" /> Offer ends in
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {offer.showCountdown !== false && (
              <>
                <Tick v={c.d} label="Days" />
                <Tick v={c.h} label="Hours" />
                <Tick v={c.m} label="Minutes" />
                <Tick v={c.s} label="Seconds" />
              </>
            )}
            <motion.button
              onClick={handleCta}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="group relative ml-1 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#ff3355] to-persona-red px-5 py-3 text-sm font-bold text-white shadow-[0_14px_26px_-12px_rgba(245,22,50,.85)]"
            >
              <motion.span aria-hidden className="absolute inset-y-0 left-0 w-1/5 skew-x-[-20deg] bg-white/30 blur-[2px]" animate={{ x: ['-150%', '560%'] }} transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }} />
              {offer.ctaLabel || 'Grab Offer Now'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        {note.length > 0 && (
          <motion.p
            className="handwritten absolute right-7 top-5 hidden text-2xl leading-tight md:block"
            style={{ rotate: 6 }}
            animate={{ y: [0, -5, 0], rotate: [6, 4.5, 6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {note.map((line, i) => (
              <motion.span
                key={i}
                className={`block whitespace-pre ${i === note.length - 1 ? 'text-persona-red' : ''}`}
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.45, duration: 0.7, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            ))}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
