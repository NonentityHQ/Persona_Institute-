'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { m } from 'framer-motion';
import { EASE_IN_OUT } from '@/lib/motion';

type FaceArgs = { flipped: boolean; toggle: () => void; controlsId: string };

type Props = {
  front: (args: FaceArgs) => ReactNode;
  back: (args: FaceArgs) => ReactNode;
  className?: string;
};

/**
 * Accessible 3D flip card.
 *  - Both faces share one grid cell, so the card is always as tall as the taller face
 *    (no fixed heights, no layout shift).
 *  - backface-visibility hidden + back face pre-rotated → text is never mirrored.
 *  - The hidden face is `inert`: it cannot be clicked, tabbed to or read by AT.
 *  - Flip is driven by real <button>s (tap on mobile, Enter/Space on keyboard);
 *    Escape flips back. Nothing depends on hover.
 */
export default function FlipCard({ front, back, className = '' }: Props) {
  const [flipped, setFlipped] = useState(false);
  const controlsId = useId();
  const toggle = () => setFlipped((f) => !f);

  useEffect(() => {
    if (!flipped) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFlipped(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped]);

  const args = { flipped, toggle, controlsId };
  return (
    <div className={`flip ${className}`}>
      <m.div
        className="flip-inner"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: EASE_IN_OUT }}
        style={{ transformStyle: 'preserve-3d', transformPerspective: 1100 }}
      >
        <div className="flip-face flip-front" inert={flipped}>{front(args)}</div>
        <div className="flip-face flip-back" id={controlsId} inert={!flipped}>{back(args)}</div>
      </m.div>
    </div>
  );
}
