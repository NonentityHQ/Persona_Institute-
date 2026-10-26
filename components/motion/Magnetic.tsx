'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { SOFT_SPRING } from '@/lib/motion';
import { useFinePointer } from './useFinePointer';

/** CTA micro-interaction: the button leans (max 6px) toward the cursor. Mouse only. */
export default function Magnetic({ children, className, strength = 0.22 }: { children: ReactNode; className?: string; strength?: number }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), SOFT_SPRING);
  const y = useSpring(useMotionValue(0), SOFT_SPRING);
  const enabled = fine && !reduced;
  const clamp = (n: number) => Math.max(-6, Math.min(6, n));

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <m.span ref={ref} className={`inline-flex ${className ?? ''}`} style={enabled ? { x, y } : undefined}
      onPointerMove={onMove} onPointerLeave={reset} onPointerCancel={reset}>
      {children}
    </m.span>
  );
}
