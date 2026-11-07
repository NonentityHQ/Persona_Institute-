# Performance cleanup (local test build)

## Changes
- YouTube hero keeps the official thumbnail from `img.youtube.com` (`maxresdefault.jpg`, with `hqdefault.jpg` fallback) visible while the hero iframe initializes. The muted YouTube iframe is eagerly mounted with `autoplay=1`, preserving the previous autoplay behavior.
- Removed the decorative blue underline under “Talk to Ajay Sir” in the Contact page guidance section.
- External Classplus course thumbnails (including the shared course-detail image) now use Next.js Image optimization; the `unoptimized` bypass was removed. Known Classplus CDN hosts and subdomains are allowed in `next.config.ts`.
- Next Image output is configured for responsive WebP variants, quality allowlist `[75, 78]` (required by the project's Next.js 16 version), and a 30-day minimum optimizer cache TTL.
- Local raster images referenced by the app were converted to alpha-preserving WebP, resized to realistic display dimensions, and code paths were updated.
- The 3D cards retain perspective/depth, soft hover lift and glare but no longer rotate/tilt. The homepage device slab and reveal entrance are level; layered depth and non-rotational movement remain.
- Instagram reel auto-scroll is paused while the carousel is outside the viewport.
- Unused local assets were removed after a source-reference scan. Browser/PWA icons were preserved.

## Image conversion summary
- 31 referenced PNG/JPG raster images were converted to alpha-preserving WebP and code references were updated.
- Converted source images: 10,782.1 KB → 1,440.4 KB (about 86.6% smaller; approximately 9.3 MB saved).
- Static source scan: 94 image/video references checked, zero missing paths, and no remaining static PNG/JPG image references (PWA icon files are preserved).

## Removed assets
- `public/images/about-hero-person-exact.webp` (109.7 KB)
- `public/images/ajay-sir-arms-crossed.png` (1389.9 KB)
- `public/images/ajay-sir-blue-office.png` (2376.4 KB)
- `public/images/ajay-sir-blue-shirt.png` (2127.4 KB)
- `public/images/ajay-sir-handshake.png` (2042.3 KB)
- `public/images/ajay-sir-hero-handshake.png` (1291.8 KB)
- `public/images/ajay-sir-original-cutout.png` (896.7 KB)
- `public/images/ajay-sir-persona.jpg` (26.3 KB)
- `public/images/ajay-sir-white-logo.png` (2390.7 KB)
- `public/images/ajay-sir-white-shirt.png` (1572.3 KB)
- `public/images/books/dot-pattern.png` (47.7 KB)
- `public/images/books/gift-box.png` (19.4 KB)
- `public/images/community.jpg` (37.1 KB)
- `public/images/contact-ajay-reference.jpg` (17.2 KB)
- `public/images/contact-community-reference.jpg` (39.5 KB)
- `public/images/contact-hero-background.webp` (54.4 KB)
- `public/images/contact-hero-clean.jpg` (37.2 KB)
- `public/images/contact-hero-reference.jpg` (40.5 KB)
- `public/images/courses-hero-background.webp` (54.4 KB)
- `public/images/hero-teacher.jpg` (113.6 KB)
- `public/images/offer-gift.jpg` (8.6 KB)
- `public/images/persona-books-banner.png` (2022.1 KB)
- `public/images/success-hero-person-exact.webp` (93.5 KB)
- `public/favicon.png` (1457.3 KB)
- `public/images/hero-video-poster.webp` (unused local substitute; the hero now uses the official YouTube thumbnail)

## Known unused GitHub-main asset
- `public/videos/persona-intro.mp4` (5.68 MB) appeared in the inspected GitHub tree but was absent from the complete source ZIP used for this local patch and had no component reference in the reviewed code. The final ZIP contains no MP4 or `public/videos/` folder. If your separate local GitHub clone has this file, it is safe to delete after confirming no custom runtime reference was added locally.

## Testing
This ZIP is intended for local validation. The production build was not run in this environment. Verify `npm install` and `npm run build` locally before deploying.


## Follow-up UI / YouTube warning fixes
- Removed the decorative orange underline beneath the "Persona Books" headline accent.
- Standardized both homepage and Book Store stat sections to six cards: 2 columns on phones and 3 columns at tablet/desktop widths; the last card no longer spans the full mobile row.
- Number and label font sizes now scale from each individual stat-card width, keeping values aligned and readable on narrow phones.
- Added the matching existing "Exam Focused" / "At Your Own Pace" descriptor to complete both six-card sets; CMS-configured Book Store stats are preserved and missing slots are filled from defaults.
- Made the fixed public header opaque so hero text does not show through it on mobile.
- Book Store image/title layout keeps the existing design; no course, pricing or CMS data was removed.
- YouTube embeds now use the standard `www.youtube.com/embed/{id}` host; feed uploads and curated Sanity videos are merged/deduplicated rather than one source suppressing the other.
- Added the Next Image quality 80 allowlist entry used by the YouTube thumbnail and removed the duplicate fullscreen permission token while retaining `allowFullScreen`.

## Console log triage
- Fixed: Next Image quality 80 allowlist warning.
- Fixed: iframe `allow` + `allowFullScreen` duplicate fullscreen permission warning.
- Not an app fix: `content-youtube-embed.js` says it should only load in a browser extension; this is injected by a browser extension, not a project source file.
- Not an app fix: `logsListener.bundle.js` unload-policy messages and the `requestAdapter()/No available adapters` WebGPU messages are emitted by injected tooling/browser capabilities in the provided log; no matching project source stack is present.
- Informational: `[HMR] connected` is Next dev mode; the lazy-image intervention is a browser loading notice, not a JavaScript exception.

- Public mobile header is now opaque so the page content beneath it cannot show through.
- YouTube section embeds use the standard YouTube host, load only when a card is played, and show an explicit external YouTube fallback if an iframe fails.

- Removed the fixed-header scroll progress hairline as well as the Book Store title accent underline, matching the provided mobile screenshots.
- Removed unused Book Store hero pointer-parallax motion values and pointermove listener; they were being updated but never applied to a visible element.
- Package-lock note: this source snapshot did not include `package-lock.json`. When applying changes over your existing GitHub checkout, retain the repository's current lockfile. For a fresh extracted test folder, `npm install` will generate a lockfile.
- Validation in this environment: TypeScript/TSX transpile syntax checks passed for all changed code files; 33 literal local image/video references checked with zero missing paths. Full `npm run build` was not run because `npm install` timed out in this environment.
