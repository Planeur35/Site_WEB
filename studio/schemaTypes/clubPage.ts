import {defineField, defineType} from 'sanity'
import {photoField} from './fields'

/**
 * Pages de la rubrique « Le club » (administrateurs).
 * Une seule page par section : le site sait ainsi où afficher chacune.
 */
const SECTIONS = [
  {title: 'Présentation du club', value: 'presentation'},
  {title: 'La plateforme (terrain et zone de vol)', value: 'platform'},
  {title: 'Activité des membres', value: 'activities'},
  {title: 'Formation initiale', value: 'training'},
  {title: 'École campagne', value: 'campaign'},
  {title: 'Compétition', value: 'competition'},
]

type ClubPageDoc = {_id: string; section?: string}

export const clubPage = defineType({
  name: 'clubPage',
  title: 'Page du club',
  type: 'document',
  fields: [
    defineField({
      name: 'section',
      title: 'Section',
      description: 'Chaque section ne peut avoir qu’une seule page.',
      type: 'string',
      options: {list: SECTIONS},
      validation: (rule) =>
        rule.required().custom(async (_value, context) => {
          const doc = context.document as ClubPageDoc | undefined
          if (!doc?.section) return true
          const id = doc._id.replace(/^drafts\./, '')
          const count = await context
            .getClient({apiVersion: '2024-01-01'})
            .fetch<number>(
              'count(*[_type == "clubPage" && section == $section && !(_id in [$id, "drafts." + $id])])',
              {section: doc.section, id},
            )
          return count > 0 ? 'Cette section a déjà une page.' : true
        }),
    }),
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction (2 ou 3 phrases)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    photoField({name: 'mainImage', title: 'Photo principale'}),
    defineField({
      name: 'body',
      title: 'Texte',
      description:
        'Pour les sous-parties, utilisez des « Titres de section » (par exemple : Le terrain, L’environnement de vol, Les options sur la campagne).',
      type: 'richText',
    }),
    {
      ...photoField({name: 'diagram', title: 'Schéma du cursus (facultatif)', required: false}),
      hidden: ({document}) => document?.section !== 'training',
    },
  ],
  preview: {
    select: {title: 'title', section: 'section', media: 'mainImage'},
    prepare: ({title, section, media}) => ({
      title,
      subtitle: SECTIONS.find((s) => s.value === section)?.title,
      media,
    }),
  },
})
