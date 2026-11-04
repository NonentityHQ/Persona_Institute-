'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  /** Direction the block swings in from. */
  from?: 'up' | 'left' | 'right';
};

/**
 * 3D scroll reveal (tilt + depth), driven by one IntersectionObserver.
 *
 * Why this exists: the old `whileInView` + `opacity: 0` reveals left whole sections
 * INVISIBLE until the observer fired (full-page screenshots, slow JS, anchor jumps,
 * browsers that never scroll the block into view...).
 *
 * This one can never hide content:
 *  - the "before" state is only a 3D transform (tilted + pushed back), opacity stays 1,
 *  - anything already in view or already scrolled past is revealed immediately,
 *  - no IntersectionObserver / reduced motion => shown in its final state at once.
 */
export default function Reveal3D({ children, className = '', delay = 0, from = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('is-in');

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // intersecting now, OR already above the viewport (user jumped past it)
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            show();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`h3d-reveal h3d-from-${from} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
