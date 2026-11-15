import { getSiteCards, getSiteSettings } from '@/lib/sanity/server';
import { cleanSanityString } from '@/lib/sanity/client';
import ContactPageClient from './ContactPageClient';

export const metadata = { title: 'Contact Persona Institute', description: 'Contact Persona Institute in Khandwa, Madhya Pradesh for spoken English courses, admissions, course guidance and support.', alternates: { canonical: '/contact' } };

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
    address: '01, Jai Bajrang Nagar, near Gangrade Dharmshala, Kasal Pura, Khandwa, Madhya Pradesh 450001',
  };
  return <ContactPageClient contactSettings={contactSettings} siteCards={siteCards} />;
}
