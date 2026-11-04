# Mobile + build fixes

## Build
1. `lib/motion.ts` — added `DUR.fast: 0.2`
2. `lib/sanity/fallback.ts` — removed duplicate `youtubeSectionTitle` / `youtubeSectionKicker`

## Mobile UX
3. **Login modal** (`BrandLoginModal.tsx`)
   - Bottom-sheet on mobile, centered on desktop
   - Body scroll lock, safe max-height + internal scroll
   - Higher z-index (200) so it sits above header/menu
   - Drag handle on mobile

4. **Login button** (`BrandLoginButton.tsx`)
   - Visible on mobile header (compact "Login")
   - `onOpen` callback to close mobile menu when modal opens

5. **Public header** — closes mobile menu when Login is tapped

6. **Reels** (`GrowCarousel.tsx`)
   - Removed ← → arrow buttons
   - Mobile/touch: native horizontal swipe + snap
   - Desktop: keeps auto-marquee (hover to pause)

7. **Hero feature chips** (`home3d.css`)
   - Full-width stacked pills under video on mobile/tablet
   - All 4 chips visible (Expert / Structured / Practice / Build)
   - Cleaner spacing, no overlapping absolute positions

## Apply
Copy these files into your project, then:
```bash
rm -rf .next
npm run build
```
