import {
  getBooks,
  getBookCategories,
  getBookOffer,
} from '@/lib/sanity/client';
import {
  fallbackBooks,
  fallbackBookCategories,
  fallbackBookOffer,
} from '@/lib/sanity/fallback';
import BookStoreClient from './BookStoreClient';

export const revalidate = 120;

export const metadata = {
  title: 'Book Store | Persona Institute',
  description:
    'Official Persona Institute Book Store — Grammar, Vocabulary, Practice Sets and Combos by Ajay Sir.',
};

export default async function BookStorePage() {
  const [books, categories, offer] = await Promise.all([
    getBooks(),
    getBookCategories(),
    getBookOffer(),
  ]);

  return (
    <BookStoreClient
      books={books.length ? books : fallbackBooks}
      categories={categories.length ? categories : fallbackBookCategories}
      offer={offer || fallbackBookOffer}
    />
  );
}
