# Persona Login Routing Update

## What changed
- Persona English now uses the standard Classplus web login URL, matching English with Khushi:
  `https://web.classplusapp.com/login?orgCode=bspkr`
- Removed the retired `https://login.personaenglish.in/login` runtime override from Persona's brand configuration.
- Free Tests "Attempt" fallback now points to the same standard Classplus URL.
- Existing `/login` entry points continue to open the two-brand chooser; selecting Persona or English with Khushi redirects to that brand's Classplus login using its own org code.
- Preserved the Success Stories brand-logo update from the immediately preceding project patch.

## Deployment note
The code no longer reads `NEXT_PUBLIC_CLASSPLUS_PERSONA_LOGIN_URL`. You may remove that old variable from Vercel Environment Variables to avoid confusion. Keep `NEXT_PUBLIC_CLASSPLUS_PERSONA_ORG_CODE=bspkr` and the Khushi org-code setting unchanged. Redeploy after pushing the update.

## Scope
No Sanity schema/content, course fetching, payments, Classplus org IDs, or non-login page behavior was intentionally changed.
