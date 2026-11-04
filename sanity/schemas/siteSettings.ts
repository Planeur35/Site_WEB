import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText, photoField } from './fields';

// Keys of `pageHeroes` are read by the site (`PageHeroKey` in types.ts): do not rename them.
const HERO_PAGES = [
  { name: 'club', title: 'Le club' },
  { name: 'gliders', title: 'Nos planeurs' },
  { name: 'join', title: 'Venez voler ! (tarifs)' },
  { name: 'discover', title: 'Venez essayer' },
  { name: 'news', title: 'Actualités' },
  { name: 'stories', title: 'Récits de vols' },
  { name: 'gallery', title: 'Galerie' },
  { name: 'webcam', title: 'Webcam' },
  { name: 'links', title: 'Liens pratiques' },
  { name: 'contact', title: 'Contact' },
  { name: 'legal', title: 'Mentions légales' },
];

const LEGACY_JOIN =
  'Ancien emplacement : à recopier dans « Page « Venez voler ! » ». Ce texte n’est repris par le site que tant que le champ correspondant de cette page est vide.';
const LEGACY_DISCOVER =
  'Ancien emplacement : à recopier dans « Page « Venez essayer » ». Ce texte n’est repris par le site que tant que le champ correspondant de cette page est vide.';

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
    { name: 'legacy', title: 'Anciens textes (à déplacer)' },
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
      description:
        'Elles défilent toutes les 7 secondes. Photo d’au moins 2400 px de large, de préférence un planeur en vol. Le titre (70 caractères max.) s’affiche en très grand au-dessus de la photo.',
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
      name: 'homeCardImages',
      title: 'Photos des trois cartes « Par où commencer »',
      description: 'Format paysage. Sans photo, la carte affiche le dessin d’une trace de vol.',
      type: 'object',
      group: 'home',
      fields: [
        photoField({ name: 'try', title: 'Venez essayer', required: false }),
        photoField({ name: 'learn', title: 'Apprendre à voler', required: false }),
        photoField({ name: 'join', title: 'S’inscrire', required: false }),
      ],
    }),
    photoField({ name: 'giftImage', title: 'Photo du bandeau « Offrez le ciel » (bons de vol)', required: false, group: 'home' }),

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

    // Old place of the texts of the « Venez voler ! » and « Venez essayer » pages. They now live in the documents of
    // those two pages: these fields are only read by the site while the matching new field is empty.
    localizedText({ name: 'joinText', title: '(Ancien) Comment s’inscrire', description: LEGACY_JOIN, rows: 6, group: 'legacy' }),
    localizedText({ name: 'discoveryText', title: '(Ancien) Venez essayer : vols d’initiation', description: LEGACY_DISCOVER, rows: 6, group: 'legacy' }),
    localizedText({ name: 'bookingText', title: '(Ancien) Venez essayer : réservation et paiement en ligne', description: LEGACY_DISCOVER, rows: 6, group: 'legacy' }),
    localizedBlocks({ name: 'pricingIntro', title: '(Ancien) Texte explicatif', description: LEGACY_JOIN, group: 'legacy' }),
    { ...photoField({ name: 'pricingTable', title: '(Ancien) Tableau récapitulatif des tarifs (image)', required: false, group: 'legacy' }), description: LEGACY_JOIN },
    localizedBlocks({ name: 'pricingMembership', title: '(Ancien) Adhésion au club (membres)', description: LEGACY_JOIN, group: 'legacy' }),
    localizedBlocks({ name: 'pricingTraining', title: '(Ancien) Pack formation', description: LEGACY_JOIN, group: 'legacy' }),
    localizedBlocks({ name: 'pricingAdvanced', title: '(Ancien) Pack complément de formation', description: LEGACY_JOIN, group: 'legacy' }),

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
      name: 'voucherUrl',
      title: 'Lien d’achat des bons de vol (facultatif)',
      description: 'Si les bons cadeaux s’achètent sur une page différente. Sinon, le bouton « Acheter un bon » utilise le lien de paiement ci-dessus.',
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
