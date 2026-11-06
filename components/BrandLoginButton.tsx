'use client';
type Props = { className?: string; children?: React.ReactNode; block?: boolean; onOpen?: () => void; };
export default function BrandLoginButton({ className = '', children, block = false, onOpen }: Props) {
  const defaultClass = block
    ? 'flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-4 py-3 text-sm font-bold text-white'
    : 'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff4a16] to-[#ff7014] px-3 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs';
  return (
    <a href="/login" target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.()} className={className || defaultClass}>
      {children ?? (<><span className="sm:hidden">Login</span><span className="hidden sm:inline">Login / Sign Up</span></>)}
    </a>
  );
}
