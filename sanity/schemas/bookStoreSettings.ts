import { defineField, defineType } from 'sanity';

const iconList = [
  { title: 'Book', value: 'book' },
  { title: 'Zap / Energy', value: 'zap' },
  { title: 'Layers', value: 'layers' },
  { title: 'Star', value: 'star' },
  { title: 'Users', value: 'users' },
  { title: 'Play', value: 'play' },
  { title: 'Shield', value: 'shield' },
  { title: 'Target', value: 'target' },
  { title: 'Award', value: 'award' },
  { title: 'Trending', value: 'trending' },
  { title: 'Gift', value: 'gift' },
  { title: 'Cart', value: 'cart' },
];

export default defineType({
  name: 'bookStoreSettings',
  title: 'Book Store Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'features', title: 'Feature Chips' },
    { name: 'stats', title: 'Stats Bar' },
    { name: 'why', title: 'Why Section' },
    { name: 'testimonials', title: 'Testimonials' },
    { name: 'sections', title: 'Section Titles' },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      initialValue: 'Official Book Store',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitleLine1',
      title: 'Hero Title Line 1',
      type: 'string',
      initialValue: 'Persona Institute',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitleAccent',
      title: 'Hero Title Accent (red gradient line)',
      type: 'string',
      initialValue: 'Book Store',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      initialValue:
        'Ajay Singh Rajput (Ajay Sir) की trusted books for English preparation — Concept, Practice & Exams.',
      group: 'hero',
    }),
    defineField({
      name: 'exploreCtaLabel',
      title: 'Explore Button Label',
      type: 'string',
      initialValue: 'Explore Books',
      group: 'hero',
    }),
    defineField({
      name: 'comboCtaLabel',
      title: 'View Combos Button Label',
      type: 'string',
      initialValue: 'View Combos',
      group: 'hero',
    }),

    // Feature chips under hero subtitle
    defineField({
      name: 'features',
      title: 'Hero Feature Chips',
      type: 'array',
      group: 'features',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: iconList, layout: 'dropdown' },
              initialValue: 'book',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'icon' },
          },
        },
      ],
      initialValue: [
        { label: 'Exam Focused', icon: 'book' },
        { label: 'Concept Clarity', icon: 'zap' },
        { label: 'Practice Sets', icon: 'layers' },
        { label: 'Student Preferred', icon: 'star' },
      ],
    }),

    // Stats
    defineField({
      name: 'stats',
      title: 'Stats Bar',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Number', type: 'number', validation: (Rule) => Rule.required() }),
            defineField({ name: 'suffix', title: 'Suffix', type: 'string', description: 'e.g. +, /5, %' }),
            defineField({ name: 'decimals', title: 'Decimal places', type: 'number', initialValue: 0 }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: iconList, layout: 'dropdown' },
              initialValue: 'users',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      initialValue: [
        { value: 10000, suffix: '+', decimals: 0, label: 'Happy Learners', icon: 'users' },
        { value: 500, suffix: '+', decimals: 0, label: 'Video Lessons', icon: 'play' },
        { value: 4.8, suffix: '/5', decimals: 1, label: 'Student Rating', icon: 'star' },
        { value: 25000, suffix: '+', decimals: 0, label: 'Vocabulary Words', icon: 'layers' },
        { value: 100, suffix: '%', decimals: 0, label: 'Exam Focused', icon: 'shield' },
        { value: 100, suffix: '%', decimals: 0, label: 'At Your Own Pace', icon: 'book' },
      ],
    }),

    // Why section
    defineField({
      name: 'whyEyebrow',
      title: 'Why Section Eyebrow',
      type: 'string',
      initialValue: 'Why choose Persona Books?',
      group: 'why',
    }),
    defineField({
      name: 'whyTitle',
      title: 'Why Section Title',
      type: 'string',
      initialValue: 'Designed for Real Learning & Exam Success',
      group: 'why',
    }),
    defineField({
      name: 'whyItems',
      title: 'Why Items',
      type: 'array',
      group: 'why',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: iconList, layout: 'dropdown' },
              initialValue: 'target',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      initialValue: [
        { title: 'By Ajay Sir', description: 'Curated by Ajay Singh Rajput (Ajay Sir)', icon: 'target' },
        { title: 'Exam Oriented', description: 'Syllabus-based and completely practical', icon: 'award' },
        { title: 'Concept + Practice', description: 'Complete learning with examples & sets', icon: 'book' },
        { title: 'Proven Results', description: 'Trusted by 10,000+ learners across India', icon: 'trending' },
      ],
    }),

    // Testimonials
    defineField({
      name: 'testimonials',
      title: 'Testimonials (Loved by Thousands banner)',
      type: 'array',
      group: 'testimonials',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Quote', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
            defineField({ name: 'by', title: 'Author', type: 'string', initialValue: 'A Verified Learner' }),
          ],
          preview: {
            select: { title: 'by', subtitle: 'text' },
          },
        },
      ],
      initialValue: [
        { text: 'Persona books made English so simple and score-friendly!', by: 'A Verified Learner' },
      ],
    }),

    // Section titles
    defineField({
      name: 'categoriesEyebrow',
      title: 'Categories Eyebrow',
      type: 'string',
      initialValue: 'Browse by category',
      group: 'sections',
    }),
    defineField({
      name: 'categoriesTitle',
      title: 'Categories Title',
      type: 'string',
      initialValue: 'Find the right book for your goal',
      group: 'sections',
    }),
    defineField({
      name: 'featuredEyebrow',
      title: 'Featured Eyebrow',
      type: 'string',
      initialValue: 'Most popular',
      group: 'sections',
    }),
    defineField({
      name: 'featuredTitle',
      title: 'Featured Title',
      type: 'string',
      initialValue: 'Books learners love',
      group: 'sections',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Book Store Settings' };
    },
  },
});
