import { defineField, defineType } from 'sanity';

const pages = [
  { title: 'Homepage', value: 'home' },
  { title: 'Courses', value: 'courses' },
  { title: 'Book Store', value: 'book-store' },
  { title: 'About', value: 'about' },
  { title: 'Contact', value: 'contact' },
  { title: 'Free Tests', value: 'free-tests' },
  { title: 'Success Stories', value: 'success-stories' },
];

const cardTypes = [
  { title: 'General card', value: 'general' },
  { title: 'Book / Product', value: 'book' },
  { title: 'Student review', value: 'testimonial' },
  { title: 'App card', value: 'app' },
  { title: 'Contact card', value: 'contact' },
  { title: 'Feature / Information card', value: 'feature' },
  { title: 'FAQ', value: 'faq' },
  { title: 'Free test', value: 'test' },
];

const fitOptions = [
  { title: 'Show full image', value: 'contain' },
  { title: 'Fill the space (may crop)', value: 'cover' },
];

function inferredCardType(document: any): string {
  if (!document) return 'general';
  if (typeof document.cardType === 'string') return document.cardType;
  const section = String(document.section || '').toLowerCase();
  const keyValue = typeof document.key === 'string' ? document.key : document.key?.current || '';
  const key = String(keyValue).toLowerCase();
  const externalId = String(document.externalId || '').toLowerCase();
  const marker = `${section} ${key} ${externalId}`;
  if (/review|testimonial|story/.test(marker)) return 'testimonial';
  if (/app-card|persona-app|khushi-app/.test(marker)) return 'app';
  if (/contact|office|whatsapp|email|call/.test(marker)) return 'contact';
  if (/faq/.test(marker)) return 'faq';
  if (/demo|test/.test(marker)) return 'test';
  if (/book|store|product/.test(marker)) return 'book';
  if (/feature|what-you-want|hero-feature/.test(marker)) return 'feature';
  return 'general';
}

function hideFor(...types: string[]) {
  return ({ document }: any) => {
    // The Courses page is intentionally left on its existing editor and data flow.
    if (document?.page === 'courses') return false;
    const kind = inferredCardType(document);
    return kind !== 'general' && !types.includes(kind);
  };
}

