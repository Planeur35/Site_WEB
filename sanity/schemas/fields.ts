import { defineField } from 'sanity';

// Bilingual fields are stored as { fr, en }. French is the source; English is
// optional and the site falls back to French when it is empty.

interface LocalizedOptions {
  name: string;
  title: string;
  description?: string;
  group?: string;
  required?: boolean;
  max?: number;
}

const FR = 'Français';
const EN = 'English (facultatif, le français est affiché sinon)';

export function localizedString({ name, title, description, group, required, max }: LocalizedOptions) {
  return defineField({
    name,
    title,
    description,
    group,
    type: 'object',
    options: { collapsible: false },
    fields: [
      defineField({
        name: 'fr',
        title: FR,
        type: 'string',
        validation: (rule) => {
          const r = max ? rule.max(max) : rule;
          return required ? r.required() : r;
        },
      }),
      defineField({
        name: 'en',
        title: EN,
        type: 'string',
        validation: (rule) => (max ? rule.max(max) : rule),
      }),
    ],
  });
}

export function localizedText({
  name,
  title,
  description,
  group,
  required,
  max,
  rows = 4,
}: LocalizedOptions & { rows?: number }) {
  return defineField({
    name,
    title,
    description,
    group,
    type: 'object',
    fields: [
      defineField({
        name: 'fr',
        title: FR,
        type: 'text',
        rows,
        validation: (rule) => {
          const r = max ? rule.max(max) : rule;
          return required ? r.required() : r;
        },
      }),
      defineField({
        name: 'en',
        title: EN,
        type: 'text',
        rows,
        validation: (rule) => (max ? rule.max(max) : rule),
      }),
    ],
  });
}

/** `blockType` is `simpleText` (members) or `richText` (administrators). */
export function localizedBlocks({
  name,
  title,
  description,
  group,
  required,
  blockType = 'richText',
}: Omit<LocalizedOptions, 'max'> & { blockType?: 'simpleText' | 'richText' }) {
  return defineField({
    name,
    title,
    description,
    group,
    type: 'object',
    fields: [
      defineField({
        name: 'fr',
        title: FR,
        type: blockType,
        validation: (rule) => (required ? rule.required() : rule),
      }),
      defineField({ name: 'en', title: EN, type: blockType }),
    ],
  });
}

/** Photo with hotspot and a required description (accessibility and SEO). */
export function photoField({
  name = 'image',
  title = 'Photo',
  required = true,
  group,
}: { name?: string; title?: string; required?: boolean; group?: string } = {}) {
  return defineField({
    name,
    title,
    group,
    type: 'image',
    options: { hotspot: true },
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
  });
}
