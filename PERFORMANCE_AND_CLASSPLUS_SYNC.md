# Performance and Classplus sync update

- Restored the Classplus-provided course image for each course card. The English with Khushi logo remains in app selector / app identity locations only.
- Re-enabled Next.js image optimization for remote Classplus course thumbnails.
- Classplus course API responses and course listing/detail routes revalidate every 60 seconds. A Classplus change should normally appear on the website within about one minute, subject to Vercel ISR/cache refresh and Classplus publishing the change to its public preview API.
- YouTube cards render lightweight thumbnails first; an iframe is mounted only after the visitor presses Play. This avoids loading multiple YouTube players on initial page load.
- No course names, prices, descriptions, enrollment URLs, or Classplus data source were replaced with static content.
