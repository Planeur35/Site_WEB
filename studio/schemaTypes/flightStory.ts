import {defineField, defineType} from 'sanity'
import {photoField} from './fields'

/**
 * Récit d'un beau vol (administrateurs).
 * Rappel : pas de noms de pilotes ou d'élèves, ni de données individuelles.
 */
export const flightStory = defineType({
  name: 'flightStory',
  title: 'Récit de vol',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({name: 'flightDate', title: 'Date du vol', type: 'date'}),
    defineField({
      name: 'weglideUrl',
      title: 'Lien WeGlide (facultatif)',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'aircraft',
      title: 'Planeur utilisé (facultatif)',
      description: 'Le nom du planeur, jamais celui d’une personne.',
      type: 'string',
    }),
    photoField({name: 'image', title: 'Photo', required: false}),
    defineField({
      name: 'excerpt',
      title: 'Résumé (2 phrases)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({name: 'body', title: 'Récit', type: 'richText'}),
  ],
  preview: {
    select: {title: 'title', date: 'flightDate', media: 'image'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : undefined,
      media,
    }),
  },
})
