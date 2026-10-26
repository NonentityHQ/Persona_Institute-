import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion tokens for the whole site.
 * Keep every duration / easing here so pages feel like one continuous scene.
 * No springs with overshoot: everything is either a tuned ease or an over-damped spring.
 */
export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;     // smooth deceleration (entrances)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;     // symmetric (exits, shared morph)

export const DUR = {
  hover: 0.24,       // 180–280ms
  routeExit: 0.22,   // old page leaving
  routeEnter: 0.45,  // new page arriving (350–550ms)
  shared: 0.62,      // shared-element morph (450–750ms)
  reveal: 0.6,       // scroll reveals
  hero: 0.75,        // hero word reveal
} as const;

export const STAGGER = 0.055; // 40–70ms between related cards

/** Over-damped spring (damping > 2·√(k·m)): settles without overshoot. */
export const SOFT_SPRING = { stiffness: 260, damping: 32, mass: 0.6 } as const;

export const tReveal: Transition = { duration: DUR.reveal, ease: EASE_OUT };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: tReveal },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.reveal, ease: EASE_OUT } },
};

export const staggerParent = (stagger: number = STAGGER, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Card entrance: slightly more depth than a plain fade-up. */
export const cardItem: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: DUR.reveal, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: EASE_IN_OUT } },
};
