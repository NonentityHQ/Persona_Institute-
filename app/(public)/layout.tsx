import PublicHeader from '@/components/PublicHeader';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SanityLive } from '@/lib/sanity/live';
import DisableDraftMode from '@/components/sanity/DisableDraftMode';

/** Persistent public chrome: the header never remounts between public routes,
 *  so the active-tab pill can glide from one tab to the next. */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled;
  const liveEnabled = Boolean(process.env.SANITY_API_READ_TOKEN);
  return (
    <>
      <PublicHeader />
      <div className="h-16 lg:h-[4.25rem]" aria-hidden="true" />
      <div className="pb-20 lg:pb-0">{children}</div>
      {liveEnabled ? <SanityLive /> : null}
      {isDraftMode ? <><VisualEditing /><DisableDraftMode /></> : null}
    </>
  );
}
