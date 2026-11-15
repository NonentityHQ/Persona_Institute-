import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Award, BookOpen, Laptop, Layers3, MapPin, Users,
} from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Courses', href: '/courses' },
  { label: 'Book Store', href: '/book-store' },
  { label: 'Free Tests', href: '/free-tests' },
  { label: 'Success Stories', href: '/reviews' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const courseLinks = [
  { label: 'Persona English', href: '/courses' },
  { label: 'English with Khushi', href: '/courses' },
  { label: 'Spoken English', href: '/courses' },
  { label: 'Grammar & Vocabulary', href: '/courses' },
  { label: 'Practice Tests', href: '/free-tests' },
  { label: 'Study Books', href: '/book-store' },
];

const trustItems = [
  { icon: Users, value: '50,000+', label: 'Happy Learners' },
  { icon: Award, value: '8+', label: 'Years of Experience' },
  { icon: Laptop, value: 'Expert', label: 'Learning Guidance' },
  { icon: Layers3, value: 'Quality', label: 'Study Material' },
];

function SocialMark({ type }: { type: 'instagram' | 'youtube' | 'whatsapp' }) {
  if (type === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>;
  if (type === 'youtube') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.6 1 1-3.5-.2-.4A9.7 9.7 0 1 1 12 21Zm5.3-7.3c-.3-.2-1.7-.9-2-.9s-.5-.2-.7.2-.8.9-1 1.1-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.2-.5-.1-.5-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2 3.1 4.8 4.3c.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4s-.2-.3-.5-.4Z"/></svg>;
}

export default function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#0b1835] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_10%,rgba(42,86,164,.30),transparent_42%),radial-gradient(ellipse_at_88%_80%,rgba(221,30,91,.18),transparent_38%)]" />
      <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-9 sm:px-8 sm:pt-12 lg:px-10">
        <div className="relative mb-10 grid gap-5 overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(112deg,#fff0f6_0%,#fffafd_48%,#fff0e9_100%)] px-5 py-6 text-[#10285b] shadow-[0_18px_48px_rgba(3,12,35,.24)] sm:grid-cols-[116px_1fr_auto] sm:items-center sm:gap-7 sm:px-8 sm:py-7">
          <div aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#f8c7d6]/30 blur-3xl" />
          <div className="relative flex h-[100px] w-[112px] items-center justify-center rounded-[24px] border border-white bg-white/75 shadow-[inset_0_1px_0_white,0_8px_24px_rgba(29,58,111,.08)]">
            <Image src="/images/persona-books-display.webp" alt="" width={150} height={130} className="h-[94px] w-[104px] object-contain" />
          </div>
          <div className="relative min-w-0">
            <span className="mb-2 inline-flex rounded-full border border-[#f5b4c6] bg-white/85 px-3 py-1 text-[10px] font-black uppercase tracking-[.15em] text-[#d91e4e] sm:text-[11px]">
              Continue your learning
            </span>
            <h2 className="text-[22px] font-black leading-[1.13] tracking-tight sm:text-[clamp(23px,2.2vw,31px)]">
              Start Your English Learning Journey Today
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#40577f] sm:text-[15px]">
              Build confidence, fluency and better communication with Persona Institute.
            </p>
          </div>
          <Link href="/courses" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f22d59] to-[#d90d3d] px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(217,13,61,.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(217,13,61,.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Explore Courses <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-9 border-b border-white/15 pb-9 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_1fr_1.1fr] lg:gap-8">
          <div className="min-w-0">
            <Link href="/" aria-label="Persona Institute home" className="inline-flex items-center gap-3">
              <Image src="/images/persona-logo-contact.webp" alt="Persona Institute logo" width={104} height={104} className="h-[86px] w-[86px] shrink-0 object-contain drop-shadow-[0_5px_12px_rgba(0,0,0,.22)] sm:h-[96px] sm:w-[96px]" />
              <span className="leading-[1.05]">
                <strong className="block text-[25px] font-black tracking-tight text-white sm:text-[29px]">Persona</strong>
                <span className="mt-1 block text-[21px] font-light tracking-wide text-slate-200 sm:text-[24px]">Institute</span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.19em] text-blue-200">Learn · Practice · Grow</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[310px] text-sm leading-6 text-slate-300">
              India’s trusted platform to learn, practise and speak English with confidence.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/personaenglish/" target="_blank" rel="noopener noreferrer" aria-label="Persona Institute on Instagram" className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#f77737] text-white shadow-lg shadow-pink-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="instagram" /></a>
              <a href="https://www.youtube.com/@PersonaInstituteForEnglish" target="_blank" rel="noopener noreferrer" aria-label="Persona Institute on YouTube" className="grid h-11 w-11 place-items-center rounded-xl bg-[#ff0033] text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="youtube" /></a>
              <a href="https://wa.me/918719977802" target="_blank" rel="noopener noreferrer" aria-label="Chat with Persona Institute on WhatsApp" className="grid h-11 w-11 place-items-center rounded-xl bg-[#20c66b] text-white shadow-lg shadow-green-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="whatsapp" /></a>
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Quick Links</h3>
            <ul className="space-y-2.5">{quickLinks.map((item) => <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
          </nav>

          <nav aria-label="Footer learning links">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Learn With Us</h3>
            <ul className="space-y-2.5">{courseLinks.map((item) => <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
          </nav>

          <div>
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Need Help?</h3>
            <p className="max-w-[280px] text-sm leading-6 text-slate-300">Have a question about courses, enrolment or learning resources? Our team can help.</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-pink-300">Contact Support <ArrowRight size={15} /></Link>
            <a href="https://maps.google.com/?q=01%2C%20Jai%20Bajrang%20Nagar%2C%20near%20Gangrade%20Dharmshala%2C%20Kasal%20Pura%2C%20Khandwa%2C%20Madhya%20Pradesh%20450001" target="_blank" rel="noopener noreferrer" className="mt-4 grid grid-cols-[20px_minmax(0,1fr)] items-start gap-3 text-sm leading-6 text-slate-300 transition-colors hover:text-white">
              <MapPin size={19} className="mt-[3px] text-pink-300" />
              <span className="min-w-0 break-words">01, Jai Bajrang Nagar, near Gangrade Dharmshala, Kasal Pura, Khandwa, Madhya Pradesh 450001</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 border-b border-white/15 py-8 sm:grid-cols-4 sm:gap-4">
          {trustItems.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 sm:justify-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-pink-300/20 bg-gradient-to-br from-[#a82c68] to-[#592d79] text-white shadow-[0_8px_20px_rgba(207,28,91,.18)]"><Icon size={21} strokeWidth={1.8} /></span>
              <span className="min-w-0"><strong className="block text-base font-black leading-tight sm:text-lg">{value}</strong><span className="mt-1 block text-xs leading-4 text-slate-300 sm:text-sm">{label}</span></span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} Persona Institute. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
            <Link href="/about" className="transition-colors hover:text-white">About</Link>
            <Link href="/courses" className="transition-colors hover:text-white">Courses</Link>
            <Link href="/book-store" className="transition-colors hover:text-white">Book Store</Link>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-2 bg-gradient-to-r from-[#244b91] via-[#a72d78] to-[#f02d59]" />
    </footer>
  );
}
