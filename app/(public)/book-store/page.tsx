import {
  getBooks,
  getBookCategories,
  getBookOffer,
  getBookStoreSettings,
} from '@/lib/sanity/server';
import {
  fallbackBookCategories,
  fallbackBookStoreSettings,
} from '@/lib/sanity/fallback';
import BookStoreClient from './BookStoreClient';

export const revalidate = 120;

export const metadata = {
  title: 'English Grammar & Vocabulary Book Store',
  description:
    'Explore Persona Institute books for English grammar, vocabulary, spoken English and practice, including curated book combinations.',
  alternates: { canonical: '/book-store' },
};

export default async function BookStorePage() {
  const [books, categories, offer, settings] = await Promise.all([
    getBooks(),
    getBookCategories(),
    getBookOffer(),
    getBookStoreSettings(),
  ]);

  return (
    <BookStoreClient
      books={books}
      categories={categories.length ? categories : fallbackBookCategories}
      offer={offer}
      settings={settings || fallbackBookStoreSettings}
    />
  );
}
