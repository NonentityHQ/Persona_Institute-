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

const fitOptions = [
  { title: 'Contain (show full image)', value: 'contain' },
  { title: 'Cover (fill the frame)', value: 'cover' },
];

export default defineType({
  name: 'siteCard',
  title: 'Website Cards & Content',
  type: 'document',
  groups: [
    { name: 'placement', title: 'Where it appears', default: true },
    { name: 'content', title: 'Text & Content' },
    { name: 'media', title: 'Image & Display' },
    { name: 'commerce', title: 'Price & Buttons' },
    { name: 'design', title: 'Design & Visibility' },
  ],
  fields: [
    defineField({
      name: 'key',
      title: 'Unique Card Key',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      group: 'placement',
      validation: (Rule) => Rule.required(),
      description: 'Stable key used by the website to match this card. Keep it unique.',
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: { list: pages, layout: 'dropdown' },
      group: 'placement',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section / Card Group',
      type: 'string',
      group: 'placement',
      validation: (Rule) => Rule.required(),
      description: 'Examples: course-card, what-you-want, app-card, hero-feature.',
    }),
    defineField({
      name: 'externalId',
      title: 'External Item ID (optional)',
      type: 'string',
      group: 'placement',
      description: 'For Classplus course overrides, enter the exact course ID shown in the website data.',
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0, group: 'placement' }),
    defineField({ name: 'active', title: 'Visible', type: 'boolean', initialValue: true, group: 'placement' }),

    defineField({ name: 'eyebrow', title: 'Small Label / Eyebrow', type: 'string', group: 'content' }),
    defineField({ name: 'title', title: 'Card Title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle / Role', type: 'string', group: 'content' }),
    defineField({ name: 'location', title: 'Location / City', type: 'string', group: 'content' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, group: 'content' }),
    defineField({
      name: 'features',
      title: 'Feature List',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      description: 'Short bullet points displayed inside the card.',
    }),
    defineField({ name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string', group: 'media' }),
    defineField({ name: 'secondaryImage', title: 'Secondary Image (portrait / avatar)', type: 'image', options: { hotspot: true }, group: 'media' }),
    defineField({
      name: 'imageFit',
      title: 'Image Fit',
      type: 'string',
      options: { list: fitOptions, layout: 'radio' },
      initialValue: 'contain',
      group: 'media',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      initialValue: 'center',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Top', value: 'top' },
          { title: 'Bottom', value: 'bottom' },
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      group: 'media',
    }),
    defineField({ name: 'badge', title: 'Badge (Bestseller / Trending / New)', type: 'string', group: 'commerce' }),
    defineField({ name: 'priceText', title: 'Price Text', type: 'string', group: 'commerce' }),
    defineField({ name: 'oldPriceText', title: 'Old Price Text', type: 'string', group: 'commerce' }),
    defineField({ name: 'discountText', title: 'Discount Text', type: 'string', group: 'commerce' }),
    defineField({ name: 'rating', title: 'Rating', type: 'number', validation: (Rule) => Rule.min(0).max(5), group: 'commerce' }),
    defineField({ name: 'reviewCount', title: 'Review Count', type: 'number', group: 'commerce' }),
    defineField({ name: 'buttonLabel', title: 'Primary Button Label', type: 'string', group: 'commerce' }),
    defineField({ name: 'buttonUrl', title: 'Primary Button URL', type: 'url', group: 'commerce' }),
    defineField({ name: 'secondaryButtonLabel', title: 'Secondary Button Label', type: 'string', group: 'commerce' }),
    defineField({ name: 'secondaryButtonUrl', title: 'Secondary Button URL', type: 'url', group: 'commerce' }),
    defineField({
      name: 'accent',
      title: 'Accent Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Persona Orange / Red', value: 'persona' },
          { title: 'Navy / Blue', value: 'navy' },
          { title: 'Violet', value: 'violet' },
          { title: 'Green', value: 'green' },
          { title: 'Neutral', value: 'neutral' },
        ],
      },
      initialValue: 'persona',
      group: 'design',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'page', media: 'image', active: 'active', section: 'section' },
    prepare({ title, subtitle, media, active, section }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Untitled Card'}`,
        subtitle: [subtitle, section].filter(Boolean).join(' · '),
        media,
      };
    },
  },
  orderings: [
    { title: 'Page, then order', name: 'pageOrder', by: [{ field: 'page', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
});
