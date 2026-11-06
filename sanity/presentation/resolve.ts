import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

const pageHref: Record<string, string> = {
  home: '/',
  courses: '/courses',
  'book-store': '/book-store',
  about: '/about',
  contact: '/contact',
  'free-tests': '/free-tests',
  'success-stories': '/reviews',
};

export const presentationResolve: PresentationPluginOptions['resolve'] = {
  locations: {
    siteSettings: defineLocations({
      select: { title: 'heroTitleLine1' },
      resolve: () => ({
        locations: [{ title: 'Homepage & global settings', href: '/' }],
      }),
    }),
    siteCard: defineLocations({
      select: { title: 'title', page: 'page', section: 'section' },
      resolve: (doc) => ({
        locations: [{
          title: `${doc?.title || 'Website card'}${doc?.section ? ` · ${doc.section}` : ''}`,
          href: pageHref[doc?.page || 'home'] || '/',
        }],
      }),
    }),
    book: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Book Store', href: '/book-store' }],
      }),
    }),
    bookCategory: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Book category', href: '/book-store' }],
      }),
    }),
    bookOffer: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Book offer', href: '/book-store#offer' }],
      }),
    }),
    bookStoreSettings: defineLocations({
      select: { title: 'heroTitleLine1' },
      resolve: () => ({
        locations: [{ title: 'Book Store settings', href: '/book-store' }],
      }),
    }),
    offer: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Homepage offer', href: '/' }],
      }),
    }),
    reel: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Instagram Reel', href: '/#reels' }],
      }),
    }),
    youtubeVideo: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'YouTube video', href: '/' }],
      }),
    }),
  },
};
