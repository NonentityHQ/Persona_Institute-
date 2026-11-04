'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, m as motion } from 'framer-motion';
import { ArrowRight, ExternalLink, X, BookOpen, Sparkles } from 'lucide-react';
import {
  brandList,
  classplusLoginUrl,
  isBrandConfigured,
  type BrandConfig,
} from '@/lib/classplus/brands';
import { DUR, EASE_OUT } from '@/lib/motion';

type Props = {
  open: boolean;
  onClose: () => void;
};

function BrandCard({ brand, onPick }: { brand: BrandConfig; onPick: () => void }) {
  const loginUrl = classplusLoginUrl(brand);
  const ready = isBrandConfigured(brand);

  const handleClick = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
      return;
    }
    // Org code not set yet — still close and show hint via parent if needed
    onPick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-md"
      style={{ borderColor: undefined }}
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl"
        style={{ background: brand.accentSoft }}
      >
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen size={24} style={{ color: brand.accent }} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block text-base font-black text-slate-900 group-hover:text-persona-red">
            {brand.name}
          </span>
          {!ready && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              Org code pending
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
          {brand.description}
        </span>
        <span
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold"
          style={{ color: brand.accent }}
        >
          {ready ? (
            <>
              Continue to login <ExternalLink size={12} />
            </>
          ) : (
            <>
              Configure org code <ArrowRight size={12} />
            </>
          )}
        </span>
      </span>
    </button>
  );
}

/**
 * Dual-brand login chooser:
 * 1) Persona English  → Classplus org A
 * 2) English with Khushi → Classplus org B
 */
export default function BrandLoginModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-login-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-rose-50 via-white to-violet-50 px-6 pb-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 shadow-sm hover:bg-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-persona-red shadow-sm">
                <Sparkles size={12} /> Choose your app
              </span>
              <h2 id="brand-login-title" className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                Login / Sign up
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select which brand you want to continue with. You will be taken to the secure Classplus login.
              </p>
            </div>

            <div className="grid gap-3 px-6 py-5">
              {brandList.map((brand) => (
                <BrandCard key={brand.id} brand={brand} onPick={onClose} />
              ))}
            </div>

            <p className="border-t border-slate-100 px-6 py-3 text-center text-[11px] text-slate-400">
              Learning, payments and live classes run on Classplus for each brand.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
