"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import TransitionLink from "@/components/motion/TransitionLink";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { DUR, EASE_IN_OUT } from "@/lib/motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Free Tests", href: "/free-tests" },
  { label: "Success Stories", href: "/reviews" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type Props = { active?: string; className?: string };

/**
 * One shared public-site navigation, mounted once by app/(public)/layout.tsx.
 * Because it persists across routes, the active-tab pill (layoutId) glides
 * between tabs instead of being redrawn on every page.
 */
export default function PublicHeader({ active, className = "" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => active !== undefined
    ? active === href
    : href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Close the mobile menu on any route change (including browser back/forward).
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 border-b border-orange-100/70 bg-white/95 ${className}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-10">
        <TransitionLink href="/" aria-label="Persona Institute home" className="flex min-w-0 shrink-0 items-center gap-2.5">
          {/* Same official logo file; next/image serves a ~44px WebP instead of decoding the 1.3MB PNG. */}
          <Image src="/images/persona-logo.png" alt="Persona Institute logo" width={44} height={44} priority className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="min-w-0 leading-tight">
            <strong className="block truncate text-[15px] font-extrabold tracking-tight text-[#102d70] sm:text-xl">Persona Institute</strong>
            <span className="block text-[10px] font-medium text-[#284b8e] sm:text-xs">Learn · Practice · Grow</span>
          </span>
        </TransitionLink>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full bg-white px-2 py-1 shadow-[0_3px_24px_rgba(16,39,91,.08)] lg:flex">
          {links.map(({ label, href }) => {
            const on = isActive(href);
            return (
              <TransitionLink key={href} href={href} aria-current={on ? "page" : undefined}
                className={`nav-link-pill rounded-full px-3 py-2 text-sm transition-colors duration-200 ${on ? "font-semibold text-[#f04422]" : "text-[#23417e] hover:bg-orange-50 hover:text-orange-600"}`}>
                {on && <m.span layoutId="public-nav-pill" className="nav-pill" style={{ borderRadius: 9999 }} transition={{ duration: DUR.routeEnter, ease: EASE_IN_OUT }} />}
                {label}
              </TransitionLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <TransitionLink href="/courses" aria-label="Search courses" className="grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white text-[#23417e] shadow-sm transition-colors hover:bg-orange-50 sm:h-10 sm:w-10"><Search size={18} /></TransitionLink>
          <TransitionLink href="/login" className="hidden rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:inline-flex sm:px-5 sm:py-3">Login / Sign Up</TransitionLink>
          <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="public-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#173879] transition-colors hover:bg-orange-50 lg:hidden">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {menuOpen && <nav id="public-mobile-menu" aria-label="Mobile navigation" className="story-mobile-menu mx-3 mb-3 grid gap-1 rounded-2xl border border-orange-100 bg-white p-3 shadow-[0_16px_40px_rgba(16,45,112,.16)] lg:hidden sm:mx-5">
        {links.map(({ label, href }) => <TransitionLink key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={isActive(href) ? "page" : undefined}
          className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive(href) ? "bg-orange-50 text-[#f04422]" : "text-[#23417e] hover:bg-orange-50 hover:text-[#f04422]"}`}>
          <span>{label}</span><ArrowRight size={15} />
        </TransitionLink>)}
        <TransitionLink href="/login" onClick={() => setMenuOpen(false)} className="mt-1 rounded-xl bg-gradient-to-r from-[#ff1744] to-[#ff4b18] px-4 py-3 text-center text-sm font-bold text-white">Login / Sign Up</TransitionLink>
      </nav>}
      <ScrollProgress />
    </header>
  );
}
