import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, MapPin,
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

function SocialMark({ type }: { type: 'instagram' | 'youtube' | 'whatsapp' }) {
  if (type === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>;
  if (type === 'youtube') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.6 1 1-3.5-.2-.4A9.7 9.7 0 1 1 12 21Zm5.3-7.3c-.3-.2-1.7-.9-2-.9s-.5-.2-.7.2-.8.9-1 1.1-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.2-.5-.1-.5-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2 3.1 4.8 4.3c.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4s-.2-.3-.5-.4Z"/></svg>;
}

export default function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#0b1835] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_10%,rgba(42,86,164,.30),transparent_42%),radial-gradient(ellipse_at_88%_80%,rgba(221,30,91,.18),transparent_38%)]" />
      <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 border-b border-white/15 pb-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.2fr_.8fr_1fr_1.1fr] lg:gap-8">
          <div className="col-span-2 min-w-0 text-center lg:col-span-1 lg:text-left">
            <Link href="/" aria-label="Persona Institute home" className="inline-flex items-center justify-center lg:justify-start">
              <Image src="/images/persona-logo.webp" alt="Persona Institute" width={340} height={150} className="mx-auto h-[112px] w-auto max-w-[290px] object-contain object-center drop-shadow-[0_5px_14px_rgba(0,0,0,.28)] sm:h-[126px] sm:max-w-[320px] lg:mx-0 lg:object-left" priority={false} />
            </Link>
            <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-slate-300 lg:mx-0">
              India’s trusted platform to learn, practise and speak English with confidence.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="https://www.instagram.com/personaenglish/" target="_blank" rel="noopener noreferrer" aria-label="Persona Institute on Instagram" className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#f77737] text-white shadow-lg shadow-pink-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="instagram" /></a>
              <a href="https://www.youtube.com/@PersonaInstituteForEnglish" target="_blank" rel="noopener noreferrer" aria-label="Persona Institute on YouTube" className="grid h-11 w-11 place-items-center rounded-xl bg-[#ff0033] text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="youtube" /></a>
              <a href="https://wa.me/918719977802" target="_blank" rel="noopener noreferrer" aria-label="Chat with Persona Institute on WhatsApp" className="grid h-11 w-11 place-items-center rounded-xl bg-[#20c66b] text-white shadow-lg shadow-green-950/20 transition hover:-translate-y-1 hover:brightness-110"><SocialMark type="whatsapp" /></a>
            </div>
          </div>

          <nav aria-label="Footer quick links" className="min-w-0">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Quick Links</h3>
            <ul className="space-y-2.5">{quickLinks.map((item) => <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
          </nav>

          <nav aria-label="Footer learning links" className="min-w-0">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Learn With Us</h3>
            <ul className="space-y-2.5">{courseLinks.map((item) => <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
          </nav>

          <div className="col-span-2 min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Need Help?</h3>
            <p className="max-w-[280px] text-sm leading-6 text-slate-300">Have a question about courses, enrolment or learning resources? Our team can help.</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-pink-300">Contact Support <ArrowRight size={15} /></Link>
            <a href="https://maps.google.com/?q=01%2C%20Jai%20Bajrang%20Nagar%2C%20near%20Gangrade%20Dharmshala%2C%20Kasal%20Pura%2C%20Khandwa%2C%20Madhya%20Pradesh%20450001" target="_blank" rel="noopener noreferrer" className="mt-4 grid grid-cols-[20px_minmax(0,1fr)] items-start gap-3 text-sm leading-6 text-slate-300 transition-colors hover:text-white">
              <MapPin size={19} className="mt-[3px] text-pink-300" />
              <span className="min-w-0 break-words">01, Jai Bajrang Nagar, near Gangrade Dharmshala, Kasal Pura, Khandwa, Madhya Pradesh 450001</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-center text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:text-left sm:text-sm">
          <p>© {new Date().getFullYear()} Persona Institute. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
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
