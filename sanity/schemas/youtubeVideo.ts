import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'youtubeVideo',
  title: 'YouTube Video',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full watch URL or youtu.be link',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'If empty, YouTube default thumbnail is used',
    }),
    defineField({ name: 'duration', title: 'Duration label', type: 'string', description: 'e.g. 12:40' }),
    defineField({ name: 'category', title: 'Category / tag', type: 'string' }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', media: 'thumbnail', subtitle: 'category' },
  },
});
