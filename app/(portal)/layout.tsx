import { PortalFrame } from '@/components/PortalShell';

/** Persistent learner portal chrome (sidebar + topbar). Pages render content only. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalFrame>{children}</PortalFrame>;
}
