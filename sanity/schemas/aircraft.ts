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
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Training', value: 'training' },
          { title: 'Performance', value: 'performance' },
          { title: 'Tandem', value: 'tandem' },
        ],
      },
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
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({
          name: 'fr',
          title: 'French',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'block' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'photo',
    },
  },
});
