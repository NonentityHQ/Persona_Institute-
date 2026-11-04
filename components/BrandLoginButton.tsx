'use client';

import { useState } from 'react';
import BrandLoginModal from '@/components/BrandLoginModal';

type Props = {
  className?: string;
  children?: React.ReactNode;
  /** Use for mobile menu full-width style */
  block?: boolean;
};

/**
 * Drop-in replacement for any "Login / Sign Up" control.
 * Opens dual-brand chooser (Persona English | English with Khushi).
 */
export default function BrandLoginButton({
  className = '',
  children = 'Login / Sign Up',
  block = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          (block
            ? 'flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-4 py-3 text-sm font-bold text-white'
            : 'hidden rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:inline-flex sm:px-5 sm:py-3')
        }
      >
        {children}
      </button>
      <BrandLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
