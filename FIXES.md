# Build fixes applied

1. **lib/motion.ts** — added missing `DUR.fast: 0.2` (used by BrandLoginModal)
2. **lib/sanity/fallback.ts** — removed duplicate keys `youtubeSectionTitle` / `youtubeSectionKicker` in `fallbackSettings`

Replace these two files in your project (or extract this whole zip over your source).
Then:

```bash
rm -rf .next
npm run build
```
