# Persona Institute Frontend (starter)

Frontend-only Next.js App Router project based on the supplied Persona Institute homepage reference. It uses TypeScript, Tailwind CSS, Framer Motion and Lucide icons. All current course and video content is demo data.

## Run locally

1. Install Node.js 20.9+.
2. From this directory run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.
4. Run `npm run build` before deployment.

## Current interactions

- Responsive nav and mobile menu
- Course cards, search modal, enrollment/checkout preview, login preview
- Hero video and free-test preview modal
- Offer CTA and section navigation
- Scroll reveals, hover lift/tilt, image zoom and reduced-motion support

Demo-only buttons explicitly say that auth, payment, video and assessment APIs are not connected. Do not accept real payments or credentials in this preview.

## API integration plan (when endpoints are supplied)

Keep endpoint calls in a dedicated `lib/api/` layer; do not fetch directly from every UI component. Recommended future modules:

- `lib/api/client.ts`: base URL, typed fetch wrapper, timeout/error handling, auth headers
- `lib/api/courses.ts`: list, detail, categories and pricing
- `lib/api/auth.ts`: login, signup, session and logout
- `lib/api/tests.ts`: free tests and results
- `lib/api/videos.ts`: lesson/video metadata
- `lib/api/offers.ts`: active offers and expiry

Suggested environment variable: `NEXT_PUBLIC_API_BASE_URL`. Public values only belong in `NEXT_PUBLIC_*`; private secrets must remain server-side. Replace the demo arrays in `lib/data.ts` with typed API calls once backend contracts are available. Use loading, empty and error states per section, and avoid hardcoding prices, countdowns or offer validity in production.

## Deployment

For a public marketing site with SEO-friendly course detail pages, deploy on Vercel or another Next.js-compatible host. The eventual API can be hosted separately. Image assets should ultimately use approved/licensed institute images rather than generic demo stock photos.

A typed API client scaffold lives in `lib/api/client.ts` and `lib/api/courses.ts`. The `/courses` endpoint and response shape are placeholders—not assumed to be your real backend contract. Once you share the API documentation or sample responses, wire the actual endpoints and loading/error states without changing the visual components.


## Demo data and images
- The homepage uses locally bundled crops from the supplied Persona Institute design for the hero poster and course/video thumbnails.
- Course prices are provisional frontend demo values only: Persona English ₹3,150, English with Khushi ₹1,999, Vocabulary Booster ₹499 (demo discount ₹799), and Free Tests free.
- Confirm all prices, offer validity, and course names with Persona Institute before launch. Backend API data should replace these demo values when endpoints are provided.
- The hero photo is a poster image, not a playable lesson video yet. The play interaction currently opens the demo modal.
- This starter intentionally keeps the experience on the homepage; course titles do not navigate to a course-detail page.
