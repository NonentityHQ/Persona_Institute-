'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { RouteTransitionProvider } from './RouteTransition';

// domMax (layout + gestures) is fetched after first paint, so it never blocks hydration.
const loadFeatures = () => import('@/lib/motion-features').then((mod) => mod.default);

/**
 * Single mount point for the whole motion system:
 *  - MotionConfig reducedMotion="user": transforms/layout are disabled automatically
 *    when the visitor has prefers-reduced-motion enabled (opacity fades remain).
 *  - LazyMotion: components use the lightweight `m.*` and share one feature bundle.
 *  - RouteTransitionProvider: page enter/exit, progress bar, shared-element overlay.
 */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict={false}>
        <RouteTransitionProvider>{children}</RouteTransitionProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
