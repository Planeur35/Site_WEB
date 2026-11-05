import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedString, localizedText } from './fields';

/*
 * The season's price list ("Tarifs 2027"), shown on /tarifs. One document, updated each season:
 * change the season and the edition date, then the amounts. Prices are numbers in euros; the site
 * formats them ("1 137,69 €") and adds up the sample budgets itself.
 */

/** One price: an amount, or a text such as « Non applicable », with its optional details. */
function priceCell(name: string, title: string, hidden?: (parent: Record<string, unknown> | undefined) => boolean) {
  return defineField({
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    hidden: hidden ? ({ parent }) => hidden(parent as Record<string, unknown> | undefined) : undefined,
    fields: [
      defineField({
        name: 'amount',
        title: 'Montant (€)',
        description: 'En euros, avec les centimes si besoin : 1137.69. Vide si le prix est un texte (ci-dessous).',
        type: 'number',
        validation: (rule) => rule.min(0).precision(2),
      }),
      localizedString({
        name: 'label',
        title: 'Texte à la place du montant',
        description: 'Par exemple « Non applicable » ou « Non défini ». Ignoré si un montant est saisi.',
        max: 40,
      }),
      defineField({
        name: 'from',
        title: 'Afficher « à partir de »',
        type: 'boolean',
        initialValue: false,
      }),
      localizedString({ name: 'unit', title: 'Unité (facultatif)', description: 'Par exemple « / heure » ou « / jour ».', max: 20 }),
      localizedString({
        name: 'note',
        title: 'Précision sous le prix (facultatif)',
        description: 'Affichée en petit, par exemple « Offre moins de 18 ans, si scolarisé en Ille-et-Vilaine : 130 € ».',
        max: 160,
      }),
    ],
  });
}

const PRICING_MODES = [
  { title: 'Deux prix : moins de 25 ans / 25 ans et plus', value: 'ages' },
  { title: 'Un seul prix pour tous', value: 'single' },
  { title: 'Plusieurs options (ex. hauteurs de remorquage)', value: 'options' },
];

