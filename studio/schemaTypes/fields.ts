import {defineField} from 'sanity'

/**
 * Champ photo réutilisable : recadrage intelligent (hotspot)
 * + description obligatoire (accessibilité et référencement).
 */
export const photoField = (options: {name?: string; title?: string; required?: boolean} = {}) => {
  const {name = 'image', title = 'Photo', required = true} = options

  return defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Description de la photo',
        type: 'string',
        description: 'Une phrase simple qui décrit la photo (utile pour les malvoyants et pour Google).',
        validation: (rule) => rule.required().max(160),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  })
}
