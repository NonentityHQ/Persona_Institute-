'use client';

/**
 * Router-compatible page transitions for the Next.js App Router.
 *
 * The App Router never waits for exit animations, and we deliberately avoid the
 * private "FrozenRouter" hack (it depends on undocumented Next internals).
 * Instead the lifecycle is explicit and can never block navigation:
 *
 *   1. A link click calls `navigate()`.
 *   2. The *current* page plays a short exit (~220ms: dim + 0.6% depth).
 *   3. `router.push()` runs. The new page mounts at the same dimmed state and
 *      eases in (~450ms), so old → new reads as one continuous scene.
 *   4. A hard 4.5s safety timer resets everything if navigation never completes.
 *
 * Back/forward and direct URL loads skip step 2 (the browser already navigated)
 * but still get the enter animation (back/forward) or none at all (first load).
 *
 * Shared elements (course image → detail hero) use a persistent fixed overlay
 * that lives here, above the route tree, so it survives the route swap.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { m, useReducedMotion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '@/lib/motion';

export type SharedRect = { left: number; top: number; width: number; height: number };
export type SharedSource = { id: string; src: string; rect: SharedRect; radius: number };
type SharedState = SharedSource & { to?: { rect: SharedRect; radius: number }; dismiss?: boolean };
type NavOptions = { shared?: SharedSource; replace?: boolean };
type Progress = 'idle' | 'active' | 'done';

type Ctx = {
  navigate: (href: string, opts?: NavOptions) => void;
  leaving: boolean;
  originY: number;
  shared: SharedState | null;
  registerSharedTarget: (id: string, rect: SharedRect, radius: number) => void;
};

const fallbackCtx: Ctx = {
  navigate: (href) => { window.location.assign(href); },
  leaving: false,
  originY: 0,
  shared: null,
  registerSharedTarget: () => {},
};
const RouteCtx = createContext<Ctx>(fallbackCtx);
export const useRouteTransition = () => useContext(RouteCtx);

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  const [originY, setOriginY] = useState(0);
  const [progress, setProgress] = useState<Progress>('idle');
  const [shared, setShared] = useState<SharedState | null>(null);
  const busy = useRef(false);
  const safetyTimer = useRef<number | undefined>(undefined);
  const goTimer = useRef<number | undefined>(undefined);
  const sharedTimer = useRef<number | undefined>(undefined);
  const prevPath = useRef(pathname);
  const scrollOnArrive = useRef(false);
  const hasShared = useRef(false);
  hasShared.current = shared !== null;

  const navigate = useCallback((href: string, opts?: NavOptions) => {
    let url: URL;
    try { url = new URL(href, window.location.href); } catch { return; }
    const go = () => (opts?.replace ? router.replace(href) : router.push(href));
    if (url.origin !== window.location.origin) { window.location.assign(href); return; }
    const samePage = url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePage || reduced) { go(); return; }
    if (busy.current) return; // ignore double clicks while a transition is in flight
    busy.current = true;
    scrollOnArrive.current = true;
    if (opts?.shared) setShared({ ...opts.shared });
    setOriginY(window.scrollY + window.innerHeight / 2);
    setLeavingFrom(window.location.pathname);
    setProgress('active');
    goTimer.current = window.setTimeout(go, DUR.routeExit * 1000);
    // Never block navigation indefinitely: if the pathname never changes, reset.
    safetyTimer.current = window.setTimeout(() => {
      busy.current = false;
      scrollOnArrive.current = false;
      setLeavingFrom(null);
      setProgress('idle');
      setShared(null);
    }, 4500);
  }, [router, reduced]);

  // Route actually changed (push, back, forward, or direct link): settle all state.
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    busy.current = false;
    // Our own forward navigations always start at the top. (Next skips its scroll when the new
    // segment's top is already visible, which would leave a clamped, non-zero scroll position.)
    // Back/forward are untouched, so the browser's scroll restoration keeps working.
    if (scrollOnArrive.current && !window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    scrollOnArrive.current = false;
    window.clearTimeout(safetyTimer.current);
    setLeavingFrom(null);
    setProgress((p) => (p === 'active' ? 'done' : 'idle'));
    // If a shared element was in flight but the destination never registers a
    // target (e.g. a route without <SharedImage>), fade the overlay out cleanly.
    window.clearTimeout(sharedTimer.current);
    if (hasShared.current) {
      sharedTimer.current = window.setTimeout(() => {
        setShared((s) => (s && !s.to ? { ...s, dismiss: true } : s));
      }, 1500);
    }
  }, [pathname]);

  useEffect(() => {
    if (progress !== 'done') return;
    const t = window.setTimeout(() => setProgress('idle'), 450);
    return () => window.clearTimeout(t);
  }, [progress]);

  useEffect(() => () => {
    window.clearTimeout(safetyTimer.current);
    window.clearTimeout(goTimer.current);
    window.clearTimeout(sharedTimer.current);
  }, []);

  const registerSharedTarget = useCallback((id: string, rect: SharedRect, radius: number) => {
    window.clearTimeout(sharedTimer.current);
    setShared((s) => (s && s.id === id ? { ...s, to: { rect, radius } } : s));
  }, []);

  const value = useMemo<Ctx>(() => ({
    navigate,
    leaving: leavingFrom !== null && leavingFrom === pathname,
    originY,
    shared,
    registerSharedTarget,
  }), [navigate, leavingFrom, pathname, originY, shared, registerSharedTarget]);

  return (
    <RouteCtx.Provider value={value}>
      {children}
      <RouteProgress progress={progress} />
      {shared && <SharedOverlay shared={shared} onDone={() => setShared(null)} />}
    </RouteCtx.Provider>
  );
}

/** Thin brand-coloured bar: instant feedback if the next route takes a moment. */
function RouteProgress({ progress }: { progress: Progress }) {
  return (
    <m.div
      aria-hidden="true"
      className="route-progress"
      initial={false}
      animate={progress}
      variants={{
        idle: { scaleX: 0, opacity: 0, transition: { duration: 0 } },
        active: { scaleX: 0.85, opacity: 1, transition: { scaleX: { duration: 3, ease: EASE_OUT }, opacity: { duration: 0.1 } } },
        done: { scaleX: 1, opacity: 0, transition: { scaleX: { duration: 0.2, ease: EASE_OUT }, opacity: { duration: 0.3, delay: 0.15 } } },
      }}
    />
  );
}

