# Persona Institute — Learning Portal UI

Light-theme Next.js 15 + React + Tailwind + Framer Motion prototype.

## Run locally

```bash
npm install
npm run dev
```

## Main routes

- `/login` — mobile/email identity screen and 4-digit OTP prototype; real SMS/email delivery needs an auth provider.
- `/dashboard` — learner overview.
- `/batches` — batches page matching the supplied reference, including empty state, zero metrics, search, sorting, Request To Join and Create Batch dialogs.
- `/payments`, `/chats`, `/store`, `/my-courses`, `/students`, `/schedule`, `/profile`, `/settings`, `/help` — shared light-theme portal with persistent sidebar.
- `/courses`, `/free-tests`, `/reviews`, `/about`, `/contact` — public learning site pages.

The original `public/images/persona-logo.png` is retained. The portal sidebar collapses into a mobile drawer on smaller screens. Current account data and OTP are demo-only; connect backend APIs before production use.

## Shared public navigation update

The public-facing Home, Courses, Free Tests, Success Stories, About, Contact, and Course Detail pages now use the shared `components/PublicHeader.tsx` component. This keeps the desktop navigation, mobile menu dropdown, active-link styling, logo, and login action consistent across those routes. Portal pages retain the logged-in sidebar navigation, and the login/OTP experience retains its dedicated authentication layout.
