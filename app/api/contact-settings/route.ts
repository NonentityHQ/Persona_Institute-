import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/sanity/server';

export const revalidate = 60;

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({
    phonePrimary: settings?.contactPhone?.trim() || '8719977802',
    phoneSecondary: settings?.contactPhoneSecondary?.trim() || '',
    whatsapp: settings?.contactWhatsapp?.trim() || '8719977802',
    email: settings?.contactEmail?.trim() || 'Personaenglishknw@gmail.com',
    address: settings?.contactAddress?.trim() || 'Navchandi Mandir Main Road, Rameshwar Nagar, Khandwa, Madhya Pradesh 450001, India',
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
