import { NextResponse, type NextRequest } from 'next/server';
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client, projectId, dataset } from '@/lib/sanity/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const token = process.env.SANITY_API_READ_TOKEN;

const enableDraftMode = token
  ? defineEnableDraftMode({
      client: client.withConfig({
        projectId,
        dataset,
        token,
        useCdn: false,
      }),
    })
  : null;

export async function GET(request: NextRequest) {
  if (!projectId || projectId === 'placeholder') {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID on the deployed website.' },
      { status: 500 },
    );
  }

  if (!token) {
    // Published Sanity content can still be read from a public dataset without a token.
    // Only Presentation / Draft Mode needs a Viewer token. Do not turn that optional
    // preview feature into a site-wide runtime error when the token is not configured.
    const fallback = request.headers.get('referer') || new URL('/', request.url).toString();
    const target = new URL(fallback);
    target.searchParams.set('sanityPreview', 'unavailable');
    return NextResponse.redirect(target, 307);
  }

  if (!enableDraftMode) {
    return NextResponse.json({ error: 'Draft Mode handler could not be initialized.' }, { status: 500 });
  }

  // next-sanity enables Draft Mode by issuing a Next.js redirect. Redirects are
  // represented internally as NEXT_REDIRECT exceptions; do not catch them here.
  return enableDraftMode.GET(request);
}
