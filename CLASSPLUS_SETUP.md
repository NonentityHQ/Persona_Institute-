# Classplus dual-brand setup (Persona English + English with Khushi)

## Will this work?

**Yes** — same model Civil Brains uses:

1. Custom marketing website (this Next.js app)
2. Course details via Classplus **public preview GET** (when `orgId` is set)
3. Buy / enroll → `https://{orgCode}.courses.store/{courseId}`
4. Login → `https://web.classplusapp.com/login?orgCode={orgCode}`

Classplus support’s guidance (show courses on your site, redirect on click) matches this.

## What to get from the client

For **each** brand (Persona English and English with Khushi):

| Field | Example | Where |
|-------|---------|--------|
| Org code | `yfqxv` | Store URL `https://yfqxv.courses.store` or app org code |
| Org ID (number) | `295515` | Optional; needed for live course API. Can be read from store network tab (`orgId` in preview token) |

## Env

```env
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_CODE=xxxx
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_ID=123456
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE=yyyy
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_ID=789012
```

## UI already wired

- **Header Login** → opens popup: Persona English | English with Khushi
- **`/login` page** → same two choices, full page
- Each choice redirects to that brand’s Classplus web login
- Until org codes are set, cards show “Org code pending”

## Courses

- With `orgId`: server fetches live list from Classplus preview API
- Without: site uses fallback/static data from `lib/data.ts`
- Offers / Reels still from Sanity

## Confirm with Classplus (one line)

> We will display course name, price and image from the public store preview API and redirect users to `{orgCode}.courses.store` for purchase and to `web.classplusapp.com/login?orgCode=` for login. Please confirm this is allowed for our two orgs.

