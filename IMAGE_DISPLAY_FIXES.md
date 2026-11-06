# Image and Contact Hero Fixes

- Rebuilt the Contact page hero as a responsive three-part composition.
- Split the transparent Ajay Sir portrait and Persona Institute mark into separate transparent PNG assets so the person and logo can be positioned independently.
- Added the orange halo, soft background waves, guidance card, and responsive mobile stacking.
- Removed forced cropping from portrait/product/logo placements that were being clipped: Contact guidance portrait, Contact lower CTA portrait, Contact office image, About/Contact mentor cutouts, course artwork, portal course artwork, brand logos, and the Success Stories CTA visual.
- Kept `object-cover` for true photo/video thumbnails and avatars where a filled crop is intentional.

Validation: modified TSX files passed TypeScript transpile syntax checks. A full Next.js production build was not run because dependencies were not available in the supplied archive and dependency installation timed out in this environment.
