import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bookCategory',
  title: 'Book Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. Grammar, Vocabulary, Practice Sets',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Short Subtitle',
      type: 'string',
      description: 'e.g. Build Strong Basics',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Key',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (All)', value: 'grid' },
          { title: 'Book / Grammar', value: 'book' },
          { title: 'A / Vocabulary', value: 'vocab' },
          { title: 'Document / Practice', value: 'practice' },
          { title: 'Comprehension', value: 'comprehension' },
          { title: 'Pen / Writing', value: 'writing' },
          { title: 'Gift / Combo', value: 'combo' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'book',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', active: 'active' },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? '⚪' : '🟢'} ${title || 'Category'}`,
        subtitle,
      };
    },
  },
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
});
