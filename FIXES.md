# Fixes

## Build
- `lib/motion.ts` — `DUR.fast: 0.2`
- `lib/sanity/fallback.ts` — duplicate youtube keys removed

## Mobile login
- Bottom-sheet modal, body scroll lock, z-index 200
- Header Login visible on mobile; closes menu on open

## Hero chips (mobile / tablet)
- **2×2 grid** under the video — no long empty bars
- Desktop (≥1024px): original floating side chips unchanged

## Reels
- Auto-rolling kept on **all** devices
- Cards stay **clickable** (Instagram)
- Arrow buttons removed
- Hover / touch pauses briefly so you can tap

```bash
rm -rf .next && npm run build
```
