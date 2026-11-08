import { defineArrayMember, defineField, defineType } from 'sanity';
import { localizedBlocks, localizedString, localizedText } from './fields';
import { OFFERS } from './tariff';

// Items that can enter the cost of a season (everything except the trial flight)
const SEASON_OFFERS = OFFERS.filter((offer) => offer.value !== 'vol-initiation');

/** Page « Tarifs »: intro text and examples of the cost of a season. The prices themselves come from the `tariff` documents. */
export default defineType({
  name: 'pricingPage',
  title: 'Page « Tarifs »',
  type: 'document',
  fields: [
    localizedBlocks({
      name: 'intro',
      title: 'Texte d’introduction',
      description: 'Affiché en haut de la page, au-dessus de la grille des tarifs. Les montants se saisissent dans « Tarifs (montants) ».',
    }),
    defineField({
      name: 'scenarios',
      title: 'Exemples de coût d’une saison',
      description:
        'Chaque exemple devient un tableau, avec un total pour les moins de 25 ans et un total pour les plus de 25 ans. Les montants sont calculés par le site à partir des fiches « Tarifs (montants) » : il suffit de choisir les postes et leur quantité.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localizedString({ name: 'name', title: 'Nom de l’exemple', required: true, max: 80 }),
            localizedText({ name: 'description', title: 'Description (facultatif)', rows: 3 }),
            defineField({
              name: 'lines',
              title: 'Postes de dépenses',
              type: 'array',
              validation: (rule) => rule.required().min(1),
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'offer',
                      title: 'Poste',
                      type: 'string',
                      options: { list: SEASON_OFFERS },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'quantity',
                      title: 'Quantité',
                      description: 'Par exemple 12 (jours de vol) ou 8 (heures de vol). 1 pour un poste annuel.',
                      type: 'number',
                      initialValue: 1,
                      validation: (rule) => rule.required().min(0),
                    }),
                  ],
                  preview: {
                    select: { offer: 'offer', quantity: 'quantity' },
                    prepare: ({ offer, quantity }) => ({
                      title: OFFERS.find((o) => o.value === offer)?.title ?? 'Poste à choisir',
                      subtitle: `× ${quantity ?? 1}`,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'name.fr' } },
        }),
      ],
    }),
    localizedBlocks({
      name: 'notes',
      title: 'Notes sous les tableaux (facultatif)',
      description: 'Conditions, précisions, mentions à retenir.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Page « Tarifs »' }) },
});
