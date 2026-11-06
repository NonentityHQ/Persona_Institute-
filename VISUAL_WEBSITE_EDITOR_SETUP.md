# Persona Institute — Visual Website Editor

## What editors can do

- Open `/studio` and choose **Visual Website Editor** to preview the real site.
- In the preview, click Sanity-managed text or a marked card to jump to its exact document/field.
- Replace images in Sanity and use the image hotspot/focal-point editor to adjust crop and composition.
- Manage existing Book, Book Category, Book Offer, Offer, Reel, YouTube Video and Site Settings documents.
- Create `Website Cards & Content` documents for custom homepage tiles, About app cards, and Classplus course-card overrides.

This is Sanity's click-to-edit workflow, not a full Canva canvas. Text is edited in the focused Sanity field panel; images are replaced/cropped using Sanity's image field editor. Free-form pixel positioning and arbitrary drag-resizing are not included.

## Required environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` — create a **Viewer** token in Sanity Manage → API → Tokens. Keep it server-only.
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally; set the public production origin on Vercel.
- `NEXT_PUBLIC_SANITY_STUDIO_URL` — `/studio` for the embedded Studio.

Add both local and production website origins in Sanity Manage → API → CORS Origins, with **Allow credentials** enabled.

## Website Cards & Content document keys

Use these exact keys for the pre-wired cards:

### Homepage
- `home-live-courses`
- `home-vocabulary-book`
- `home-practice-book`
- `home-recorded-courses`
- `home-book-store`
- Homepage course overrides: Page = Homepage, Section = `course-card`, External Item ID = exact Classplus course ID. Create one per course you want to override.

Set Page = Homepage. The first four use Section = `what-you-want`; the last uses Section = `hero-feature`.

### Courses
Create one document per Classplus course. Set Page = Courses, Section = `course-card`, and **External Item ID** to the course ID shown by Classplus. Title, description, image, badge, price labels, features and button label override the live Classplus data. Leave fields blank to keep the Classplus value.

### About
- `about-persona-app`
- `about-khushi-app`

Set Page = About and Section = `app-card`. These override each app card's title, subtitle, description, image, badge, feature chips and primary link.

## Local preview

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000/studio`
4. Select **Visual Website Editor**.
5. Add/publish the card documents above.

For production, set the same environment variables in Vercel, deploy once to apply the code and environment changes, then add the Vercel domain as a Sanity CORS origin. After this initial deployment, publishing or editing content in Sanity does not require a Vercel redeploy: pages use `sanityFetch`/`defineLive` with `<SanityLive />` for live cache revalidation, with page-level ISR as a fallback. In `next-sanity` v13, published updates use stale-while-revalidate by default, so some visitors may briefly see the previous version until the background refresh completes. The Viewer token is needed for server-side Sanity reads and draft preview; keep it in Vercel environment variables and never prefix it with `NEXT_PUBLIC_`.


### Success Stories
Create one card per story. Set Page = Success Stories, Section = `review-card`, and External Item ID to one of:
- `review-rohit-sharma`
- `review-sneha-patel`
- `review-karan-malhotra`
- `review-pooja-mehta`
- `review-neha-gupta`
- `review-aman-singh`
- `review-priya-singh`
- `review-vivek-yadav`

Use Title for the learner name, Subtitle for role, Location for city, Description for quote, Badge for the course label, Eyebrow for the story title, Image for the video thumbnail and Secondary Image for the learner avatar.

### Contact cards and FAQs
Set Page = Contact:
- Contact info card External IDs: `contact-call`, `contact-whatsapp`, `contact-email`, `contact-office`
- FAQ External IDs: `faq-enroll`, `faq-demo`, `faq-course-choice`, `faq-refund`, `faq-offline`

For contact cards, Title changes the card label, Subtitle changes the office location line where applicable, and Description changes the helper text. Phone numbers, WhatsApp and email addresses continue to come from Site Settings → Contact.
For FAQ cards, Title is the question and Description is the answer.


**Image controls:** Image fields support upload, alt text and hotspot/focal-point crop. Site Cards also include `Image Fit` and `Image Position`. Existing Book documents have a cover hotspot plus an accessible alt-text field.


### Free Tests
Create one Website Cards & Content document per test. Set Page = Free Tests, Section = `test-card`, and External Item ID to the test ID:
- `demo-6th`, `demo-5th`, `demo-4th`, `demo-3rd`, `demo-2nd`, `demo-1st`
- `english-test-2026`, `grammar-practice`, `vocabulary-check`, `reading-comprehension`

Use Title for the test name, Badge for the test type, Subtitle for level, Location for category, Description for the card description, Price Text for question count, Old Price Text for duration in minutes, and Image for the card thumbnail. Button URL can override the default Classplus attempt link.


## Editor behavior

The preview uses Sanity Visual Editing overlays: click text/card content to focus the exact Sanity field; click an image to focus its image field, then replace it or adjust the hotspot. This is not a free-form Canva canvas: arbitrary pixel dragging/resizing is not enabled. Card order can be changed with the `Display Order` field.
