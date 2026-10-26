# Persona Institute — Motion System Notes

Everything lives in `components/motion/*`, `lib/motion.ts` and `app/motion.css`.
No new npm dependencies were added (`package.json` / `package-lock.json` are unchanged).

## Architecture

| Piece | File | What it does |
|---|---|---|
| Tokens | `lib/motion.ts` | Easings, durations, stagger, shared variants. Change timing here only. |
| Root | `components/motion/MotionRoot.tsx` | `MotionConfig reducedMotion="user"` + `LazyMotion` (domMax loaded lazily) + route provider. Mounted in `app/layout.tsx`. |
| Route transitions | `components/motion/RouteTransition.tsx` | `navigate()`, `PageStage`, progress bar, shared-element overlay. |
| Links | `components/motion/TransitionLink.tsx` | Drop-in for `next/link`. Use it for every internal link. |
| 3D tilt | `components/motion/Card3D.tsx` | Mouse-only tilt (±5° default), lift, soft glare, depth layers `.c3d-z1/.c3d-z2`. |
| Flip | `components/motion/FlipCard.tsx` | Accessible flip: faces share one grid cell, hidden face is `inert`, Esc flips back. |
| Shared element | `components/motion/SharedImage.tsx` | Destination half of the course-card → detail morph. |
| Hero text | `components/motion/HeroText.tsx` | `HeroHeading` (whole-word mask reveal), `TypedWord`, `HeroFade`. |
| Scroll | `ScrollProgress.tsx`, `Parallax.tsx` | Scroll-linked, MotionValue-driven (no re-renders). |
| Misc | `Reveal.tsx`, `CountUp.tsx`, `Magnetic.tsx` | Section reveals, count-up on view, CTA lean. |

### Persistent layouts (route groups — URLs unchanged)
- `app/(public)/layout.tsx` mounts `PublicHeader` once → the active-tab pill (`layoutId`) glides between tabs.
- `app/(portal)/layout.tsx` mounts `PortalFrame` (sidebar + topbar) once. Pages still wrap content in `<PortalShell>`, which is a pass-through inside the frame.
- `app/login` is outside both groups and has its own `template.tsx`.

### Route transition lifecycle
The App Router does not wait for exit animations, and we avoid private Next internals. So:
1. `TransitionLink` click → `navigate(href)`.
2. Current page dims/depth-shifts for 220 ms, progress bar starts.
3. `router.push()`; new page mounts at the same dimmed state and eases in (450 ms).
4. A 4.5 s safety timer resets all state if the pathname never changes. Double clicks are ignored while in flight.

Back/forward and direct URL loads: no exit (browser already navigated); back/forward get the enter animation, first load renders in its final state (no flash, no CLS).
Modified clicks (Ctrl/Cmd/Shift/middle), `target=_blank`, hash-only and external links are never intercepted.

### Shared element (course card → detail)
`<TransitionLink sharedFrom={{ id, getBox }}>` captures the card image rect; a persistent fixed overlay (above the route tree) flies to the rect reported by `<SharedImage id=… />` on the destination. If the destination never reports, the overlay fades out after 1.5 s. Going *back* uses the normal crossfade (no reverse morph).

## Performance decisions (measured, see below)
- Removed the global CSS rule that animated every `main h1/h2/h3/p/article/section>div>div`, plus the stacked legacy entrance animations and duplicate `@keyframes`.
- Removed `transform` from the global `main a, main button` transition (it fought framer-driven transforms).
- `will-change: transform, opacity` is set on the page stage **only while it animates** (never permanently: it would trap `position: fixed` modals).
- Removed full-surface `backdrop-filter`/`backdrop-blur-xl` on ≥90 %-opaque panels and modal scrims.
- Counters write to the DOM (no state per frame) and start only when in view.
- Hero background PNGs (~2.2 MB each) → WebP (originals are still in `public/images/`, now unreferenced). Logo file is untouched; it is served through `next/image`.
- `/courses/[slug]` is statically generated (`generateStaticParams`).
- `html[data-scroll-behavior="smooth"]` so Next jumps to top instantly on route change while anchors stay smooth.

## Adding things
- New internal link → `TransitionLink`.
- New card group → `Stagger`/`StaggerItem` or `variants={cardItem}`; tilt → wrap in `Card3D`; flip → `FlipCard`.
- Another shared element → give the source `sharedFrom={{ id: "x", getBox }}` and the destination `<SharedImage id="x" … />` (box needs a fixed aspect ratio so its rect is known before the image loads).

## Content changes made alongside (please review)
- `app/(public)/reviews/page.tsx`: 6 occurrences of "Saurabh Sir" → "Ajay Sir" (brand rule).
- Home hero heading now rotates its last word (Confidence → Fluency → Clarity → Confidence, once). Remove `TypedWord` words to keep it static.
- Course detail page got an "All courses" back link.

## Verification status
Headless Chromium (software rendering — not a real GPU), production build:
- `tsc --noEmit` and `next build` pass. `npm run lint` could not run (the repo has no ESLint config; the script opens an interactive setup).
- 21 routes × 2 viewports: no console errors, no horizontal overflow, no stuck transition state.
- Dev mode (`next dev`): no hydration, key or React warnings across 13 routes + SPA navigation + back/forward.
- Not tested: real GPU 60 fps, Safari/Firefox, physical touch devices (emulation only).
