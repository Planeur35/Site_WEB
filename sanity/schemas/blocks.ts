import { defineArrayMember, defineField, defineType } from 'sanity';

const linkAnnotation = {
  name: 'link',
  type: 'object',
  title: 'Lien',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      title: 'Adresse du lien',
      validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
  ],
};

/** Paragraphs, bold, italic and links only: the fewest options for members. */
export const simpleText = defineType({
  name: 'simpleText',
  title: 'Texte simple',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});

/** Headings, quotes, lists and photos: long pages managed by administrators. */
export const richText = defineType({
  name: 'richText',
  title: 'Texte enrichi',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Titre de section', value: 'h2' },
        { title: 'Sous-titre', value: 'h3' },
        { title: 'Citation', value: 'blockquote' },
      ],
      lists: [{ title: 'Liste à puces', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Description de la photo',
          type: 'string',
          validation: (rule) => rule.required().max(160),
        }),
        defineField({ name: 'caption', title: 'Légende (facultatif)', type: 'string' }),
      ],
    }),
  ],
});
