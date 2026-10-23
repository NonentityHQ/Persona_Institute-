'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CreditCard, MessageCircle, ShoppingBag, Search, Bell, ChevronDown, Menu, X, ClipboardList, UserRound, ChartNoAxesCombined } from 'lucide-react';

const navItems = [
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'Batches', href: '/batches', icon: GraduationCap },
  { label: 'Courses', href: '/courses', icon: ClipboardList },
  { label: 'Chats', href: '/chats', icon: MessageCircle },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Assignments', href: '/assignments', icon: ClipboardList },
  { label: 'Performance', href: '/performance', icon: ChartNoAxesCombined },
];

export default function PortalShell({ children, title = 'Learning Portal' }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const sidebar = <aside className="portal-sidebar">
    <Link href="/store" className="portal-brand"><Image src="/images/persona-logo.png" alt="Persona Institute" width={54} height={54} priority/><span><b><strong>Persona</strong> Institute</b><small>Learn · Practice · Grow</small></span></Link>
    <div className="portal-nav-label">LEARNING SPACE</div>
    <nav className="portal-nav">{navItems.map(({label,href,icon:Icon})=><Link key={label} href={href} onClick={()=>setMobileOpen(false)} className={`portal-nav-link ${active(href) ? 'active' : ''}`}><Icon size={19}/><span>{label}</span>{label==='Chats'&&<i className="portal-nav-dot"/>}</Link>)}</nav>
    <div className="portal-upgrade"><div className="portal-upgrade-art">🎓</div><b>Better Education<br/><em>Brighter Future</em></b><p>Connect with your institute and keep learning with Persona.</p><Link href="/store">Explore courses <span>→</span></Link></div>
    <div className="portal-sidebar-foot">© 2026 Persona Institute<br/><span>Learn with confidence.</span></div>
  </aside>;
  return <div className="portal-layout">
    {mobileOpen && <button className="portal-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <div className={`portal-sidebar-wrap ${mobileOpen?'open':''}`}>{sidebar}</div>
    <div className="portal-main-column">
      <header className="portal-topbar">
        <button className="portal-mobile-menu" aria-label="Open navigation" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button>
        <label className="portal-global-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for batches, courses, or topics..."/><kbd>Ctrl</kbd><kbd>K</kbd></label>
        <div className="portal-top-actions"><button className="portal-notification" aria-label="Notifications" onClick={()=>setNotice(notice ? '' : 'You are all caught up!')}><Bell size={20}/><i/></button><span className="portal-top-divider"/><div className="portal-user-wrap"><button className="portal-user" onClick={()=>setUserMenu(!userMenu)}><span className="portal-avatar">J</span><b>jatin</b><ChevronDown size={15}/></button>{userMenu&&<div className="portal-user-menu"><Link href="/profile" onClick={()=>setUserMenu(false)}><UserRound size={15}/> My profile</Link><button onClick={()=>{setUserMenu(false);setNotice('Demo account: sign out is not connected yet.')}}>Sign out</button></div>}</div></div>
        {notice && <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} className="portal-notice">{notice}</motion.div>}
      </header>
      <div className="portal-page-content" data-page-title={title}>{children}</div>
    </div>
  </div>;
}
