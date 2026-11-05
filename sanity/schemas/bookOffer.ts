import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bookOffer',
  title: 'Book Store Offer / Combo Banner',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'pricing', title: 'Pricing' },
    { name: 'books', title: 'Included Books' },
    { name: 'cta', title: 'CTA & Countdown' },
  ],
  fields: [
    defineField({
      name: 'active',
      title: 'Active (show on website)',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      initialValue: 'Limited Time Offer',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Book Combo – Save More!',
      validation: (Rule) => Rule.required(),
      description: 'Use an en-dash (–) to split accent color, e.g. "Book Combo – Save More!"',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Get Grammar + Vocabulary + Practice Sets at a special price.',
      group: 'content',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlight Points',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short bullets under the subtitle (e.g. "Free shipping", "Instant PDF access")',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Banner Image (optional — gift / books)',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
    }),

    // Pricing
    defineField({
      name: 'price',
      title: 'Combo Selling Price (₹)',
      type: 'number',
      description: 'Shown on the banner. Leave empty to hide price block.',
      group: 'pricing',
    }),
    defineField({
      name: 'oldPrice',
      title: 'MRP / Old Price (₹)',
      type: 'number',
      group: 'pricing',
    }),
    defineField({
      name: 'savingsText',
      title: 'Savings Label',
      type: 'string',
      description: 'e.g. "Save ₹500" or "31% OFF". Auto-calculated if empty and both prices set.',
      group: 'pricing',
    }),
    defineField({
      name: 'priceNote',
      title: 'Price Note',
      type: 'string',
      description: 'Small text under price, e.g. "Inclusive of all taxes"',
      group: 'pricing',
    }),

    // Included books (for Trio visual + label)
    defineField({
      name: 'includedBooks',
      title: 'Included Books (for Trio cover display)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'book' }] }],
      description: 'Pick up to 3 books. Their covers appear in the floating trio on the banner.',
      validation: (Rule) => Rule.max(3),
      group: 'books',
    }),
    defineField({
      name: 'comboLabel',
      title: 'Combo Contents Label',
      type: 'string',
      description: 'e.g. Grammar + Vocabulary + Comprehension',
      group: 'books',
    }),

    // CTA
    defineField({
      name: 'ctaLabel',
      title: 'Primary Button Label',
      type: 'string',
      initialValue: 'Grab the Combo',
      group: 'cta',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Primary Button Link',
      type: 'string',
      description: 'Google Form URL, #featured, or any path',
      group: 'cta',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary Button Label (optional)',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'secondaryCtaLink',
      title: 'Secondary Button Link',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'showCountdown',
      title: 'Show Countdown',
      type: 'boolean',
      initialValue: true,
      group: 'cta',
    }),
    defineField({
      name: 'countdownEnd',
      title: 'Countdown Ends At',
      type: 'datetime',
      hidden: ({ parent }) => !parent?.showCountdown,
      group: 'cta',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      group: 'cta',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'badge', media: 'image', active: 'active', price: 'price' },
    prepare({ title, subtitle, media, active, price }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Book Offer'}`,
        subtitle: [subtitle, price != null ? `₹${price}` : null].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
