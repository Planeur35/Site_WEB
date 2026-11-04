import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText } from './fields';

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
    // « Bon à savoir »: each line shows on the page only once it is filled in
    localizedText({ name: 'practicalAge', title: 'Bon à savoir : âge', description: 'Âge minimum, autorisation parentale pour les mineurs.', rows: 2, max: 200 }),
    localizedText({ name: 'practicalWeight', title: 'Bon à savoir : poids', description: 'Poids accepté dans le biplace.', rows: 2, max: 200 }),
    localizedText({ name: 'practicalDuration', title: 'Bon à savoir : durée', description: 'Durée du vol, et temps à prévoir sur place.', rows: 2, max: 200 }),
    localizedText({ name: 'practicalWeather', title: 'Bon à savoir : météo', description: 'Ce qui se passe si le vol est annulé à cause du temps.', rows: 2, max: 200 }),
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
