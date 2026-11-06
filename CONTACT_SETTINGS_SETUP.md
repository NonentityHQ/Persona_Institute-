# Contact details (Sanity)

The Contact page now reads its public contact details from the `siteSettings` document through `/api/contact-settings`.

In Sanity Studio, open **Site Settings → Contact** and set:

- **Primary Call Number**: `8719977802` (already used as the fallback)
- **Secondary Call Number**: enter the alternate number you want shown in the Call Us popup
- **WhatsApp Number**: `8719977802` (already used as the fallback)
- **Contact Email**: `Personaenglishknw@gmail.com` (already used as the fallback)
- **Contact Address**: update if the office address changes

Use Indian 10-digit numbers without spaces or `+91`; the website adds the country code for `tel:` and WhatsApp links. The Call Us card and other Call buttons open a chooser; tapping a number launches the device's phone handler. Published changes are refreshed through the API route (up to about 60 seconds of caching).
