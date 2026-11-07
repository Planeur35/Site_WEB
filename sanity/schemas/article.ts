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
      // Hidden: the site must not show members' names. Existing values are kept.
      hidden: true,
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
    defineField({
      name: 'socialShare',
      title: 'Publier sur Facebook et Instagram',
      description:
        'Cochez avant de publier : l’article est partagé une seule fois sur la page Facebook de l’association, et sur Instagram s’il a une photo. Laissez décoché pour un article interne.',
      type: 'boolean',
      initialValue: false,
      // Once shared, the box can no longer be unticked or ticked again
      readOnly: ({ document }) => Boolean((document?.socialPosts as { startedAt?: string } | undefined)?.startedAt),
    }),
    defineField({
      name: 'socialText',
      title: 'Texte du post (facultatif)',
      description: 'Vide : le titre et le résumé en français. Le lien vers l’article est ajouté automatiquement.',
      type: 'text',
      rows: 4,
      hidden: ({ document }) => !document?.socialShare,
      readOnly: ({ document }) => Boolean((document?.socialPosts as { startedAt?: string } | undefined)?.startedAt),
    }),
    defineField({
      name: 'socialRetry',
      title: 'Réessayer le partage',
      description: 'Après une erreur : cochez puis publiez pour renvoyer le post aux réseaux qui ont échoué.',
      type: 'boolean',
      hidden: ({ document }) => !(document?.socialPosts as { error?: string } | undefined)?.error,
    }),
    defineField({
      name: 'socialPosts',
      title: 'Partage sur les réseaux (rempli automatiquement)',
      type: 'object',
      readOnly: true,
      hidden: ({ value }) => !value,
      fields: [
        defineField({ name: 'startedAt', title: 'Envoyé le', type: 'datetime' }),
        defineField({ name: 'facebookPostId', title: 'Post Facebook', type: 'string' }),
        defineField({ name: 'instagramMediaId', title: 'Post Instagram', type: 'string' }),
        defineField({ name: 'error', title: 'Erreur', type: 'text', rows: 3 }),
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
