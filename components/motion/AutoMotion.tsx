'use client';

/**
 * Automatic scroll-reveal + hover polish for every page EXCEPT home ("/").
 * Mounted next to <PageStage> in the route templates, so no page file has to change.
 *  - headings, images, forms, tables and "card-like" blocks below the fold fade/rise in (siblings stagger)
 *  - cards get a soft hover lift
 * Safe by design: skips anything framer-motion already animates (inline opacity/transform),
 * header/nav/footer/dialogs, fixed/sticky nodes, `[data-pm-skip]` subtrees, and reduced-motion users.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './auto-motion.css';

const CARD = 'article,[class*="rounded-"][class*="shadow"],[class*="rounded-"][class*="border"],[class*="rounded-"][class*="bg-white"]';
const ALL = `h2,h3,img,video,form,table,${CARD}`;
const SKIP = '[data-pm-skip],header,nav,footer,dialog,[role="dialog"],[aria-hidden="true"],[style*="opacity"],[style*="transform"],[class*="c3d"],[class*="flip"]';

export default function AutoMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') return; // home stays exactly as it is
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timers = new Set<number>();
    const seen = new WeakSet<Element>();
    let raf = 0;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        requestAnimationFrame(() => {
          el.classList.add('pm-in');
          const t = window.setTimeout(() => {
            el.classList.remove('pm-hide', 'pm-in', 'pm-zoom');
            el.style.removeProperty('--pm-d');
            timers.delete(t);
          }, 1500);
          timers.add(t);
        });
      }
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    let root: HTMLElement | null = null;
    const scan = () => {
      if (!root) return;
      const kids = new Map<Element, number>();
      root.querySelectorAll<HTMLElement>(ALL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const isCard = el.matches(CARD);
        if (el.closest(SKIP)) return;
        // cards: animate the innermost ones; other nodes: skip if already inside a card
        if (isCard ? el.querySelector(CARD) : el.parentElement?.closest(CARD)) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top < window.innerHeight * 0.92 || r.width < 48 || r.height < 28) return; // visible / above / tiny
        if (/fixed|sticky/.test(getComputedStyle(el).position)) return;
        const parent = el.parentElement as Element;
        const i = kids.get(parent) ?? 0;
        kids.set(parent, i + 1);
        el.style.setProperty('--pm-d', `${Math.min(i, 6) * 70}ms`);
        el.classList.add('pm-hide');
        const cls = el.getAttribute('class') || '';
        if (el.matches('img,video')) el.classList.add('pm-zoom');
        else if (isCard && !/c3d|flip|hover:(-?translate|scale)/.test(cls)) el.classList.add('pm-card');
        io.observe(el);
      });
    };

    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
    // wait a beat: the route provider scrolls to top after navigation and the stage finishes mounting
    const start = window.setTimeout(() => {
      root = document.querySelector<HTMLElement>('.page-stage');
      if (!root) return;
      scan();
      mo.observe(root, { childList: true, subtree: true });
    }, 90);

    return () => {
      window.clearTimeout(start);
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
