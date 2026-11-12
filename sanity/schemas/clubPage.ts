import { withEnglishStatus } from './translationStatus';
import { defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText, photoField } from './fields';

/**
 * Sections of the "Le club" page, one document per section.
 * Values of `section` are read by the site: do not rename them.
 */
const SECTIONS = [
  { title: 'Présentation de l’association', value: 'presentation' },
  { title: 'La plateforme (terrain et zone de vol)', value: 'platform' },
  { title: 'Activité des membres', value: 'activities' },
  { title: 'Formation initiale', value: 'training' },
  { title: 'Perfectionnement', value: 'campaign' },
  { title: 'Compétition', value: 'competition' },
];

type ClubPageDoc = { _id: string; section?: string };

export default defineType({
  name: 'clubPage',
  title: 'Page de l’association',
  type: 'document',
  fields: [
    defineField({
      name: 'section',
      title: 'Section',
      description: 'Chaque section ne peut avoir qu’une seule page.',
      type: 'string',
      options: { list: SECTIONS },
      validation: (rule) =>
        rule.required().custom(async (_value, context) => {
          const doc = context.document as ClubPageDoc | undefined;
          if (!doc?.section) return true;
          const id = doc._id.replace(/^drafts\./, '');
          const count = await context
            .getClient({ apiVersion: '2024-01-01' })
            .fetch<number>(
              'count(*[_type == "clubPage" && section == $section && !(_id in [$id, "drafts." + $id])])',
              { section: doc.section, id },
            );
          return count > 0 ? 'Cette section a déjà une page.' : true;
        }),
    }),
    localizedString({ name: 'title', title: 'Titre de la section', required: true, max: 90 }),
    localizedText({ name: 'intro', title: 'Introduction (2 ou 3 phrases)', rows: 3, max: 300 }),
    photoField({ name: 'mainImage', title: 'Photo principale', required: false }),
    localizedBlocks({
      name: 'body',
      title: 'Texte',
      description:
        'Pour les sous-parties, utilisez des « Titres de section » (par exemple : Le terrain, L’environnement de vol, Les options sur la campagne).',
    }),
    {
      ...photoField({ name: 'diagram', title: 'Schéma du cursus (facultatif)', required: false }),
      hidden: ({ document }: { document?: ClubPageDoc }) => document?.section !== 'training',
    },
  ],
  preview: {
    select: { title: 'title.fr', titleEn: 'title.en', section: 'section', media: 'mainImage' },
    prepare: ({ title, titleEn, section, media }) => ({
      title,
      subtitle: withEnglishStatus(SECTIONS.find((s) => s.value === section)?.title, title, titleEn),
      media,
    }),
  },
});
