import { defineField, defineType } from 'sanity';

/** A partner shown with its logo in the side band of the news page. */
export default defineType({
  name: 'partner',
  title: 'Partenaire',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      description: 'Affiché si le logo n’est pas encore ajouté, et lu par les lecteurs d’écran.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Sur fond transparent ou blanc, assez large (600 pixels ou plus). PNG, JPG et SVG conviennent.',
      type: 'image',
    }),
    defineField({
      name: 'url',
      title: 'Site web (facultatif)',
      description: 'Si renseigné, le logo devient un lien vers le site du partenaire.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordre d’affichage',
      description: '1 = affiché en premier.',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{ title: 'Ordre d’affichage', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'logo' } },
});
