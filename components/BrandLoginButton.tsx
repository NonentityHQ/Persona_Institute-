'use client';

import { useState } from 'react';
import BrandLoginModal from '@/components/BrandLoginModal';

type Props = {
  className?: string;
  children?: React.ReactNode;
  /** Use for mobile menu full-width style */
  block?: boolean;
  /** Called when modal opens (e.g. close mobile nav) */
  onOpen?: () => void;
};

/**
 * Drop-in replacement for any "Login / Sign Up" control.
 * Opens dual-brand chooser (Persona English | English with Khushi).
 * Visible on mobile header too (compact label).
 */
export default function BrandLoginButton({
  className = '',
  children,
  block = false,
  onOpen,
}: Props) {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    onOpen?.();
    setOpen(true);
  };

  const defaultClass = block
    ? 'flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-4 py-3 text-sm font-bold text-white'
    : // Mobile: compact pill in header; sm+: full label
      'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-3 py-2 text-[11px] font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs';

  return (
    <>
      <button type="button" onClick={openModal} className={className || defaultClass}>
        {children ?? (
          <>
            <span className="sm:hidden">Login</span>
            <span className="hidden sm:inline">Login / Sign Up</span>
          </>
        )}
      </button>
      <BrandLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
