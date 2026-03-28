import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      validation: (rule) => rule.required(),
      fields: [
        defineField({ name: 'fr', title: 'French', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.fr',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        defineField({ name: 'fr', title: 'French', type: 'text' }),
        defineField({ name: 'en', title: 'English', type: 'text' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({
          name: 'fr',
          title: 'French',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            defineField({ name: 'fr', title: 'French', type: 'string' }),
            defineField({ name: 'en', title: 'English', type: 'string' }),
          ],
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            defineField({ name: 'fr', title: 'French', type: 'string' }),
            defineField({ name: 'en', title: 'English', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.fr',
      subtitle: 'publishedAt',
      media: 'featuredImage',
    },
  },
});
