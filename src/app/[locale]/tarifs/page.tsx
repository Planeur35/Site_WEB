import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Section from '@/components/ui/Section';
import SitePageHero from '@/components/ui/SitePageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize, nonEmpty } from '@/lib/sanity/localize';
import { allTariffsQuery, pricingPageQuery } from '@/lib/sanity/queries';
import type { PriceGroup, PricingPage, Tariff, TariffOffer } from '@/lib/sanity/types';

export const revalidate = 60;

type SeasonAge = 'under25' | 'over25';
const COLUMNS: SeasonAge[] = ['under25', 'over25'];

/** The three headings of the price list, with the anchor used by the menus and the « Venez voler ! » page. */
const GROUP_ORDER: { key: PriceGroup; anchor: string }[] = [
  { key: 'discover', anchor: 'je-decouvre' },
  { key: 'learn', anchor: 'japprends' },
  { key: 'licensed', anchor: 'je-suis-brevete' },
];

/** Usual order of the offers inside a heading (the trial flight has its own block). */
const OFFER_ORDER: TariffOffer[] = [
  'cotisation',
  'participation-annuelle',
  'participation-journaliere',
  'elicense-ffvp',
  'forfait-illimite',
  'forfait-20h',
  'heures-10h',
  'heure-monoplace',
  'heure-biplace',
  'treuillee',
  'remorque',
  'pack-formation',
  'pack-complement-formation',
];

/** Usual heading of each offer, unless the line itself names one in the Studio (« Rubrique de la page Tarifs »). */
const DEFAULT_GROUP: Partial<Record<TariffOffer, PriceGroup>> = {
  'vol-initiation': 'discover',
  'pack-formation': 'learn',
  'pack-complement-formation': 'learn',
};
const groupOf = (tariff: Tariff): PriceGroup => tariff.group ?? DEFAULT_GROUP[tariff.offer] ?? 'licensed';

/** Offers that have a unit in the messages (`pricing.units.<offer>`). */
const UNIT_OFFERS: TariffOffer[] = [
  'cotisation',
  'participation-annuelle',
  'participation-journaliere',
  'elicense-ffvp',
  'forfait-illimite',
  'forfait-20h',
  'heures-10h',
  'heure-monoplace',
  'heure-biplace',
  'treuillee',
  'remorque',
];

/**
 * The price of an offer for an age group: the line for that age, else the « all ages » line.
 * Lines saved before the age became compulsory (no age at all) count as « all ages » too.
 */
function priceFor(tariffs: Tariff[], offer: TariffOffer, age: SeasonAge): Tariff | undefined {
  return (
    tariffs.find((tariff) => tariff.offer === offer && tariff.ageCategory === age) ??
    tariffs.find((tariff) => tariff.offer === offer && (tariff.ageCategory === 'all' || !tariff.ageCategory))
  );
}

/** Display order of an offer: the smallest « order » among its lines (lines without one keep the usual order). */
function orderOf(tariffs: Tariff[], offer: TariffOffer): number {
  const orders = tariffs.filter((tariff) => tariff.offer === offer).map((tariff) => tariff.sortOrder ?? 1000);
  return orders.length > 0 ? Math.min(...orders) : 1000;
}

const round = (value: number) => Math.round(value * 100) / 100;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.pricing' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/tarifs' });
}

