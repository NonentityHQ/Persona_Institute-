import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Persona Institute | Speak English with Confidence', description: 'Learn English anytime, anywhere with Persona Institute.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
