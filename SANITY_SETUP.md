# Persona Institute — Sanity CMS Setup

Marketing content (offers, Instagram reels, hero copy) is managed from **Sanity**.  
Course list & prices continue to come from **Classplus** (or the local `lib/data.ts` until the Classplus API is wired).

---

## 1. Create a free Sanity project

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage) and sign up / log in.
2. **Create project** → name it `persona-institute` (or anything).
3. Choose dataset `production`.
4. Copy the **Project ID**.

## 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx   # paste Project ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 3. Install & run

```bash
npm install
npm run dev
```

Open:

- Website: http://localhost:3000  
- Sanity Studio (embedded): http://localhost:3000/studio  

First time Studio may ask you to log in with the same Sanity account.

## 4. Content you can edit from the dashboard

| Document type        | What it controls                                      |
|----------------------|-------------------------------------------------------|
| **Special Offer Card** | Offer banner: badge, title, price, countdown, CTA, image, handwritten note |
| **Instagram Reel**   | Reels carousel: thumbnail, title, category, duration, Instagram / video link |
| **Site Settings**    | Hero eyebrow, rotating words, subtitle, learners count, section titles |

### Recommended workflow

1. Create **one** `Site Settings` document and fill hero + section labels.
2. Create 1 active **Special Offer Card** (set `Active = true`). Use a real end datetime for the countdown.
3. Create 6–12 **Instagram Reel** documents. Prefer **portrait (9:16)** thumbnails. Set `order` so the sequence feels right. Paste Instagram Reel links so cards open the real post.
4. Turn `Active` off on old offers/reels instead of deleting — you can bring them back for the next campaign.

## 5. Classplus (courses & prices)

Courses currently render from `lib/data.ts`. When Classplus API credentials are ready:

- Keep using `lib/api/courses.ts` (`getCourses`, `getCourseBySlug`).
- Replace the static import in `HomePageClient` / courses page with the API response.
- Offer cards and reels stay in Sanity — do **not** put Classplus product IDs into Sanity unless you need a marketing overlay on top of a specific course.

## 6. Image tips

- Offer image: square or landscape, ~800px wide.
- Reel thumbnails: **9:16 portrait**, at least 720×1280. Hotspot helps crop focus.
- Images are served from `cdn.sanity.io` (already allowed in `next.config.ts`).

## 7. Best practices (Sanity side)

- **Singleton for Site Settings**: In Studio structure you can pin a single “Site Settings” document so editors don’t create duplicates.
- **Preview**: Later you can add Presentation tool + draft tokens for live preview before publish.
- **Roles**: Invite content editors with Editor role only — keep Admin for developers.
- **Webhooks / on-demand revalidation**: When traffic grows, add a Sanity webhook that hits `/api/revalidate` so offer changes appear instantly instead of waiting for the 60s ISR window (`revalidate = 60` on the home page).

## 8. What stays code-only (not Sanity)

- Portal / student dashboard UI
- Auth & OTP flow
- Classplus enrollment & payments
- Framer Motion animations (Grow Carousel behaviour is coded; only the **data** for each reel is in Sanity)

---

After content is published in Studio, refresh the homepage — the offer banner and reels section update automatically.
EOF


## 9. Vercel token and Preview Mode

- For a **public** Sanity dataset, published content can be fetched without `SANITY_API_READ_TOKEN`.
- `SANITY_API_READ_TOKEN` is required only to use Sanity Presentation / Draft Mode, or to read from a **private** dataset.
- To enable Preview Mode: open Sanity Manage → your project → API → Tokens → create a **Viewer** token. Add it in Vercel → Project → Settings → Environment Variables as `SANITY_API_READ_TOKEN` for Production (and Preview if needed), then redeploy.
- Keep this token server-only. Do not prefix it with `NEXT_PUBLIC_`, and never commit the real token into Git.
- If the token is absent, the Draft Mode endpoint now returns visitors to the published site instead of throwing a 500 error. Preview mode remains unavailable until the token is configured.
