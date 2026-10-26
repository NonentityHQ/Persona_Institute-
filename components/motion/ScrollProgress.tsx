'use client';

import { m, useScroll, useSpring } from 'framer-motion';

/** Hairline reading-progress bar, driven by real scroll progress (one MotionValue, no re-renders). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 34, restDelta: 0.001 });
  return <m.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />;
}
