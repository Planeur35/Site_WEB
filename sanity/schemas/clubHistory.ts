import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText } from './fields';

/** "Histoire du club", magazine format: a single document. */
export default defineType({
  name: 'clubHistory',
  title: 'Histoire du club',
  type: 'document',
  fields: [
    localizedString({ name: 'title', title: 'Titre' }),
    localizedText({ name: 'intro', title: 'Introduction', rows: 4, max: 400 }),
    localizedBlocks({
      name: 'body',
      title: 'Article',
      description: 'Insérez des photos dans le texte, avec une légende si besoin.',
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
  preview: { prepare: () => ({ title: 'Histoire du club' }) },
});
