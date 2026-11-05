import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bookOffer',
  title: 'Book Store Offer Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      initialValue: 'Limited Time Offer',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Book Combo – Save More!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Get Grammar + Vocabulary + Practice Sets at a special price.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'Grab the Combo',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Banner Image (books / gift)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'showCountdown',
      title: 'Show Countdown',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'countdownEnd',
      title: 'Countdown Ends At',
      type: 'datetime',
      hidden: ({ parent }) => !parent?.showCountdown,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'badge', media: 'image', active: 'active' },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Book Offer'}`,
        subtitle,
        media,
      };
    },
  },
});
