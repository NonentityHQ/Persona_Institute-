import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Award, BookOpen, BookOpenCheck, GraduationCap, Laptop,
  Layers3, MapPin, MessageCircle, Users, Youtube,
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

export default function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#0c1937] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_10%,rgba(42,86,164,.28),transparent_42%),radial-gradient(ellipse_at_88%_80%,rgba(221,30,91,.16),transparent_38%)]" />

      <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <div className="mb-10 grid gap-6 overflow-hidden rounded-[26px] border border-white/60 bg-gradient-to-r from-[#fff0f6] via-[#fff7fa] to-[#fff1ed] px-5 py-6 text-[#10285b] shadow-[0_18px_50px_rgba(4,16,45,.16)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-7 sm:px-8 sm:py-7">
          <div className="hidden h-[94px] w-[100px] items-center justify-center rounded-2xl bg-white/70 text-[#244b91] sm:flex">
            <GraduationCap size={66} strokeWidth={1.55} />
          </div>
          <div className="min-w-0">
            <span className="mb-2 inline-flex rounded-full border border-[#f7b9ca] bg-white/75 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#d91e4e]">
              Continue your learning
            </span>
            <h2 className="text-xl font-black leading-tight tracking-tight sm:text-[clamp(21px,2.4vw,30px)]">
              Start Your English Learning Journey Today
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#38517f] sm:text-[15px]">
              Join learners building confidence, fluency and better communication with Persona Institute.
            </p>
          </div>
          <Link href="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f22d59] to-[#d90d3d] px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(217,13,61,.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(217,13,61,.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Explore Courses <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-9 border-b border-white/20 pb-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_.8fr_1fr_1.05fr] lg:gap-8">
          <div className="min-w-0">
            <Link href="/" aria-label="Persona Institute home" className="inline-flex items-center gap-3">
              <Image src="/images/persona-logo.webp" alt="Persona Institute" width={220} height={72} className="h-[58px] w-auto object-contain object-left" />
            </Link>
            <p className="mt-4 max-w-[300px] text-sm leading-6 text-slate-300">
              India’s trusted platform to learn, practise and speak English with confidence.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a href="https://wa.me/918719977802" target="_blank" rel="noopener noreferrer" aria-label="Chat with Persona Institute on WhatsApp" className="grid h-10 w-10 place-items-center rounded-xl bg-[#18b967] text-white transition hover:-translate-y-1 hover:brightness-110">
                <MessageCircle size={20} />
              </a>
              <Link href="/courses" aria-label="Explore video courses" className="grid h-10 w-10 place-items-center rounded-xl bg-[#e62b4e] text-white transition hover:-translate-y-1 hover:brightness-110">
                <Youtube size={20} />
              </Link>
              <Link href="/book-store" aria-label="Explore Persona books" className="grid h-10 w-10 place-items-center rounded-xl bg-[#2588d9] text-white transition hover:-translate-y-1 hover:brightness-110">
                <BookOpen size={20} />
              </Link>
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer learning links">
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Learn With Us</h3>
            <ul className="space-y-2.5">
              {courseLinks.map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-base font-extrabold tracking-tight text-white">Need Help?</h3>
            <p className="max-w-[260px] text-sm leading-6 text-slate-300">
              Have a question about courses, enrolment or learning resources? Our team can help.
            </p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-pink-300">
              Contact Support <ArrowRight size={15} />
            </Link>
            <a href="https://wa.me/918719977802" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-start gap-2.5 text-sm leading-6 text-slate-300 transition-colors hover:text-white">
              <MapPin size={18} className="mt-1 shrink-0 text-pink-300" />
              <span>01, Jai Bajrang Nagar, near Gangrade Dharmshala, Kasal Pura, Khandwa, Madhya Pradesh 450001</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 border-b border-white/20 py-8 sm:grid-cols-4 sm:gap-4">
          {trustItems.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 sm:justify-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-pink-300/20 bg-gradient-to-br from-[#a82c68] to-[#592d79] text-white shadow-[0_8px_20px_rgba(207,28,91,.18)]">
                <Icon size={21} strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <strong className="block text-base font-black leading-tight sm:text-lg">{value}</strong>
                <span className="mt-1 block text-xs leading-4 text-slate-300 sm:text-sm">{label}</span>
              </span>
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
