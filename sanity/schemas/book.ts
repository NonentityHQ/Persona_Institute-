import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Active (show on website)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'altText', title: 'Accessible Image Description', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
      description: 'Main book cover shown on cards and hero. Use the hotspot editor to adjust crop and focal point.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'bookCategory' }],
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '' },
          { title: 'Bestseller', value: 'Bestseller' },
          { title: 'Trending', value: 'Trending' },
          { title: 'New', value: 'New' },
          { title: 'Combo Pack', value: 'Combo Pack' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'price',
      title: 'Selling Price (₹)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'oldPrice',
      title: 'MRP / Old Price (₹)',
      type: 'number',
      description: 'Leave empty if no discount.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (e.g. 4.8)',
      type: 'number',
      initialValue: 4.8,
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'One line under the title on the card.',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'isCombo',
      title: 'Is Combo Pack?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'comboLabel',
      title: 'Combo Label',
      type: 'string',
      description: 'e.g. Grammar + Vocabulary + Comprehension',
      hidden: ({ parent }) => !parent?.isCombo,
    }),
    defineField({
      name: 'comboBooks',
      title: 'Books in this Combo',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'book' }] }],
      description: 'Pick the individual books that make up this combo (used for trio covers).',
      hidden: ({ parent }) => !parent?.isCombo,
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Most Popular)',
      type: 'boolean',
      initialValue: false,
      description: 'Show in the Featured / Most Popular row.',
    }),
    defineField({
      name: 'heroFeatured',
      title: 'Show on Hero Pedestal',
      type: 'boolean',
      initialValue: false,
      description: 'Up to 3 books appear on the bookstore hero.',
    }),
    defineField({
      name: 'buyUrl',
      title: 'Buy Now Link (Google Form)',
      type: 'url',
      description: 'Paste the Google Form (or checkout) link. The "Buy Now" button opens it in a new tab. Empty = button shows "Link coming soon".',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'cover',
      price: 'price',
      active: 'active',
      badge: 'badge',
    },
    prepare({ title, media, price, active, badge }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Untitled Book'}`,
        subtitle: [badge, price != null ? `₹${price}` : null].filter(Boolean).join(' · '),
        media,
      };
    },
  },
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
});
