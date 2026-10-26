import PublicHeader from '@/components/PublicHeader';

/** Persistent public chrome: the header never remounts between public routes,
 *  so the active-tab pill can glide from one tab to the next. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><PublicHeader />{children}</>;
}
