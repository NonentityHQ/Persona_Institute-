'use client';

import { useEffect, useRef } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Props = {
  /** Preferred prop */
  value?: number;
  /** Alias used on some pages (HomePageClient) */
  to?: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

/**
 * Counts up once when it scrolls into view.
 *
 * IMPORTANT: the server / first paint always contains the REAL number, never "0".
 * (Old version rendered 0 and only filled the number in after an IntersectionObserver
 * fired, so screenshots, print, no-JS and "never scrolled there" states showed "0+".)
 * The count-up is only a progressive enhancement: when the number scrolls into view
 * it restarts from 0 and counts to the real value.
 */
export default function CountUp({
  value,
  to,
  suffix = '',
  decimals = 0,
  duration = 1.6,
}: Props) {
  const target = Number(value ?? to ?? 0);
  const safeTarget = Number.isFinite(target) ? target : 0;
  const ref = useRef<HTMLSpanElement>(null);

  const fmt = (n: number) => {
    const num = Number.isFinite(n) ? n : 0;
    return `${num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Always settle on the real number first.
    el.textContent = fmt(safeTarget);

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;
    const run = () => {
      const start = performance.now();
      el.textContent = fmt(0);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        el.textContent = fmt(safeTarget * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = fmt(safeTarget);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeTarget, duration, decimals, suffix]);

  return (
    <span ref={ref} className="tabular-nums" suppressHydrationWarning>
      {fmt(safeTarget)}
    </span>
  );
}