/**
 * Persistent flying image. It starts exactly over the clicked card image,
 * waits for the destination to report its target rect, then glides there.
 * It animates left/top/width/height on ONE small fixed element for ~600ms
 * (an intentional exception to the transform-only rule: it keeps object-cover
 * crop and rounded corners exact, which a scale transform would distort).
 */
function SharedOverlay({ shared, onDone }: { shared: SharedState; onDone: () => void }) {
  const { rect, radius, to, dismiss } = shared;
  const animateTo = dismiss
    ? { opacity: 0, transition: { duration: 0.25, ease: EASE_OUT } }
    : to
      ? {
          left: to.rect.left, top: to.rect.top, width: to.rect.width, height: to.rect.height,
          borderRadius: to.radius,
          transition: { duration: DUR.shared, ease: EASE_IN_OUT },
        }
      : undefined;
  return (
    <m.div
      aria-hidden="true"
      className="shared-overlay"
      initial={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: radius, opacity: 1 }}
      animate={animateTo}
      onAnimationComplete={() => { if (dismiss || to) onDone(); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shared.src} alt="" draggable={false} />
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page stage: wraps route content, gives enter + exit motion.         */
/* ------------------------------------------------------------------ */

let lastPath: string | null = null; // module-level: null until the first client mount

export function PageStage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  // Keyed by pathname so every route change gets a fresh enter, including
  // /courses → /courses/[slug], where Next keeps the same template instance.
  return <Stage key={pathname} pathname={pathname} className={className}>{children}</Stage>;
}

function Stage({ pathname, children, className }: { pathname: string; children: ReactNode; className: string }) {
  const { leaving, originY, shared } = useRouteTransition();
  const reduced = useReducedMotion();
  // First load (SSR + hydration) renders in its final state: no flash, no CLS.
  // Every later mount (client navigation, back/forward) animates in.
  const animateIn = useRef(typeof window !== 'undefined' && lastPath !== null).current;
  useEffect(() => { lastPath = pathname; }, [pathname]);

  const initial = animateIn && !reduced ? { opacity: 0.4, y: shared ? 0 : 10 } : false;
  // Promote the (page-tall) stage to its own compositor layer ONLY while it animates.
  // Measured: whole-page opacity/transform without this re-rasterises every frame
  // (/courses nav: median p95 68ms -> 29ms, worst frame 266ms -> 126ms).
  // Never left on: will-change:transform would turn the stage into the containing
  // block for position:fixed descendants (modals).
  const [animating, setAnimating] = useState(initial !== false);
  const promote = animating || (leaving && !reduced);
  const exit = { opacity: 0.4, y: -4, scale: 0.994 };
  const rest = { opacity: 1, y: 0, scale: 1 };

  return (
    <m.div
      className={`page-stage ${className}`}
      initial={initial}
      animate={leaving && !reduced ? exit : rest}
      transition={leaving
        ? { duration: DUR.routeExit, ease: EASE_IN_OUT }
        : { duration: DUR.routeEnter, ease: EASE_OUT }}
      style={{ transformOrigin: `50% ${originY}px`, willChange: promote ? 'transform, opacity' : 'auto' }}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
    >
      {children}
    </m.div>
  );
}
