# Deploy — DNS + Environment Variables only

No secrets or org codes in the website UI. Set everything in the host (Vercel / server).

## Required env (Production)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Persona English (known live values — can override)
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_CODE=bspkr
NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_ID=279110
# optional overrides:
# NEXT_PUBLIC_CLASSPLUS_PERSONA_LOGIN_URL=https://login.personaenglish.in/login
# NEXT_PUBLIC_CLASSPLUS_PERSONA_STORE_URL=https://www.personaenglish.in

# English with Khushi — ONLY from env (empty = brand hidden from Classplus fetch)
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE=
NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_ID=
# optional:
# NEXT_PUBLIC_CLASSPLUS_KHUSHI_LOGIN_URL=
# NEXT_PUBLIC_CLASSPLUS_KHUSHI_STORE_URL=
```

## After setting Khushi org

1. Add `NEXT_PUBLIC_CLASSPLUS_KHUSHI_ORG_CODE` + `_ORG_ID`
2. Redeploy (NEXT_PUBLIC_* are build-time)
3. `/courses` will list Khushi courses too
4. Login modal will enable Khushi card

## DNS

Point domain A/CNAME to your host (Vercel).

## Sanity CORS

Add production origin: `https://your-domain.com`

## What is live

- `/courses` → Classplus preview API (Persona + Khushi if env set)
- Enroll → Classplus store / personaenglish.in course URL
- Login → dual brand → Classplus login (org from env)
- Offers / Reels / YouTube / Hero image → Sanity
