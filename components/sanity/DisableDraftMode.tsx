'use client';

import { useIsPresentationTool } from 'next-sanity/hooks';

export default function DisableDraftMode() {
  const inPresentation = useIsPresentationTool();
  if (inPresentation) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[10000000] rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-xl"
    >
      Exit preview
    </a>
  );
}
