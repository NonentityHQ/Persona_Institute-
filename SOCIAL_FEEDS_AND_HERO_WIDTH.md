# Hero width and social feed update

## Hero width
- All public page hero sections (About, Courses, Free Tests, Success Stories, Contact) are full-width.
- Backgrounds use `cover` so an intrinsic image ratio cannot leave a blank strip at the viewport edge.
- Existing copy, card content and layout have not been rewritten.

## YouTube latest uploads and Shorts
- The homepage now reads the public YouTube RSS feeds for Persona Institute For English and English with Khushi.
- The channel feeds are merged by publish date and refreshed through Next.js fetch revalidation (30 minutes).
- If YouTube's public feed is unavailable, published YouTube documents in Sanity are used as fallback. If both sources are empty, the page shows direct links to both channels instead of fabricated video cards.

## Instagram Reels
- The verified public Instagram profile used by the site is `https://www.instagram.com/personaenglish/`.
- Instagram does not provide an unrestricted public latest-Reels feed for a website. The website therefore displays real Reel documents entered in Sanity, sorted by most recently updated, and links to the official profile when no Reel documents are published.
- To show the latest actual Reel cards, add each Reel's real thumbnail and Instagram post URL in Sanity. No sample/fabricated Reel cards are shown.
- A second Instagram handle was not present in the supplied project or verifiable public sources; add it to the site once the owner supplies the exact profile URL.
