'use client';

import { useRef, type ReactNode } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * Scroll-linked depth. Follows actual scroll progress of the element's own
 * viewport pass (no per-pixel animation restarts). Transform-only.
 */
export default function Parallax({ children, className, distance = 28 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  if (reduced) return <div className={className}>{children}</div>;
  return <m.div ref={ref} className={`relative ${className ?? ''}`} style={{ y }}>{children}</m.div>;
}
