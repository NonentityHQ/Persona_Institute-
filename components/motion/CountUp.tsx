'use client';

import { useEffect, useRef } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up once, only when it scrolls into view.
 * Dependency-free (rAF + IntersectionObserver) so pages that only need a counter
 * (e.g. /login) don't pull in framer-motion's animation engine. It writes straight
 * to the DOM node: no React state, no re-render per frame (the old counters
 * re-rendered whole pages ~60x/s).
 */
export default function CountUp({ value, suffix = '', decimals = 0, duration = 1.4 }: { value: number; suffix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    `${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(value); return; }
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        el.textContent = fmt(value * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = fmt(value);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals, suffix]);

  // Server + first client render are identical ("0"), so hydration never mismatches.
  return <span ref={ref} className="tabular-nums">{fmt(0)}</span>;
}
