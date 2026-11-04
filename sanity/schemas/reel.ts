import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'reel',
  title: 'Instagram Reel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Caption',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: 'Portrait (9:16) image works best for Reels look.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (optional)',
      type: 'url',
      description: 'Direct MP4 / Instagram reel link / YouTube Shorts. If empty, only thumbnail is shown.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Post / Reel Link',
      type: 'url',
      description: 'Where to send user when they click the reel card.',
    }),
    defineField({
      name: 'category',
      title: 'Category / Tag',
      type: 'string',
      description: 'e.g. Spoken English, Grammar Tip, Student Story',
    }),
    defineField({
      name: 'duration',
      title: 'Duration Label',
      type: 'string',
      description: 'e.g. 0:28, 1:02',
    }),
    defineField({
      name: 'active',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower number appears earlier in the carousel.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'thumbnail',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? '🟢' : '⚪'} ${title || 'Untitled Reel'}`,
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