export default async function PricingPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricingPage');
  const tp = await getTranslations('pricing');
  const th = await getTranslations('header');

  const [tariffs, page] = await Promise.all([
    sanityFetch<Tariff[]>(allTariffsQuery, []),
    sanityFetch<PricingPage | null>(pricingPageQuery, null),
  ]);

  const intro = nonEmpty(localize(page?.intro, locale));
  const notes = nonEmpty(localize(page?.notes, locale));

  // ---- Price list: « Je découvre », « J’apprends à piloter », « Je suis breveté ou activité à la carte » ----
  const groups = GROUP_ORDER.map(({ key, anchor }) => {
    const inGroup = tariffs.filter((tariff) => groupOf(tariff) === key);
    const rows = OFFER_ORDER.flatMap((offer, position) => {
      const prices = COLUMNS.map((age) => priceFor(inGroup, offer, age));
      return prices[0] || prices[1] ? [{ offer, prices, order: orderOf(inGroup, offer), position }] : [];
    })
      // Studio « Ordre d’affichage » first, then the usual order
      .sort((a, b) => a.order - b.order || a.position - b.position);
    const initiation = [
      { age: 'adult', label: t('initiationAdult') },
      { age: 'under18', label: t('initiationReduced') },
      { age: 'all', label: tp('ages.all') },
    ].flatMap(({ age, label }) => {
      const tariff = inGroup.find((x) => x.offer === 'vol-initiation' && x.ageCategory === age);
      return tariff ? [{ age, label, amount: tariff.amount }] : [];
    });
    return { key, anchor, rows, initiation };
  }).filter((group) => group.rows.length > 0 || group.initiation.length > 0);

  // ---- Table 2: examples of the cost of a season ----
  const scenarios = (page?.scenarios ?? []).flatMap((scenario) => {
    const name = localize(scenario.name, locale);
    const lines = (scenario.lines ?? []).map((line) => {
      const quantity = line.quantity ?? 1;
      const costs = COLUMNS.map((age) => {
        const price = priceFor(tariffs, line.offer, age);
        return price ? round(price.amount * quantity) : null;
      });
      return { key: line._key, offer: line.offer, quantity, costs };
    });
    if (!name || lines.length === 0) return [];
    // A total is shown only when every line has a price for that age group
    const totals = COLUMNS.map((_, index) => {
      let sum: number | null = 0;
      for (const line of lines) {
        const cost = line.costs[index];
        sum = sum === null || cost === null ? null : round(sum + cost);
      }
      return sum;
    });
    return [{ key: scenario._key, name, description: localize(scenario.description, locale), lines, totals }];
  });

  const money = (amount: number | null | undefined) => (amount == null ? '—' : tp('amount', { amount }));
  const headCell = 'px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-sky-800';
  const isEmpty = !intro && groups.length === 0 && scenarios.length === 0;

  return (
    <>
      <SitePageHero page="pricing" kicker={t('heroKicker')} title={t('heroTitle')} variant={2} />

      <Section id="grille" kicker={t('allKicker')} title={t('allTitle')}>
        {isEmpty && <EmptyState>{t('empty')}</EmptyState>}
        {intro && <PortableText value={intro} className="mb-10 max-w-3xl" />}

        <div className="space-y-14">
          {groups.map((group) => (
            <div key={group.key} id={group.anchor} className="scroll-mt-40">
              <h3 className="font-serif text-2xl text-sky-950 md:text-3xl">{t(`groups.${group.key}`)}</h3>

              {group.rows.length > 0 && (
                <div className="mt-5 overflow-x-auto border border-sky-900/10 bg-white">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <caption className="sr-only">{t(`groups.${group.key}`)}</caption>
                    <thead>
                      <tr className="border-b border-sky-900/15 bg-horizon/60">
                        <th scope="col" className={headCell}>
                          {t('columnOffer')}
                        </th>
                        {COLUMNS.map((age) => (
                          <th key={age} scope="col" className={headCell}>
                            {tp(`ages.${age}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map(({ offer, prices }) => {
                        const shared = prices[0] !== undefined && prices[0] === prices[1];
                        const unit = UNIT_OFFERS.includes(offer) ? tp(`units.${offer}`) : null;
                        return (
                          <tr key={offer} className="border-b border-sky-900/10 last:border-0">
                            <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                              {tp(`offers.${offer}`)}
                              {unit && <span className="block text-xs font-normal text-slate-600">{unit}</span>}
                            </th>
                            {shared ? (
                              <td colSpan={2} className="px-4 py-3 tabular-nums">
                                <span className="font-medium text-sky-950">{money(prices[0]?.amount)}</span>{' '}
                                <span className="text-xs text-slate-600">({t('allAges')})</span>
                                <Details tariff={prices[0]} locale={locale} />
                              </td>
                            ) : (
                              prices.map((price, index) => (
                                <td key={COLUMNS[index]} className="px-4 py-3 tabular-nums">
                                  <span className="font-medium text-sky-950">{money(price?.amount)}</span>
                                  <Details tariff={price} locale={locale} />
                                </td>
                              ))
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {group.initiation.length > 0 && (
                <div className="mt-5 border border-sky-900/10 bg-white p-6 md:p-8">
                  <h4 className="font-serif text-xl text-sky-950">{t('initiationTitle')}</h4>
                  <dl className="mt-4 grid gap-6 sm:grid-cols-2">
                    {group.initiation.map((price) => (
                      <div key={price.age}>
                        <dt className="text-sm text-slate-600">{price.label}</dt>
                        <dd className="font-serif text-3xl text-sky-950">{money(price.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6">
                    <Button href="/decouvrir">{th('bookCta')}</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {scenarios.length > 0 && (
        <Section id="exemples" kicker={t('exampleKicker')} title={t('exampleTitle')} sub={t('exampleSub')}>
          <div className="space-y-12">
            {scenarios.map((scenario) => (
              <div key={scenario.key}>
                <h3 className="font-serif text-2xl text-sky-950">{scenario.name}</h3>
                {scenario.description && (
                  <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-slate-600">{scenario.description}</p>
                )}
                <div className="mt-4 overflow-x-auto border border-sky-900/10 bg-white">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <caption className="sr-only">{scenario.name}</caption>
                    <thead>
                      <tr className="border-b border-sky-900/15 bg-horizon/60">
                        <th scope="col" className={headCell}>
                          {t('columnItem')}
                        </th>
                        {COLUMNS.map((age) => (
                          <th key={age} scope="col" className={headCell}>
                            {tp(`ages.${age}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scenario.lines.map((line) => (
                        <tr key={line.key} className="border-b border-sky-900/10">
                          <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                            {tp(`offers.${line.offer}`)}
                            {line.quantity !== 1 && <span className="ml-2 font-normal text-slate-600">{t('quantity', { count: line.quantity })}</span>}
                          </th>
                          {line.costs.map((cost, index) => (
                            <td key={COLUMNS[index]} className="px-4 py-3 tabular-nums text-slate-800">
                              {money(cost)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-horizon/60">
                        <th scope="row" className="px-4 py-3 font-semibold text-sky-950">
                          {t('total')}
                        </th>
                        {scenario.totals.map((total, index) => (
                          <td key={COLUMNS[index]} className="px-4 py-3 font-serif font-normal text-xl tabular-nums text-sky-950">
                            {total === null ? <span className="text-sm text-slate-600">{t('unavailable')}</span> : money(total)}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
          {notes && <PortableText value={notes} className="mt-10 max-w-3xl text-sm" />}
          <div className="mt-10">
            <Button href="/adherer">{t('cta')}</Button>
          </div>
        </Section>
      )}
    </>
  );
}

/** The free-text detail of a price line, under the amount. */
function Details({ tariff, locale }: { tariff: Tariff | undefined; locale: string }) {
  const details = localize(tariff?.details, locale);
  return details ? <span className="block text-xs text-slate-600">{details}</span> : null;
}
