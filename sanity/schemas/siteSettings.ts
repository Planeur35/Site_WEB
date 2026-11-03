import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText, photoField } from './fields';

// Keys of `pageHeroes` are read by the site (`PageHeroKey` in types.ts): do not rename them.
const HERO_PAGES = [
  { name: 'club', title: 'Le club' },
  { name: 'gliders', title: 'Nos planeurs' },
  { name: 'join', title: 'Apprenez à voler ! (tarifs)' },
  { name: 'discover', title: 'Venez essayer' },
  { name: 'news', title: 'Actualités' },
  { name: 'stories', title: 'Récits de vols' },
  { name: 'gallery', title: 'Galerie' },
  { name: 'webcam', title: 'Webcam' },
  { name: 'links', title: 'Liens pratiques' },
  { name: 'contact', title: 'Contact' },
  { name: 'legal', title: 'Mentions légales' },
];

// Values of `usefulLinks[].group` are read by the site: do not rename them.
export const LINK_GROUPS = [
  { title: 'Institutions', value: 'institutions' },
  { title: 'Préparation de vol', value: 'flight-prep' },
  { title: 'Météo et conditions', value: 'weather' },
  { title: 'Compétitions', value: 'competitions' },
  { title: 'Hébergements', value: 'accommodation' },
  { title: 'Communauté', value: 'community' },
];

export default defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'home', title: 'Page d’accueil', default: true },
    { name: 'heroes', title: 'Photos d’en-tête' },
    { name: 'stats', title: 'Chiffres clés' },
    { name: 'texts', title: 'Textes des pages' },
    { name: 'pricing', title: 'Page Apprenez à voler (tarifs)' },
    { name: 'contact', title: 'Contact et réseaux' },
    { name: 'links', title: 'Liens pratiques' },
    { name: 'legal', title: 'Mentions légales' },
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

    defineField({
      name: 'pageHeroes',
      title: 'Photos d’en-tête des pages',
      description:
        'Une grande photo en haut de chaque page, à la place du dessin. Format paysage, de préférence 2000 pixels de large ou plus. Si une page n’a pas de photo, le dessin du ciel s’affiche.',
      type: 'object',
      group: 'heroes',
      fields: HERO_PAGES.map(({ name, title }) => photoField({ name, title, required: false })),
    }),

    // Key figures, updated by hand once a year
    defineField({ name: 'statsYear', title: 'Année de référence', type: 'number', group: 'stats' }),
    // No longer shown on the site: hidden in the Studio, the stored value is kept.
    defineField({ name: 'membersCount', title: 'Nombre de membres (n’est plus affiché)', type: 'number', group: 'stats', hidden: true }),
    defineField({ name: 'flightHours', title: 'Heures de vol dans l’année', type: 'number', group: 'stats' }),
    defineField({ name: 'glidersCount', title: 'Nombre de planeurs', type: 'number', group: 'stats' }),
    defineField({ name: 'foundedYear', title: 'Année de fondation', type: 'number', group: 'stats' }),
    defineField({
      name: 'kmFlown',
      title: 'Kilomètres parcourus depuis la création du club',
      type: 'number',
      group: 'stats',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'licensedPilots',
      title: 'Nombre de pilotes brevetés',
      type: 'number',
      group: 'stats',
      validation: (rule) => rule.min(0).integer(),
    }),

    localizedText({
      name: 'joinText',
      title: 'Apprenez à voler : modalités d’inscription',
      description: 'Texte de la page « Apprenez à voler ! », en bas, rubrique « Comment s’inscrire » : lieu, modalités, pièces à fournir… Un retour à la ligne crée un nouveau paragraphe.',
      rows: 6,
      group: 'texts',
    }),
    localizedText({
      name: 'discoveryText',
      title: 'Venez essayer : vols d’initiation',
      description: 'Texte de la page « Venez essayer », rubrique « Vols d’initiation » : déroulement du vol, durée, conditions. Un retour à la ligne crée un nouveau paragraphe.',
      rows: 6,
      group: 'texts',
    }),

    localizedText({
      name: 'bookingText',
      title: 'Venez essayer : réservation et paiement en ligne',
      description: 'Texte de la page « Venez essayer », rubrique « Réservation et paiement en ligne » : comment réserver, bons de vol, conditions d’annulation… Le bouton de paiement utilise le lien saisi dans l’onglet « Contact et réseaux ».',
      rows: 6,
      group: 'texts',
    }),

    // Page « Apprenez à voler ! »: intro text, yearly recap image and three sub-parts
    localizedBlocks({
      name: 'pricingIntro',
      title: 'Texte explicatif',
      description: 'Texte d’introduction en haut de la page « Apprenez à voler ! », au-dessus du tableau des tarifs.',
      group: 'pricing',
    }),
    {
      ...photoField({ name: 'pricingTable', title: 'Tableau récapitulatif des tarifs (image)', required: false, group: 'pricing' }),
      description:
        'L’image du tableau de tous les tarifs de l’année, à remplacer chaque année. Elle peut être grande : le visiteur peut l’ouvrir en plein écran. De préférence nette, de 2000 pixels de large ou plus (JPG ou PNG). Dans « Description de la photo », résumez en une phrase ce que contient le tableau.',
    },
    localizedBlocks({
      name: 'pricingMembership',
      title: 'Adhésion au club (membres)',
      description: 'Première sous-partie de la page : cotisation, forfaits, conditions d’adhésion.',
      group: 'pricing',
    }),
    localizedBlocks({
      name: 'pricingTraining',
      title: 'Pack formation',
      description: 'Deuxième sous-partie de la page : ce que comprend le pack formation.',
      group: 'pricing',
    }),
    localizedBlocks({
      name: 'pricingAdvanced',
      title: 'Pack complément de formation',
      description: 'Troisième sous-partie de la page : ce que comprend le pack complément de formation.',
      group: 'pricing',
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
      name: 'legalName',
      title: 'Nom officiel de l’association',
      description: 'Tel qu’il figure dans les statuts. Affiché sur la page « Mentions légales ».',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'legalAddress',
      title: 'Siège social',
      type: 'text',
      rows: 3,
      group: 'legal',
    }),
    defineField({
      name: 'legalId',
      title: 'Numéro RNA ou SIRET',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'publicationDirector',
      title: 'Directeur ou directrice de la publication',
      description: 'En général le président ou la présidente de l’association. Cette mention est obligatoire.',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'ffvpNumber',
      title: 'Numéro d’affiliation FFVP (facultatif)',
      description: 'Affiché dans l’entrée « Affiliation » des mentions légales. Si vide, seule l’affiliation à la FFVP est indiquée.',
      type: 'string',
      group: 'legal',
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
