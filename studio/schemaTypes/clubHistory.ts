import {defineArrayMember, defineField, defineType} from 'sanity'

/** Page « Histoire du club », au format magazine : un seul document (administrateurs). */
export const clubHistory = defineType({
  name: 'clubHistory',
  title: 'Histoire du club',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Histoire du club',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'body',
      title: 'Article',
      description: 'Insérez des photos dans le texte, en différentes tailles de légende si besoin.',
      type: 'richText',
    }),
    defineField({
      name: 'anecdotes',
      title: 'Encarts d’anecdotes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'text', title: 'Texte', type: 'text', rows: 4, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Histoire du club'})},
})
