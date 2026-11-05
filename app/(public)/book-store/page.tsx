import {
  getBooks,
  getBookCategories,
  getBookOffer,
  getBookStoreSettings,
} from '@/lib/sanity/client';
import {
  fallbackBooks,
  fallbackBookCategories,
  fallbackBookOffer,
  fallbackBookStoreSettings,
} from '@/lib/sanity/fallback';
import BookStoreClient from './BookStoreClient';

export const revalidate = 120;

export const metadata = {
  title: 'Book Store | Persona Institute',
  description:
    'Official Persona Institute Book Store — Grammar, Vocabulary, Practice Sets and Combos by Ajay Sir.',
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
      books={books.length ? books : fallbackBooks}
      categories={categories.length ? categories : fallbackBookCategories}
      offer={offer || fallbackBookOffer}
      settings={settings || fallbackBookStoreSettings}
    />
  );
}
