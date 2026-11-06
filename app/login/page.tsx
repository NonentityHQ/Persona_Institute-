'use client';

import Image from 'next/image';
import { m as motion } from 'framer-motion';
import { ArrowRight, ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import TransitionLink from '@/components/motion/TransitionLink';
import {
  brandList,
  classplusLoginUrl,
  isBrandConfigured,
  type BrandConfig,
} from '@/lib/classplus/brands';
import { EASE_OUT } from '@/lib/motion';

function BrandOption({ brand }: { brand: BrandConfig }) {
  const loginUrl = classplusLoginUrl(brand);
  const ready = isBrandConfigured(brand);

  return (
    <button
      type="button"
      onClick={() => {
        if (loginUrl) window.location.href = loginUrl;
      }}
      disabled={!ready}
      className="group flex w-full items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:border-rose-100 enabled:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span
        className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl"
        style={{ background: brand.accentSoft }}
      >
        {brand.logo ? (
          <Image src={brand.logo} alt="" width={64} height={64} className="h-full w-full object-contain p-1" />
        ) : (
          <BookOpen size={28} style={{ color: brand.accent }} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-black text-slate-900">{brand.name}</span>
          {!ready && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              Org code pending
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-slate-500">{brand.description}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: brand.accent }}>
          {ready ? (
            <>
              Continue to Classplus login <ExternalLink size={14} />
            </>
          ) : (
            <>Waiting for org code from Classplus</>
          )}
        </span>
      </span>
      <ArrowRight className="mt-1 shrink-0 text-slate-300 transition group-hover:text-persona-red" size={20} />
    </button>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/80 via-white to-violet-50/40">
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_1.05fr] lg:px-10">
        <div>
          <TransitionLink href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-persona-red">
            ← Back to home
          </TransitionLink>
          <p className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-persona-red shadow-sm">
            <Sparkles size={12} /> Two brands · One family
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Login / Sign up
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
            Choose <strong>Persona English</strong> or <strong>English with Khushi</strong>.
            You will continue on the secure Classplus login for that brand.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-500">
            <li>• Courses, live classes and payments stay on Classplus</li>
            <li>• Progress stays inside the brand you pick</li>
            <li>• Same phone can be registered on both apps</li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,.08)] backdrop-blur"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Select brand</h2>
          <div className="mt-4 grid gap-3">
            {brandList.map((brand) => (
              <BrandOption key={brand.id} brand={brand} />
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-slate-400">
            Org codes are configured once the client shares them from Classplus.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
