import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'clubName',
      title: 'Club Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'object',
      fields: [
        defineField({ name: 'fr', title: 'French', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
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
              title: 'URL',
              type: 'url',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'webcamUrl',
      title: 'Webcam URL',
      type: 'url',
    }),
    defineField({
      name: 'weglideUrl',
      title: 'WeGlide URL',
      type: 'url',
    }),
    defineField({
      name: 'aerodromeCoordinates',
      title: 'Aerodrome Coordinates',
      type: 'object',
      fields: [
        defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'clubName',
    },
  },
});
