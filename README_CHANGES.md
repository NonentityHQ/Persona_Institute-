# Changed files only — dual login + CountUp fix + auto-rolling reels

Copy these into your project (same paths):

```
components/motion/CountUp.tsx
components/reels/GrowCarousel.tsx
components/BrandLoginModal.tsx
components/BrandLoginButton.tsx
components/PublicHeader.tsx
components/OfferBanner.tsx          (if present)
lib/classplus/brands.ts
lib/classplus/client.ts
app/login/page.tsx
app/(public)/HomePageClient.tsx     (CountUp prop fix)
```

Also append `app/globals-reels-snippet.css` into your `app/globals.css`.

Env (Persona already filled):
```
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_CODE=bspkr
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_ID=279110
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE=
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_ID=
```

After copy:
```
npm install --legacy-peer-deps
npm run dev
```