const pricingItem = defineArrayMember({
  name: 'pricingItem',
  title: 'Prestation',
  type: 'object',
  fields: [
    localizedString({ name: 'name', title: 'Nom', required: true, max: 90 }),
    localizedString({
      name: 'group',
      title: 'Regroupement (facultatif)',
      description: 'Les prestations qui se suivent avec le même regroupement sont présentées ensemble : « Illimité », « Par tranche », « À l’heure »…',
      max: 40,
    }),
    localizedText({ name: 'description', title: 'Description', rows: 3 }),
    localizedText({ name: 'includes', title: 'Comprend (facultatif)', rows: 3 }),
    localizedText({ name: 'excludes', title: 'Ne comprend pas (facultatif)', rows: 2 }),
    localizedText({
      name: 'conditions',
      title: 'Conditions (facultatif)',
      description: 'Affichées en petit sous la prestation : paiement en plusieurs fois, remboursement…',
      rows: 2,
    }),
    defineField({
      name: 'mode',
      title: 'Type de prix',
      type: 'string',
      options: { list: PRICING_MODES, layout: 'radio' },
      initialValue: 'ages',
      validation: (rule) => rule.required(),
    }),
    priceCell('under25', 'Prix moins de 25 ans', (parent) => parent?.mode !== 'ages'),
    priceCell('over25', 'Prix 25 ans et plus', (parent) => parent?.mode !== 'ages'),
    priceCell('price', 'Prix', (parent) => parent?.mode !== 'single'),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      hidden: ({ parent }) => (parent as { mode?: string } | undefined)?.mode !== 'options',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingOption',
          fields: [localizedString({ name: 'label', title: 'Option', required: true, max: 60 }), priceCell('price', 'Prix')],
          preview: {
            select: { title: 'label.fr', amount: 'price.amount' },
            prepare: ({ title, amount }) => ({ title, subtitle: amount != null ? `${amount} €` : undefined }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name.fr', group: 'group.fr', mode: 'mode', u: 'under25.amount', o: 'over25.amount', p: 'price.amount' },
    prepare: ({ title, group, mode, u, o, p }) => ({
      title,
      subtitle: [group, mode === 'ages' ? `${u ?? '–'} € / ${o ?? '–'} €` : mode === 'single' && p != null ? `${p} €` : undefined]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});

export default defineType({
  name: 'pricingPage',
  title: 'Page « Tarifs »',
  type: 'document',
  groups: [
    { name: 'general', title: 'Saison', default: true },
    { name: 'sections', title: 'Grille' },
    { name: 'budgets', title: 'Budgets types' },
    { name: 'conditions', title: 'Conditions' },
  ],
  fields: [
    defineField({
      name: 'season',
      title: 'Saison',
      description: 'L’année affichée dans le titre : « Tarifs 2027 ».',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'editionDate',
      title: 'Date d’édition',
      description: 'Affichée sous le titre : « Édition du 28 novembre 2025 ».',
      type: 'date',
      group: 'general',
    }),
    localizedText({ name: 'intro', title: 'Introduction (facultatif)', group: 'general', rows: 3 }),
    localizedText({
      name: 'ageRule',
      title: 'Règle du tarif moins de 25 ans',
      description: 'Affichée au-dessus de la grille.',
      group: 'general',
      rows: 2,
    }),
    defineField({
      name: 'document',
      title: 'Grille au format PDF (facultatif)',
      description: 'Proposée en téléchargement sur la page.',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'general',
    }),
    defineField({
      name: 'sections',
      title: 'Sections de la grille',
      description: 'Dans l’ordre de la page : Je découvre, J’apprends à piloter, Je suis breveté, Divers…',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingSection',
          fields: [
            localizedString({ name: 'title', title: 'Titre', required: true, max: 60 }),
            localizedText({ name: 'intro', title: 'Présentation (facultatif)', rows: 2 }),
            defineField({ name: 'items', title: 'Prestations', type: 'array', of: [pricingItem] }),
            defineField({
              name: 'conditions',
              title: 'Conditions de la section (facultatif)',
              description: 'Une condition par ligne de la liste. Affichées en petit sous la section.',
              type: 'array',
              of: [defineArrayMember({ type: 'object', name: 'pricingCondition', fields: [localizedText({ name: 'text', title: 'Texte', rows: 2, required: true })], preview: { select: { title: 'text.fr' } } })],
            }),
          ],
          preview: { select: { title: 'title.fr', items: 'items' }, prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} prestation(s)` }) },
        }),
      ],
    }),
    localizedText({
      name: 'budgetsIntro',
      title: 'Introduction des budgets types (facultatif)',
      description: 'Par exemple « Hors décollages ».',
      group: 'budgets',
      rows: 2,
    }),
    defineField({
      name: 'budgets',
      title: 'Budgets types',
      description: 'Le total est calculé par le site à partir des lignes.',
      type: 'array',
      group: 'budgets',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingBudget',
          fields: [
            localizedString({ name: 'title', title: 'Titre', required: true, max: 40 }),
            localizedString({ name: 'age', title: 'Âge (facultatif)', description: 'Par exemple « moins de 25 ans ».', max: 30 }),
            defineField({
              name: 'lines',
              title: 'Lignes',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'pricingBudgetLine',
                  fields: [
                    localizedString({ name: 'label', title: 'Libellé', required: true, max: 60 }),
                    defineField({ name: 'amount', title: 'Montant (€)', type: 'number', validation: (rule) => rule.required().min(0).precision(2) }),
                  ],
                  preview: { select: { title: 'label.fr', amount: 'amount' }, prepare: ({ title, amount }) => ({ title, subtitle: `${amount} €` }) },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title.fr', subtitle: 'age.fr' } },
        }),
      ],
    }),
    defineField({
      name: 'conditions',
      title: 'Conditions générales',
      description: 'Affichées en fin de page, une par ligne de la liste.',
      type: 'array',
      group: 'conditions',
      of: [defineArrayMember({ type: 'object', name: 'pricingGeneralCondition', fields: [localizedText({ name: 'text', title: 'Texte', rows: 2, required: true })], preview: { select: { title: 'text.fr' } } })],
    }),
  ],
  preview: {
    select: { season: 'season' },
    prepare: ({ season }) => ({ title: `Tarifs ${season ?? ''}`.trim() }),
  },
});
