import { defineField, defineType } from 'sanity';
import { localizedString } from './fields';

/** A partner, funder or label shown above the footer and on the association page. */
export default defineType({
  name: 'partner',
  title: 'Partenaire',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Le nom complet, lu par les lecteurs d’écran à la place du logo.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description:
        'De préférence le logo officiel, sur fond transparent (PNG ou SVG), en bonne définition (au moins 300 px de large). Il est affiché dans ses couleurs, sans recadrage.',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Site du partenaire',
      type: 'url',
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Fédération ou comité sportif', value: 'federation' },
          { title: 'Collectivité ou État', value: 'public' },
          { title: 'Label', value: 'label' },
          { title: 'Entreprise ou mécène', value: 'sponsor' },
        ],
        layout: 'radio',
      },
      initialValue: 'federation',
      validation: (rule) => rule.required(),
    }),
    localizedString({
      name: 'role',
      title: 'Rôle en une ligne (facultatif)',
      description: 'Affiché sous le logo sur la page « L’association ». Exemple : « Fédération française du vol en planeur ».',
      max: 120,
    }),
    defineField({
      name: 'openToAll',
      title: 'Afficher dans le bandeau « Ouvert à tous » de l’accueil',
      description: 'Pour un label handisport, par exemple.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: 'Les plus petits nombres d’abord.',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{ title: 'Ordre d’affichage', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', media: 'logo', kind: 'kind' },
    prepare: ({ title, media, kind }) => ({
      title,
      media,
      subtitle: { federation: 'Fédération ou comité', public: 'Collectivité ou État', label: 'Label', sponsor: 'Entreprise ou mécène' }[
        kind as string
      ],
    }),
  },
});
