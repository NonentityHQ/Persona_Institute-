import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'youtubeVideo',
  title: 'YouTube Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
      description: 'Shown under the thumbnail (keep under ~70 characters for clean 2-line clamp).',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Full watch URL (https://www.youtube.com/watch?v=…) or youtu.be / Shorts link. Required for play + auto thumbnail.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'If empty, the default YouTube thumbnail is used automatically.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration label',
      type: 'string',
      description: 'e.g. 12:40',
    }),
    defineField({
      name: 'category',
      title: 'Category / tag',
      type: 'string',
      description: 'e.g. Grammar, Spoken English, Success Story',
    }),
    defineField({
      name: 'active',
      title: 'Active (show on website)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', media: 'thumbnail', subtitle: 'category', active: 'active' },
    prepare({ title, media, subtitle, active }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Untitled'}`,
        subtitle,
        media,
      };
    },
  },
});
