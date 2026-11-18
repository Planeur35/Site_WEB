import { defineType } from 'sanity';
import { localizedBlocks, photoField } from './fields';

const LEGACY =
  'Ancienne rubrique, qui n’est plus affichée. Recopiez son texte dans « Je découvre », « J’apprends à piloter » ou « Je suis breveté ou activité à la carte », puis videz ce champ.';

/** Page « Venez voler ! » (rejoindre l’association): a single document, written like an association page. */
export default defineType({
  name: 'joinPage',
  title: 'Page « Venez voler ! »',
  type: 'document',
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'legacy', title: 'Anciennes rubriques (à déplacer)' },
  ],
  fields: [
    localizedBlocks({
      name: 'intro',
      title: 'Texte explicatif',
      description: 'Texte d’introduction en haut de la page « Rejoindre l’association ».',
      group: 'page',
    }),
    localizedBlocks({
      name: 'discover',
      title: 'Je découvre',
      description: 'Première rubrique : pour celles et ceux qui découvrent le vol en planeur (vol d’initiation, premiers contacts).',
      group: 'page',
    }),
    localizedBlocks({
      name: 'learn',
      title: 'J’apprends à piloter',
      description: 'Deuxième rubrique : la formation, de l’adhésion au brevet.',
      group: 'page',
    }),
    localizedBlocks({
      name: 'licensed',
      title: 'Je suis breveté ou activité à la carte',
      description: 'Troisième rubrique : pilotes brevetés, et vols à la carte sans formation.',
      group: 'page',
    }),
    localizedBlocks({
      name: 'how',
      title: 'Comment s’inscrire',
      description: 'En bas de la page : lieu, modalités d’inscription, pièces à fournir…',
      group: 'page',
    }),

    // Old sub-parts: no longer shown, kept so that their text can be copied
    localizedBlocks({ name: 'membership', title: '(Ancien) Adhésion à l’association (membres)', description: LEGACY, group: 'legacy' }),
    localizedBlocks({ name: 'training', title: '(Ancien) Pack formation', description: LEGACY, group: 'legacy' }),
    localizedBlocks({ name: 'advanced', title: '(Ancien) Pack complément de formation', description: LEGACY, group: 'legacy' }),
    {
      // No longer shown: the prices have their own page. Hidden, the stored image is kept.
      ...photoField({ name: 'table', title: '(Ancien) Tableau récapitulatif des tarifs (image)', required: false, group: 'legacy' }),
      hidden: true,
    },
  ],
  preview: { prepare: () => ({ title: 'Page « Venez voler ! »' }) },
});
