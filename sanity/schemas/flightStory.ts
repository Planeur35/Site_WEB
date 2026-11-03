import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText, photoField } from './fields';

/** A memorable flight from or to the club. No names of pilots or students. */
export default defineType({
  name: 'flightStory',
  title: 'Récit de vol',
  type: 'document',
  description: 'Chaque récit est une page de type magazine. Les 6 récits les plus récents sont proposés sur la page « Récits de vols ».',
  fields: [
    localizedString({ name: 'title', title: 'Titre', required: true, max: 90 }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Cliquez sur « Generate » : l’adresse est créée à partir du titre français.',
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
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'flightDate', title: 'Date du vol', type: 'date' }),
    defineField({
      name: 'weglideUrl',
      title: 'Lien WeGlide (facultatif)',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'aircraft',
      title: 'Planeur utilisé (facultatif)',
      description: 'Le nom du planeur, jamais celui d’une personne.',
      type: 'string',
    }),
    photoField({ name: 'image', title: 'Photo', required: false }),
    localizedText({ name: 'excerpt', title: 'Introduction (2 phrases)', description: 'Affichée en grand en tête de la page du récit.', rows: 3, required: true, max: 200 }),
    localizedBlocks({
      name: 'body',
      title: 'Récit',
      description: 'Insérez des photos dans le texte, avec une légende si besoin. Rappel : aucun nom de pilote ou d’élève.',
    }),
    defineField({
      name: 'anecdotes',
      title: 'Encarts d’anecdotes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedString({ name: 'title', title: 'Titre', required: true }),
            localizedText({ name: 'text', title: 'Texte', rows: 4, required: true }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
    }),
  ],
  orderings: [
    { title: 'Date du vol', name: 'flightDateDesc', by: [{ field: 'flightDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.fr', date: 'flightDate', media: 'image' },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : undefined,
      media,
    }),
  },
});
