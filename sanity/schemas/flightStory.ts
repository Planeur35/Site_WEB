import { defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText, photoField } from './fields';

/** A memorable flight from or to the club. No names of pilots or students. */
export default defineType({
  name: 'flightStory',
  title: 'Récit de vol',
  type: 'document',
  fields: [
    localizedString({ name: 'title', title: 'Titre', required: true, max: 90 }),
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
    localizedText({ name: 'excerpt', title: 'Résumé (2 phrases)', rows: 3, required: true, max: 200 }),
    localizedBlocks({
      name: 'body',
      title: 'Récit',
      description: 'Rappel : aucun nom de pilote ou d’élève.',
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
