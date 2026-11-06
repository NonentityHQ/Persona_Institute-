# Draft Mode + YouTube cache fix

## Sanity Draft Mode
- `next-sanity` enables Draft Mode by issuing a Next.js redirect (`NEXT_REDIRECT`).
- The API route no longer catches this framework redirect as an application error.
- The redirect now passes through normally so the browser can enter Draft Mode.

## YouTube channel lookup
- YouTube channel HTML can exceed Vercel's 2 MB Data Cache item limit.
- The channel HTML request now uses `cache: 'no-store'`.
- Only the extracted channel ID (a tiny string) is cached with `unstable_cache` for 24 hours.
- RSS feed requests retain their 30-minute revalidation interval.
