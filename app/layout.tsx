import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
import MotionRoot from '@/components/motion/MotionRoot';

export const metadata: Metadata = {
  title: 'Persona Institute | Speak English with Confidence',
  description: 'Learn English anytime, anywhere with Persona Institute.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
};

// data-scroll-behavior="smooth": keeps in-page anchors smooth while Next.js still jumps
// instantly to the top on route changes (otherwise the page visibly scrolls up mid-transition).
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
