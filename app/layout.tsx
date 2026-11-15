import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
import MotionRoot from '@/components/motion/MotionRoot';

export const metadata: Metadata = {
  metadataBase: new URL('https://personaenglish.in'),
  title: { default: 'Persona Institute | Spoken English & Communication Skills', template: '%s | Persona Institute' },
  description: 'Build spoken English, grammar, vocabulary and communication skills with Persona Institute. Explore live and recorded courses, practice and learning resources.',
  applicationName: 'Persona Institute',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Persona Institute', url: 'https://personaenglish.in', title: 'Persona Institute | Spoken English & Communication Skills', description: 'Build spoken English, grammar, vocabulary and communication skills with Persona Institute.', images: [{ url: '/images/persona-books-display.webp', width: 1200, height: 900, alt: 'Persona Institute learning resources' }] },
  twitter: { card: 'summary_large_image', title: 'Persona Institute | Spoken English & Communication Skills', description: 'Build spoken English, grammar, vocabulary and communication skills with Persona Institute.', images: ['/images/persona-books-display.webp'] },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/icon-192.webp', sizes: '192x192', type: 'image/webp' },
      { url: '/icon-512.webp', sizes: '512x512', type: 'image/webp' },
    ],
    apple: [{ url: '/apple-icon.webp', sizes: '180x180', type: 'image/webp' }],
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
