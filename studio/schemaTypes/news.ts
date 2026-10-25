import {defineField, defineType} from 'sanity'
import {photoField} from './fields'

/** Actualité : saisie par les membres. 4 champs seulement. */
export const news = defineType({
  name: 'news',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    photoField({name: 'image', title: 'Photo'}),
    defineField({
      name: 'body',
      title: 'Texte',
      type: 'simpleText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Rubrique (facultatif)',
      type: 'string',
      options: {list: ['Vie du club', 'Campagne', 'Formation', 'Maintenance', 'Compétition']},
    }),
  ],
  orderings: [
    {
      title: 'Plus récentes d’abord',
      name: 'dateDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'image'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : 'Sans date',
      media,
    }),
  },
})
