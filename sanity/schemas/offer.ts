import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'offer',
  title: 'Special Offer Card',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Active (show on website)',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this offer from the site without deleting it.',
    }),
    defineField({
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'Limited Time Offer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Offer Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. Teacher\'s Day Special Offer!',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
      description: 'e.g. Get all recorded courses at just ₹500/- · 15 Months Validity',
    }),
    defineField({
      name: 'priceText',
      title: 'Highlighted Price Text',
      type: 'string',
      description: 'e.g. ₹500/- (will be shown in red)',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'Grab Offer Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button Link (optional)',
      type: 'string',
      description: 'Leave empty to open the offer modal. Or put /courses, external URL etc.',
    }),
    defineField({
      name: 'handwrittenNote',
      title: 'Handwritten Note (desktop)',
      type: 'text',
      rows: 3,
      description: 'Shown on the right side on desktop. Use line breaks.',
    }),
    defineField({
      name: 'image',
      title: 'Offer / Gift Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional image for the left side of the banner (gift box area).',
    }),
    defineField({
      name: 'showCountdown',
      title: 'Show Countdown Timer',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'countdownEnd',
      title: 'Countdown Ends At',
      type: 'datetime',
      description: 'When the offer ends. Timer will count down to this moment.',
      hidden: ({ parent }) => !parent?.showCountdown,
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          { title: 'Warm Peach (default)', value: 'peach' },
          { title: 'Soft Rose', value: 'rose' },
          { title: 'Cream', value: 'cream' },
        ],
        layout: 'radio',
      },
      initialValue: 'peach',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower number appears first if multiple active offers.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'badge',
      media: 'image',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? '🟢' : '⚪'} ${title || 'Untitled Offer'}`,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
