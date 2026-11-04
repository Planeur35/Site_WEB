import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString } from './fields';

/** Page « Venez essayer »: a single document, written like a club page. */
export default defineType({
  name: 'discoverPage',
  title: 'Page « Venez essayer »',
  type: 'document',
  fields: [
    localizedBlocks({
      name: 'flights',
      title: 'Vols d’initiation',
      description: 'Déroulement du vol, durée, conditions. Le prix vient de la fiche « Tarifs » (offre « vol d’initiation »).',
    }),
    localizedBlocks({
      name: 'booking',
      title: 'Réservation et paiement en ligne',
      description:
        'Comment réserver, bons de vol, conditions d’annulation… Le bouton de paiement utilise le lien saisi dans Réglages du site, onglet « Contact et réseaux ».',
    }),
    defineField({
      name: 'faq',
      title: 'Questions fréquentes',
      description: 'Chaque question s’ouvre sur sa réponse. L’ordre est celui de cette liste : on peut glisser les questions pour les déplacer.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedString({ name: 'question', title: 'Question', required: true }),
            localizedBlocks({ name: 'answer', title: 'Réponse' }),
          ],
          preview: { select: { title: 'question.fr' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Page « Venez essayer »' }) },
});
