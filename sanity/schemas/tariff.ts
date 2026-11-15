import { defineField, defineType } from 'sanity';
import { localizedString } from './fields';

/**
 * One price line. The site groups lines by offer (packages, training, trial flight).
 * Values of `offer` and `ageCategory` are read by the site: do not rename them.
 */
export const OFFERS = [
  { title: 'Cotisation annuelle', value: 'cotisation' },
  { title: 'Participation annuelle aux frais de fonctionnement', value: 'participation-annuelle' },
  { title: 'Participation journalière aux frais de fonctionnement', value: 'participation-journaliere' },
  { title: 'E-licence assurance FFVP (annuelle)', value: 'elicense-ffvp' },
  { title: 'Forfait illimité', value: 'forfait-illimite' },
  { title: 'Forfait 20h', value: 'forfait-20h' },
  { title: '10 heures supplémentaires', value: 'heures-10h' },
  { title: 'Heure de vol en monoplace', value: 'heure-monoplace' },
  { title: 'Heure de vol en biplace', value: 'heure-biplace' },
  { title: 'Pack formation', value: 'pack-formation' },
  { title: 'Pack complément de formation', value: 'pack-complement-formation' },
  { title: 'Vol d’initiation', value: 'vol-initiation' },
];

const UNDER25 = { title: 'Moins de 25 ans', value: 'under25' };
const OVER25 = { title: 'Plus de 25 ans', value: 'over25' };
const UNDER18 = { title: 'Moins de 18 ans', value: 'under18' };
const ADULT = { title: 'Adulte', value: 'adult' };
const ALL_AGES = { title: 'Tous âges', value: 'all' };

/** Age categories allowed for each offer. The trial flight uses 18 years, everything else 25 years. */
const AGES: Record<string, { title: string; value: string }[]> = Object.fromEntries(
  OFFERS.map((offer) => [offer.value, offer.value === 'vol-initiation' ? [UNDER18, ADULT, ALL_AGES] : [UNDER25, OVER25, ALL_AGES]]),
);

type TariffDoc = { _id: string; offer?: string; ageCategory?: string };

export default defineType({
  name: 'tariff',
  title: 'Tarif',
  type: 'document',
  fields: [
    defineField({
      name: 'offer',
      title: 'Offre',
      type: 'string',
      options: { list: OFFERS },
      validation: (rule) =>
        rule.required().custom(async (_value, context) => {
          // Prevent entering the same price twice
          const doc = context.document as TariffDoc | undefined;
          if (!doc?.offer) return true;
          const id = doc._id.replace(/^drafts\./, '');
          const count = await context
            .getClient({ apiVersion: '2024-01-01' })
            .fetch<number>(
              'count(*[_type == "tariff" && offer == $offer && ageCategory == $age && !(_id in [$id, "drafts." + $id])])',
              { offer: doc.offer, age: doc.ageCategory ?? null, id },
            );
          return count > 0 ? 'Ce tarif existe déjà.' : true;
        }),
    }),
    defineField({
      name: 'ageCategory',
      title: 'Catégorie d’âge',
      description:
        'Toujours à choisir. Moins ou plus de 25 ans pour les offres de la saison, moins de 18 ans ou adulte pour le vol d’initiation. « Tous âges » si le prix est le même pour tout le monde.',
      type: 'string',
      options: {
        list: [UNDER25, OVER25, UNDER18, ADULT, ALL_AGES],
        layout: 'radio',
      },
      // Shown as soon as an offer is chosen
      hidden: ({ document }) => !(document as TariffDoc | undefined)?.offer,
      validation: (rule) =>
        rule.custom((value, context) => {
          const offer = (context.document as TariffDoc | undefined)?.offer ?? '';
          const allowed = AGES[offer];
          if (!value) return 'Choisissez une catégorie d’âge.';
          if (!allowed) return true;
          return allowed.some((a) => a.value === value) ? true : 'Catégorie non prévue pour cette offre.';
        }),
    }),
    defineField({
      name: 'amount',
      title: 'Montant (€)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    localizedString({
      name: 'details',
      title: 'Précisions (facultatif)',
      description: 'Par exemple : « par an », « 5 vols », « 20 minutes de vol ».',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordre d’affichage',
      description:
        '1 = affiché en premier, dans sa rubrique de la grille des tarifs. Donnez le même numéro aux lignes d’une même offre (par exemple moins de 25 ans et plus de 25 ans). La liste du Studio suit cet ordre.',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: 'Ordre d’affichage', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }, { field: 'offer', direction: 'asc' }] },
  ],
  preview: {
    select: { offer: 'offer', age: 'ageCategory', amount: 'amount' },
    prepare: ({ offer, age, amount }) => {
      const offerTitle = OFFERS.find((o) => o.value === offer)?.title ?? 'Offre à choisir';
      const ageTitle = Object.values(AGES)
        .flat()
        .find((a) => a.value === age)?.title;
      return {
        title: ageTitle ? `${offerTitle} – ${ageTitle}` : offerTitle,
        subtitle: amount != null ? `${amount} €` : 'Montant à saisir',
      };
    },
  },
});
