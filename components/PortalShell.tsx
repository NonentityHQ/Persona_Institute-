'use client';
import Image from 'next/image';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'framer-motion';
import { GraduationCap, CreditCard, MessageCircle, ShoppingBag, Search, Bell, ChevronDown, Menu, X, ClipboardList, UserRound, ChartNoAxesCombined } from 'lucide-react';
import TransitionLink from '@/components/motion/TransitionLink';
import { DUR, EASE_IN_OUT, EASE_OUT } from '@/lib/motion';

const navItems = [
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'Batches', href: '/batches', icon: GraduationCap },
  { label: 'Courses', href: '/courses', icon: ClipboardList },
  { label: 'Chats', href: '/chats', icon: MessageCircle },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Assignments', href: '/assignments', icon: ClipboardList },
  { label: 'Performance', href: '/performance', icon: ChartNoAxesCombined },
];

const FrameContext = createContext(false);

/**
 * Persistent learner-portal chrome, mounted once by app/(portal)/layout.tsx.
 * Sidebar, topbar, search text and mobile-drawer state survive navigation, and
 * the active-item highlight (layoutId) glides from one entry to the next.
 */
export function PortalFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const title = navItems.find((n) => active(n.href))?.label ?? 'Learning Portal';

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [pathname]);

  const sidebar = (
    <aside className="portal-sidebar">
      <TransitionLink href="/store" className="portal-brand">
        <Image src="/images/persona-logo.png" alt="Persona Institute" width={54} height={54} priority />
        <span><b><strong>Persona</strong> Institute</b><small>Learn · Practice · Grow</small></span>
      </TransitionLink>
      <div className="portal-nav-label">LEARNING SPACE</div>
      <nav className="portal-nav">
        {navItems.map(({ label, href, icon: Icon }) => {
          const on = active(href);
          return (
            <TransitionLink key={label} href={href} onClick={() => setMobileOpen(false)} aria-current={on ? 'page' : undefined} className={`portal-nav-link ${on ? 'active' : ''}`}>
              {on && <m.span layoutId="portal-nav-pill" className="nav-pill-portal" style={{ borderRadius: 13 }} transition={{ duration: DUR.routeEnter, ease: EASE_IN_OUT }} />}
              <Icon size={19} /><span>{label}</span>{label === 'Chats' && <i className="portal-nav-dot" />}
            </TransitionLink>
          );
        })}
      </nav>
      <div className="portal-upgrade">
        <div className="portal-upgrade-art">🎓</div>
        <b>Better Education<br /><em>Brighter Future</em></b>
        <p>Connect with your institute and keep learning with Persona.</p>
        <TransitionLink href="/store">Explore courses <span>→</span></TransitionLink>
      </div>
      <div className="portal-sidebar-foot">© 2026 Persona Institute<br /><span>Learn with confidence.</span></div>
    </aside>
  );

  return (
    <FrameContext.Provider value>
      <div className="portal-layout">
        {mobileOpen && <button className="portal-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
        <div className={`portal-sidebar-wrap ${mobileOpen ? 'open' : ''}`}>{sidebar}</div>
        <div className="portal-main-column">
          <header className="portal-topbar">
            <button className="portal-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
            <label className="portal-global-search"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for batches, courses, or topics..." /><kbd>Ctrl</kbd><kbd>K</kbd></label>
            <div className="portal-top-actions">
              <button className="portal-notification" aria-label="Notifications" onClick={() => setNotice(notice ? '' : 'You are all caught up!')}><Bell size={20} /><i /></button>
              <span className="portal-top-divider" />
              <div className="portal-user-wrap">
                <button className="portal-user" onClick={() => setUserMenu(!userMenu)} aria-expanded={userMenu}><span className="portal-avatar">J</span><b>jatin</b><ChevronDown size={15} /></button>
                <AnimatePresence>
                  {userMenu && (
                    <m.div key="user-menu" className="portal-user-menu"
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: DUR.hover, ease: EASE_OUT }}>
                      <TransitionLink href="/profile" onClick={() => setUserMenu(false)}><UserRound size={15} /> My profile</TransitionLink>
                      <button onClick={() => { setUserMenu(false); setNotice('Demo account: sign out is not connected yet.'); }}>Sign out</button>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence>
              {notice && (
                <m.div key="notice" className="portal-notice" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: DUR.hover, ease: EASE_OUT }}>{notice}</m.div>
              )}
            </AnimatePresence>
          </header>
          <div className="portal-page-content" data-page-title={title}>{children}</div>
        </div>
      </div>
    </FrameContext.Provider>
  );
}

/**
 * Pages still wrap their content in <PortalShell>. Inside the persistent frame this is a
 * pass-through (so pages need no changes); outside it, it falls back to a full frame.
 */
export default function PortalShell({ children }: { children: ReactNode; title?: string }) {
  const inFrame = useContext(FrameContext);
  return inFrame ? <>{children}</> : <PortalFrame>{children}</PortalFrame>;
}
