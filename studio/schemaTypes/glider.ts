import {defineArrayMember, defineField, defineType} from 'sanity'
import {photoField} from './fields'

/**
 * Planeur présenté sur le site (administrateurs).
 * Ne rien saisir d'interne : pas d'état de la machine, de disponibilité ni de noms de pilotes.
 */
export const glider = defineType({
  name: 'glider',
  title: 'Planeur',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom / modèle',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: ['Monoplace', 'Biplace'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Usage (facultatif)',
      description: 'Par exemple : école, performance, club, grande campagne.',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'En service depuis (année, facultatif)',
      type: 'number',
      validation: (rule) => rule.integer().min(1930).max(2100),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    photoField({name: 'mainImage', title: 'Photo principale'}),
    defineField({
      name: 'gallery',
      title: 'Autres photos (facultatif)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Description de la photo',
              type: 'string',
              validation: (rule) => rule.required().max(160),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'specs',
      title: 'Caractéristiques (facultatif)',
      description: 'Par exemple : Envergure → 18 m. Seulement des données publiques.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Intitulé', type: 'string'}),
            defineField({name: 'value', title: 'Valeur', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: '1 = affiché en premier.',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{title: 'Ordre d’affichage', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'mainImage'},
  },
})
