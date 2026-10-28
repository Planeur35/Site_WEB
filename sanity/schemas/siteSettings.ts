import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedString, localizedText, photoField } from './fields';

// Values of `usefulLinks[].group` are read by the site: do not rename them.
export const LINK_GROUPS = [
  { title: 'Institutions', value: 'institutions' },
  { title: 'Préparation de vol', value: 'flight-prep' },
  { title: 'Météo et conditions', value: 'weather' },
  { title: 'Communauté', value: 'community' },
];

export default defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'home', title: 'Page d’accueil', default: true },
    { name: 'stats', title: 'Chiffres clés' },
    { name: 'texts', title: 'Textes des pages' },
    { name: 'contact', title: 'Contact et réseaux' },
    { name: 'links', title: 'Liens pratiques' },
  ],
  fields: [
    defineField({
      name: 'clubName',
      title: 'Nom du club',
      type: 'string',
      group: 'home',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Phrase d’accroche du club',
      type: 'object',
      group: 'home',
      fields: [
        defineField({ name: 'fr', title: 'Français', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroSlides',
      title: 'Photos d’accueil (3 ou 4)',
      description: 'Elles défilent toutes les 6 secondes. Choisissez de belles photos de planeurs en vol.',
      type: 'array',
      group: 'home',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            photoField({ name: 'image', title: 'Photo' }),
            localizedString({ name: 'title', title: 'Titre', required: true, max: 70 }),
            localizedString({ name: 'subtitle', title: 'Sous-titre', max: 140 }),
          ],
          preview: { select: { title: 'title.fr', media: 'image' } },
        }),
      ],
    }),

    // Key figures, updated by hand once a year
    defineField({ name: 'statsYear', title: 'Année de référence', type: 'number', group: 'stats' }),
    defineField({ name: 'membersCount', title: 'Nombre de membres', type: 'number', group: 'stats' }),
    defineField({ name: 'flightHours', title: 'Heures de vol dans l’année', type: 'number', group: 'stats' }),
    defineField({ name: 'glidersCount', title: 'Nombre de planeurs', type: 'number', group: 'stats' }),
    defineField({ name: 'foundedYear', title: 'Année de fondation', type: 'number', group: 'stats' }),

    localizedText({
      name: 'joinText',
      title: 'Comment s’inscrire',
      description: 'Texte de la page « S’inscrire » : lieu, modalités d’inscription, pièces à fournir…',
      rows: 6,
      group: 'texts',
    }),
    localizedText({
      name: 'discoveryText',
      title: 'Description d’un vol d’initiation',
      description: 'Texte de la page « Venez essayer » : déroulement, durée, conditions.',
      rows: 6,
      group: 'texts',
    }),

    defineField({ name: 'contactEmail', title: 'Adresse e-mail du club', type: 'string', group: 'contact' }),
    defineField({ name: 'contactPhone', title: 'Téléphone du club', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Adresse du terrain', type: 'text', rows: 3, group: 'contact' }),
    defineField({
      name: 'paymentUrl',
      title: 'Lien de la plateforme de paiement du club',
      description: 'Réservation et achat de bons de vol (particuliers et entreprises), par exemple HelloAsso.',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Réseau',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Twitter', value: 'twitter' },
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'Adresse',
              type: 'url',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'webcamUrl',
      title: 'Adresse de l’image de la webcam',
      description: 'Adresse directe de l’image (se termine souvent par .jpg). Le site la recharge toutes les minutes.',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'weglideUrl',
      title: 'Page WeGlide du club',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'aerodromeCoordinates',
      title: 'Coordonnées du terrain (carte)',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
      ],
    }),

    defineField({
      name: 'usefulLinks',
      title: 'Liens pratiques',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedString({ name: 'label', title: 'Nom du lien', required: true }),
            defineField({
              name: 'url',
              title: 'Adresse',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'group',
              title: 'Rubrique',
              type: 'string',
              options: { list: LINK_GROUPS },
            }),
          ],
          preview: { select: { title: 'label.fr', subtitle: 'group' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Réglages du site' }),
  },
});
