import {defineField, defineType} from 'sanity'

/**
 * Offres tarifaires du club. Une offre = une ligne du tableau des tarifs.
 * La rubrique (Forfaits / Formation / Baptêmes) est déduite de l'offre par le site.
 */
const FORFAITS = ['forfait-20h', 'forfait-illimite']

const OFFERS = [
  {title: 'Forfait 20h', value: 'forfait-20h'},
  {title: 'Forfait illimité', value: 'forfait-illimite'},
  {title: 'Pack formation', value: 'pack-formation'},
  {title: 'Pack complément de formation', value: 'pack-complement-formation'},
  {title: 'Vol d’initiation', value: 'vol-initiation'},
]

const AGES = [
  {title: 'Moins de 25 ans', value: 'under25'},
  {title: 'Plus de 25 ans', value: 'over25'},
]

type TariffDoc = {_id: string; offer?: string; ageCategory?: string}

export const tariff = defineType({
  name: 'tariff',
  title: 'Tarif',
  type: 'document',
  fields: [
    defineField({
      name: 'offer',
      title: 'Offre',
      type: 'string',
      options: {list: OFFERS},
      validation: (rule) =>
        rule.required().custom(async (_value, context) => {
          // Empêche de saisir deux fois le même tarif
          const doc = context.document as TariffDoc | undefined
          if (!doc?.offer) return true
          const id = doc._id.replace(/^drafts\./, '')
          const count = await context
            .getClient({apiVersion: '2024-01-01'})
            .fetch<number>(
              'count(*[_type == "tariff" && offer == $offer && ageCategory == $age && !(_id in [$id, "drafts." + $id])])',
              {offer: doc.offer, age: doc.ageCategory ?? null, id},
            )
          return count > 0 ? 'Ce tarif existe déjà.' : true
        }),
    }),
    defineField({
      name: 'ageCategory',
      title: 'Catégorie d’âge',
      description: 'Uniquement pour les forfaits.',
      type: 'string',
      options: {list: AGES, layout: 'radio'},
      hidden: ({document}) => !FORFAITS.includes((document as TariffDoc | undefined)?.offer ?? ''),
      validation: (rule) =>
        rule.custom((value, context) => {
          const offer = (context.document as TariffDoc | undefined)?.offer ?? ''
          return FORFAITS.includes(offer) && !value ? 'Choisissez une catégorie d’âge.' : true
        }),
    }),
    defineField({
      name: 'amount',
      title: 'Montant (€)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'details',
      title: 'Précisions (facultatif)',
      description: 'Par exemple : « par an », « 5 vols », « durée du vol ».',
      type: 'string',
    }),
  ],
  preview: {
    select: {offer: 'offer', age: 'ageCategory', amount: 'amount'},
    prepare: ({offer, age, amount}) => {
      const offerTitle = OFFERS.find((o) => o.value === offer)?.title ?? 'Offre à choisir'
      const ageTitle = AGES.find((a) => a.value === age)?.title
      return {
        title: ageTitle ? `${offerTitle} – ${ageTitle}` : offerTitle,
        subtitle: amount != null ? `${amount} €` : 'Montant à saisir',
      }
    },
  },
})
