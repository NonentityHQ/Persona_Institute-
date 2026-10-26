'use client';

import type { ReactNode } from 'react';
import { m, type Variants } from 'framer-motion';
import { DUR, EASE_OUT, STAGGER, fadeUp, staggerParent } from '@/lib/motion';

const viewport = { once: true, amount: 0.12, margin: '0px 0px -6% 0px' } as const;

/** Section/heading reveal: one controlled fade + short rise, fired once when in view. */
export function Reveal({ children, className, delay = 0, y = 18 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE_OUT, delay } },
  };
  return <m.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={variants}>{children}</m.div>;
}

/** Parent that staggers its <StaggerItem> children when it scrolls into view. */
export function Stagger({ children, className, stagger = STAGGER, delay = 0 }: { children: ReactNode; className?: string; stagger?: number; delay?: number }) {
  return (
    <m.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={staggerParent(stagger, delay)}>
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <m.div className={className} variants={fadeUp}>{children}</m.div>;
}
