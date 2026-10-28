import { defineField, defineType } from 'sanity';
import { localizedString, localizedText, photoField } from './fields';

/** Agenda event, entered by members. Past events disappear from the site on their own. */
export default defineType({
  name: 'event',
  title: 'Événement (agenda)',
  type: 'document',
  fields: [
    localizedString({ name: 'title', title: 'Titre', required: true, max: 90 }),
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
          const start = (context.document as { startDate?: string } | undefined)?.startDate;
          if (end && start && end < start) return 'La fin doit être après le début.';
          return true;
        }),
    }),
    defineField({ name: 'location', title: 'Lieu', type: 'string' }),
    localizedText({ name: 'description', title: 'Description courte', rows: 3, max: 300 }),
    photoField({ name: 'image', title: 'Photo (facultatif)', required: false }),
  ],
  orderings: [
    { title: 'Date de début', name: 'startAsc', by: [{ field: 'startDate', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.fr', date: 'startDate', media: 'image' },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : 'Sans date',
      media,
    }),
  },
});
