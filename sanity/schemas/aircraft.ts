import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aircraft',
  title: 'Aircraft',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'registration',
      title: 'Registration',
      type: 'string',
      description: 'e.g. F-CILE, D-2729',
    }),
    defineField({
      name: 'callsign',
      title: 'Callsign',
      type: 'string',
      description: 'Short identifier, e.g. LE, B4, V',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Biplace école', value: 'biplace-ecole' },
          { title: 'Biplace performance', value: 'biplace-perf' },
          { title: 'Handiplaneur', value: 'handiplaneur' },
          { title: 'Monoplace débutant', value: 'monoplace-debut' },
          { title: 'Monoplace performance', value: 'monoplace-perf' },
          { title: 'Remorqueur', value: 'remorqueur' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      fields: [
        defineField({ name: 'wingspan', title: 'Wingspan', type: 'string' }),
        defineField({ name: 'glideRatio', title: 'Glide Ratio', type: 'string' }),
        defineField({ name: 'seats', title: 'Seats', type: 'number' }),
        defineField({ name: 'year', title: 'Year', type: 'number' }),
        defineField({ name: 'maxWeight', title: 'Max Weight', type: 'string' }),
      ],
    }),
    defineField({
      name: 'instrumentation',
      title: 'Instrumentation',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({
          name: 'fr',
          title: 'French',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within the same category',
    }),
  ],
  orderings: [
    {
      title: 'Category, then Sort Order',
      name: 'categorySort',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'photo',
    },
  },
});
