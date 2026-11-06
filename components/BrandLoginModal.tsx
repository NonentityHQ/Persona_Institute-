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
    onPick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-md sm:gap-4 sm:p-4"
    >
      <span
        className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl sm:h-14 sm:w-14"
        style={{ background: brand.accentSoft }}
      >
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <BookOpen size={22} style={{ color: brand.accent }} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="block text-[15px] font-black text-slate-900 group-hover:text-persona-red sm:text-base">
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
 *
 * Mobile: bottom-sheet style, scroll-safe, body lock.
 * Desktop: centered dialog.
 */
export default function BrandLoginModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-login-title"
            className="relative flex max-h-[min(92dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle — mobile only */}
            <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            <div className="relative shrink-0 bg-gradient-to-br from-rose-50 via-white to-violet-50 px-5 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:bg-white sm:right-4 sm:top-4 sm:h-9 sm:w-9"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-persona-red shadow-sm">
                <Sparkles size={12} /> Choose your app
              </span>
              <h2
                id="brand-login-title"
                className="mt-2.5 pr-10 text-xl font-black tracking-tight text-slate-900 sm:mt-3 sm:text-2xl"
              >
                Login / Sign up
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Select which brand you want to continue with. You will be taken to the secure
                Classplus login.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="grid gap-3 px-5 py-4 sm:px-6 sm:py-5">
                {brandList.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} onPick={onClose} />
                ))}
              </div>

              <p className="border-t border-slate-100 px-5 py-3 text-center text-[11px] text-slate-400 sm:px-6">
                Learning, payments and live classes run on Classplus for each brand.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
