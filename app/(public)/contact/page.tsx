import { getSiteCards, getSiteSettings } from '@/lib/sanity/server';
import { cleanSanityString } from '@/lib/sanity/client';
import ContactPageClient from './ContactPageClient';

export const revalidate = 120;

export default async function ContactPage() {
  const [settings, siteCards] = await Promise.all([
    getSiteSettings(),
    getSiteCards('contact'),
  ]);
  const contactSettings = {
    phonePrimary: cleanSanityString(settings?.contactPhone) || '8719977802',
    phoneSecondary: cleanSanityString(settings?.contactPhoneSecondary),
    whatsapp: cleanSanityString(settings?.contactWhatsapp) || '8719977802',
    email: cleanSanityString(settings?.contactEmail) || 'Personaenglishknw@gmail.com',
    address: cleanSanityString(settings?.contactAddress) || 'Navchandi Mandir Main Road, Rameshwar Nagar, Khandwa, Madhya Pradesh 450001, India',
  };
  return <ContactPageClient contactSettings={contactSettings} siteCards={siteCards} />;
}
