import {defineField, defineType} from 'sanity'
import {photoField} from './fields'

/** Événement de l'agenda : saisie par les membres. */
export const event = defineType({
  name: 'event',
  title: 'Événement (agenda)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'startDate',
      title: 'Début',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fin (facultatif)',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = (context.document as {startDate?: string} | undefined)?.startDate
          if (end && start && end < start) return 'La fin doit être après le début.'
          return true
        }),
    }),
    defineField({name: 'location', title: 'Lieu', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    photoField({name: 'image', title: 'Photo (facultatif)', required: false}),
  ],
  orderings: [
    {title: 'Date de début', name: 'startAsc', by: [{field: 'startDate', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', date: 'startDate', media: 'image'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : 'Sans date',
      media,
    }),
  },
})
