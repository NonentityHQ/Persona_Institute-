'use client';

/**
 * Embedded Sanity Studio at /studio
 * After setting NEXT_PUBLIC_SANITY_PROJECT_ID, run:
 *   npm run sanity
 * or open /studio in the browser once deps are installed.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
