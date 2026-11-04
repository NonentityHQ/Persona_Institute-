import { defineField, defineType } from 'sanity';

/** Optional flexible content blocks if you want more sections later */
export default defineType({
  name: 'homeSection',
  title: 'Home Content Block',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Section Key',
      type: 'string',
      options: {
        list: [
          { title: 'What Do You Want (Courses & Books)', value: 'whatDoYouWant' },
          { title: 'Why Persona', value: 'whyPersona' },
          { title: 'Testimonials intro', value: 'testimonialsIntro' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker / Small Label',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'key' },
  },
});
