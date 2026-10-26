'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouteTransition } from './RouteTransition';

type Props = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Classes for the clipped, rounded box (same box the overlay morphs into). */
  className?: string;
};

/**
 * Destination half of a shared-element transition.
 * While the overlay is flying in, this box stays invisible (but keeps its space,
 * so there is no layout jump); once the overlay lands it is revealed in the same
 * frame the overlay is removed.
 */
export default function SharedImage({ id, src, alt, width, height, className = '' }: Props) {
  const { shared, registerSharedTarget } = useRouteTransition();
  const ref = useRef<HTMLDivElement>(null);
  const waiting = shared?.id === id && !shared.to && !shared.dismiss;
  const hidden = shared?.id === id && !shared.dismiss;

  useEffect(() => {
    if (!waiting) return;
    // Two frames: lets Next finish its scroll-to-top and the layout settle before measuring.
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        registerSharedTarget(id, { left: r.left, top: r.top, width: r.width, height: r.height }, radius);
      });
    });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [waiting, id, registerSharedTarget]);

  return (
    <div ref={ref} className={className} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      <Image src={src} alt={alt} width={width} height={height} priority sizes="(max-width: 768px) 92vw, 540px" className="h-full w-full object-cover" />
    </div>
  );
}
