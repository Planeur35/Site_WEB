import { defineType } from 'sanity';
import { localizedBlocks, photoField } from './fields';

/** Page « Venez voler ! » (tarifs, adhésion, formation): a single document, written like a club page. */
export default defineType({
  name: 'joinPage',
  title: 'Page « Venez voler ! »',
  type: 'document',
  fields: [
    localizedBlocks({
      name: 'intro',
      title: 'Texte explicatif',
      description: 'Texte d’introduction en haut de la page, au-dessus du tableau des tarifs.',
    }),
    {
      ...photoField({ name: 'table', title: 'Tableau récapitulatif des tarifs (image)', required: false }),
      description:
        'L’image du tableau de tous les tarifs de l’année, à remplacer chaque année. Elle peut être grande : le visiteur peut l’ouvrir en plein écran. De préférence nette, de 2000 pixels de large ou plus (JPG ou PNG). Dans « Description de la photo », résumez en une phrase ce que contient le tableau.',
    },
    localizedBlocks({
      name: 'membership',
      title: 'Adhésion au club (membres)',
      description: 'Première sous-partie : cotisation, forfaits, conditions d’adhésion.',
    }),
    localizedBlocks({
      name: 'training',
      title: 'Pack formation',
      description: 'Deuxième sous-partie : ce que comprend le pack formation.',
    }),
    localizedBlocks({
      name: 'advanced',
      title: 'Pack complément de formation',
      description: 'Troisième sous-partie : ce que comprend le pack complément de formation.',
    }),
    localizedBlocks({
      name: 'how',
      title: 'Comment s’inscrire',
      description: 'En bas de la page : lieu, modalités d’inscription, pièces à fournir…',
    }),
  ],
  preview: { prepare: () => ({ title: 'Page « Venez voler ! »' }) },
});
