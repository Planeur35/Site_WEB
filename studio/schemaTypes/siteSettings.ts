import {defineArrayMember, defineField, defineType} from 'sanity'
import {photoField} from './fields'

/** Réglages du site : un seul document (administrateurs). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    {name: 'home', title: 'Page d’accueil'},
    {name: 'stats', title: 'Chiffres clés'},
    {name: 'texts', title: 'Textes des pages'},
    {name: 'contact', title: 'Contact et réseaux'},
    {name: 'links', title: 'Liens pratiques'},
  ],
  fields: [
    // Page d'accueil
    defineField({
      name: 'tagline',
      title: 'Phrase d’accroche du club',
      type: 'string',
      group: 'home',
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
            photoField({name: 'image', title: 'Photo'}),
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (rule) => rule.required().max(70),
            }),
            defineField({
              name: 'subtitle',
              title: 'Sous-titre',
              type: 'string',
              validation: (rule) => rule.max(140),
            }),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),

    // Chiffres clés (mis à jour à la main, une fois par an)
    defineField({name: 'statsYear', title: 'Année de référence', type: 'number', group: 'stats'}),
    defineField({name: 'membersCount', title: 'Nombre de membres', type: 'number', group: 'stats'}),
    defineField({name: 'flightHours', title: 'Heures de vol dans l’année', type: 'number', group: 'stats'}),
    defineField({name: 'glidersCount', title: 'Nombre de planeurs', type: 'number', group: 'stats'}),
    defineField({name: 'foundedYear', title: 'Année de fondation', type: 'number', group: 'stats'}),

    // Textes des pages
    defineField({
      name: 'joinText',
      title: 'Comment s’inscrire',
      description: 'Texte de la page « S’inscrire » : lieu, modalités d’inscription, pièces à fournir…',
      type: 'text',
      rows: 6,
      group: 'texts',
    }),
    defineField({
      name: 'discoveryText',
      title: 'Description d’un vol d’initiation',
      description: 'Texte de la page « Venez essayer » : déroulement, durée, conditions.',
      type: 'text',
      rows: 6,
      group: 'texts',
    }),

    // Contact
    defineField({
      name: 'contactEmail',
      title: 'Adresse e-mail du club',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.regex(/^\S+@\S+\.\S+$/, {name: 'e-mail'}).error('Adresse e-mail invalide.'),
    }),
    defineField({name: 'phone', title: 'Téléphone du club', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: 'Adresse du terrain', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'paymentUrl',
      title: 'Lien de la plateforme de paiement du club',
      description: 'Réservation et achat de bons de vol (particuliers et entreprises).',
      type: 'url',
      group: 'contact',
    }),
    defineField({name: 'facebookUrl', title: 'Page Facebook', type: 'url', group: 'contact'}),
    defineField({name: 'instagramUrl', title: 'Compte Instagram', type: 'url', group: 'contact'}),
    defineField({
      name: 'webcamUrl',
      title: 'Adresse de l’image de la webcam',
      description: 'Adresse directe de l’image (se termine souvent par .jpg). Elle est actualisée toutes les minutes sur le site.',
      type: 'url',
      group: 'contact',
    }),

    // Liens pratiques
    defineField({
      name: 'usefulLinks',
      title: 'Liens pratiques',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Nom du lien', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'url',
              title: 'Adresse',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'group',
              title: 'Rubrique',
              type: 'string',
              options: {list: ['Institutions', 'Préparation de vol', 'Météo et conditions', 'Communauté']},
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'group'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Réglages du site'})},
})