export default defineType({
  name: 'siteCard',
  title: 'Website Cards & Content',
  type: 'document',
  groups: [
    { name: 'main', title: 'Easy Editor', default: true },
    { name: 'images', title: 'Photos' },
    { name: 'pricing', title: 'Price & Rating' },
    { name: 'advanced', title: 'More Settings' },
  ],
  fieldsets: [
    {
      name: 'developerSettings',
      title: 'Advanced settings — normally leave these unchanged',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'page',
      title: 'Which page is this for?',
      type: 'string',
      options: { list: pages, layout: 'dropdown' },
      group: 'main',
      validation: (Rule) => Rule.required(),
      description: 'Choose the page where this card should appear. Do not choose Courses for regular content cards.',
    }),
    defineField({
      name: 'cardType',
      title: 'What are you adding?',
      type: 'string',
      options: { list: cardTypes, layout: 'dropdown' },
      initialValue: 'general',
      group: 'main',
      hidden: ({ document }) => document?.page === 'courses',
      description: 'Choose one option. The editor will only show the fields needed for it.',
    }),
    defineField({
      name: 'title',
      title: 'Name / Main heading',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
      description: 'The main text visitors will see.',
    }),
    defineField({ name: 'eyebrow', title: 'Small text above the heading (optional)', type: 'string', group: 'main', hidden: hideFor('feature', 'app', 'book', 'general') }),
    defineField({ name: 'subtitle', title: 'Short line below the heading', type: 'string', group: 'main', hidden: hideFor('book', 'testimonial', 'faq', 'test', 'general') }),
    defineField({ name: 'location', title: 'Student city / location', type: 'string', group: 'main', hidden: hideFor('testimonial') }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'main', hidden: hideFor('book', 'testimonial') }),
    defineField({ name: 'features', title: 'Key points (add one per line)', type: 'array', of: [{ type: 'string' }], group: 'main', hidden: hideFor('feature', 'app', 'book') }),
    defineField({
      name: 'image',
      title: 'Main photo / picture',
      type: 'image',
      options: { hotspot: true },
      group: 'images',
      hidden: hideFor('faq'),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Short description of the photo (optional)',
      type: 'string',
      group: 'images',
      hidden: hideFor('faq'),
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Student / teacher photo',
      type: 'image',
      options: { hotspot: true },
      group: 'images',
      hidden: hideFor('testimonial', 'app'),
    }),
    defineField({
      name: 'imageFit',
      title: 'How should the photo fit?',
      type: 'string',
      options: { list: fitOptions, layout: 'radio' },
      initialValue: 'contain',
      group: 'images',
      hidden: hideFor('faq'),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Photo position',
      type: 'string',
      initialValue: 'center',
      options: { list: [{ title: 'Center', value: 'center' }, { title: 'Top', value: 'top' }, { title: 'Bottom', value: 'bottom' }] },
      group: 'images',
      hidden: hideFor('faq'),
    }),
    defineField({ name: 'badge', title: 'Small tag (e.g. Bestseller / New)', type: 'string', group: 'pricing', hidden: hideFor('book', 'app', 'test') }),
    defineField({ name: 'priceText', title: 'Current price', type: 'string', group: 'pricing', hidden: hideFor('book') }),
    defineField({ name: 'oldPriceText', title: 'Old price (optional)', type: 'string', group: 'pricing', hidden: hideFor('book') }),
    defineField({ name: 'discountText', title: 'Discount (e.g. 20% OFF)', type: 'string', group: 'pricing', hidden: hideFor('book') }),
    defineField({ name: 'rating', title: 'Choose star rating', type: 'number', options: { list: [{ title: '⭐', value: 1 }, { title: '⭐⭐', value: 2 }, { title: '⭐⭐⭐', value: 3 }, { title: '⭐⭐⭐⭐', value: 4 }, { title: '⭐⭐⭐⭐⭐', value: 5 }], layout: 'radio' }, validation: (Rule) => Rule.min(0).max(5), group: 'pricing', hidden: hideFor('testimonial', 'book') }),
    defineField({ name: 'reviewCount', title: 'Number of reviews', type: 'number', validation: (Rule) => Rule.min(0), group: 'pricing', hidden: hideFor('testimonial', 'book') }),
    defineField({ name: 'buttonLabel', title: 'Main button text', type: 'string', group: 'main', hidden: hideFor('book', 'testimonial', 'feature', 'faq') }),
    defineField({ name: 'buttonUrl', title: 'Where should the button go?', type: 'url', group: 'main', hidden: hideFor('book', 'testimonial', 'feature', 'faq') }),
    defineField({ name: 'secondaryButtonLabel', title: 'Second button text (optional)', type: 'string', group: 'main', hidden: hideFor('app', 'book') }),
    defineField({ name: 'secondaryButtonUrl', title: 'Second button destination', type: 'url', group: 'main', hidden: hideFor('app', 'book') }),
    defineField({
      name: 'accent',
      title: 'Card colour style',
      type: 'string',
      options: { list: [{ title: 'Persona Orange / Red', value: 'persona' }, { title: 'Navy / Blue', value: 'navy' }, { title: 'Violet', value: 'violet' }, { title: 'Green', value: 'green' }, { title: 'Neutral', value: 'neutral' }] },
      initialValue: 'persona',
      group: 'advanced',
      hidden: hideFor('general', 'book', 'testimonial', 'app', 'contact', 'feature', 'faq', 'test'),
    }),
    // Existing website matching fields are retained so current cards keep working.
    defineField({
      name: 'key',
      title: 'Card name (internal — do not change)',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      fieldset: 'developerSettings',
      group: 'advanced',
      validation: (Rule) => Rule.required(),
      description: 'Used internally to connect this content to the correct place on the website.',
    }),
    defineField({
      name: 'section',
      title: 'Website area (internal — do not change)',
      type: 'string',
      fieldset: 'developerSettings',
      group: 'advanced',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalId',
      title: 'Linked item ID (internal — do not change)',
      type: 'string',
      fieldset: 'developerSettings',
      group: 'advanced',
      description: 'Keep unchanged unless a developer gives you an exact value.',
    }),
    defineField({ name: 'order', title: 'Display position', type: 'number', initialValue: 0, group: 'advanced' }),
    defineField({ name: 'active', title: 'Show this on the website', type: 'boolean', initialValue: true, group: 'advanced' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'page', media: 'image', active: 'active', section: 'section' },
    prepare({ title, subtitle, media, active, section }) {
      return { title: `${active === false ? '⚪' : '🟢'} ${title || 'Untitled Card'}`, subtitle: [subtitle, section].filter(Boolean).join(' · '), media };
    },
  },
  orderings: [
    { title: 'Page, then order', name: 'pageOrder', by: [{ field: 'page', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
});
