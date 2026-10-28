import { defineField, defineType } from 'sanity';
import { localizedString } from './fields';

/**
 * One price line. The site groups lines by offer (packages, training, trial flight).
 * Values of `offer` and `ageCategory` are read by the site: do not rename them.
 */
export const OFFERS = [
  { title: 'Forfait 20h', value: 'forfait-20h' },
  { title: 'Forfait illimité', value: 'forfait-illimite' },
  { title: 'Pack formation', value: 'pack-formation' },
  { title: 'Pack complément de formation', value: 'pack-complement-formation' },
  { title: 'Vol d’initiation', value: 'vol-initiation' },
];

const AGES: Record<string, { title: string; value: string }[]> = {
  'forfait-20h': [
    { title: 'Moins de 25 ans', value: 'under25' },
    { title: 'Plus de 25 ans', value: 'over25' },
  ],
  'forfait-illimite': [
    { title: 'Moins de 25 ans', value: 'under25' },
    { title: 'Plus de 25 ans', value: 'over25' },
  ],
  'vol-initiation': [
    { title: 'Moins de 18 ans', value: 'under18' },
    { title: 'Adulte', value: 'adult' },
  ],
};

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
      description: 'Forfaits : moins ou plus de 25 ans. Vol d’initiation : moins de 18 ans ou adulte.',
      type: 'string',
      options: {
        list: [...AGES['forfait-20h'], ...AGES['vol-initiation']],
        layout: 'radio',
      },
      hidden: ({ document }) => !AGES[(document as TariffDoc | undefined)?.offer ?? ''],
      validation: (rule) =>
        rule.custom((value, context) => {
          const offer = (context.document as TariffDoc | undefined)?.offer ?? '';
          const allowed = AGES[offer];
          if (!allowed) return true;
          if (!value) return 'Choisissez une catégorie d’âge.';
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
