'use client';

import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import { DUR, EASE_OUT } from '@/lib/motion';

/**
 * Hero headline.
 *  - Reveals one LINE at a time, strictly top to bottom: the whole first line rises
 *    out of its mask, then the next one (so a later word such as "with" can never
 *    appear before an earlier one). Words inside a line stay intact and wrap naturally.
 *  - Transforms don't affect layout, so the heading is stable from the first frame.
 *  - No blur, no per-letter / per-word components.
 *  - The line mask has bottom padding (cancelled by negative margin) so descenders
 *    of g/p/y are never clipped; `contain: paint` + `isolation` keep the clip reliable
 *    in Safari, which can ignore overflow:hidden for transformed children.
 */
export type HeadingPart = string | { text: string; className?: string } | { node: ReactNode };
type Props = { lines: HeadingPart[][]; className?: string; delay?: number; ariaLabel: string };

const LINE_GAP = 0.16; // seconds between line N and line N+1 starting
const parent = (delay: number): Variants => ({ hidden: {}, show: { transition: { staggerChildren: LINE_GAP, delayChildren: delay } } });
const lineVariants: Variants = {
  hidden: { y: '118%' },
  show: { y: '0%', transition: { duration: DUR.hero, ease: EASE_OUT } },
};

export function HeroHeading({ lines, className = '', delay = 0.05, ariaLabel }: Props) {
  return (
    <m.h1 aria-label={ariaLabel} className={className} initial="hidden" animate="show" variants={parent(delay)}>
      {lines.map((line, li) => (
        <span key={li} className="hero-line" aria-hidden="true">
          <m.span variants={lineVariants} className="hero-line-inner">
            {line.map((part, pi) => (
              <Fragment key={pi}>
                {typeof part === 'string'
                  ? part
                  : 'text' in part
                    ? <span className={part.className}>{part.text}</span>
                    : part.node}
                {pi < line.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </m.span>
        </span>
      ))}
    </m.h1>
  );
}

/**
 * Typed word. Shows `words[0]` complete (so SSR, SEO and LCP are stable), then
 * once — after the heading has settled — erases and types the other words at a
 * readable pace (~70ms/char), returns to `words[0]` and stops.
 * Width is reserved by an invisible copy of the longest word, so nothing reflows.
 */
export function TypedWord({
  words, className = '', startAfter = 3600, typeMs = 70, eraseMs = 36, holdMs = 1900,
}: { words: string[]; className?: string; startAfter?: number; typeMs?: number; eraseMs?: number; holdMs?: number }) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(words[0]);
  const [busy, setBusy] = useState(false);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => window.setTimeout(res, ms));
    (async () => {
      await wait(startAfter);
      let current = words[0];
      for (const next of [...words.slice(1), words[0]]) {
        if (cancelled) return;
        setBusy(true);
        while (current.length > 0 && !cancelled) { current = current.slice(0, -1); setText(current); await wait(eraseMs); }
        await wait(160);
        for (let i = 1; i <= next.length && !cancelled; i++) { setText(next.slice(0, i)); await wait(typeMs); }
        current = next;
        setBusy(false);
        if (next !== words[0]) await wait(holdMs);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <span className={`typed-word relative inline-block ${className}`}>
      <span className="invisible">{longest}</span>
      <span className="absolute left-0 top-0 whitespace-nowrap">
        {text}
        <span className={`typed-caret ${busy ? 'is-typing' : ''}`} aria-hidden="true" />
      </span>
    </span>
  );
}

/** Entrance for the supporting copy, CTAs and proof row (plays once, after the heading starts). */
export function HeroFade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <m.div className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.reveal, ease: EASE_OUT, delay }}>
      {children}
    </m.div>
  );
}
