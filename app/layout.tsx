import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
import MotionRoot from '@/components/motion/MotionRoot';

export const metadata: Metadata = { title: 'Persona Institute | Speak English with Confidence', description: 'Learn English anytime, anywhere with Persona Institute.' };

// data-scroll-behavior="smooth": keeps in-page anchors smooth while Next.js still jumps
// instantly to the top on route changes (otherwise the page visibly scrolls up mid-transition).
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><MotionRoot>{children}</MotionRoot></body>
    </html>
  );
}
