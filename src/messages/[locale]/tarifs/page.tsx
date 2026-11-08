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
import type { PricingPage, Tariff, TariffOffer } from '@/lib/sanity/types';

export const revalidate = 60;

type SeasonAge = 'under25' | 'over25';
const COLUMNS: SeasonAge[] = ['under25', 'over25'];

/** The rows of the price list, by group and in this order. A row with no price at all is not shown. */
const GROUPS: { key: string; offers: TariffOffer[] }[] = [
  { key: 'membership', offers: ['cotisation', 'participation-annuelle', 'participation-journaliere', 'elicense-ffvp'] },
  { key: 'flight', offers: ['forfait-illimite', 'forfait-20h', 'heures-10h'] },
  { key: 'hourly', offers: ['heure-monoplace', 'heure-biplace'] },
  { key: 'training', offers: ['pack-formation', 'pack-complement-formation'] },
];

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
];

/** The price of an offer for an age group: the line for that age, else the line without age (same price for everyone). */
function priceFor(tariffs: Tariff[], offer: TariffOffer, age: SeasonAge): Tariff | undefined {
  return (
    tariffs.find((tariff) => tariff.offer === offer && tariff.ageCategory === age) ??
    tariffs.find((tariff) => tariff.offer === offer && !tariff.ageCategory)
  );
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

  // ---- Table 1: every price ----
  const groups = GROUPS.map((group) => ({
    key: group.key,
    rows: group.offers.flatMap((offer) => {
      const prices = COLUMNS.map((age) => priceFor(tariffs, offer, age));
      return prices[0] || prices[1] ? [{ offer, prices }] : [];
    }),
  })).filter((group) => group.rows.length > 0);

  const initiationAdult = tariffs.find((tariff) => tariff.offer === 'vol-initiation' && tariff.ageCategory === 'adult');
  const initiationReduced = tariffs.find((tariff) => tariff.offer === 'vol-initiation' && tariff.ageCategory === 'under18');

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

        {groups.length > 0 && (
          <div className="overflow-x-auto border border-sky-900/10 bg-white">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <caption className="sr-only">{t('allTitle')}</caption>
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
                {groups.map((group) => (
                  <GroupRows key={group.key} title={t(`groups.${group.key}`)}>
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
                  </GroupRows>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(initiationAdult || initiationReduced) && (
          <div className="mt-10 border border-sky-900/10 bg-white p-6 md:p-8">
            <h3 className="font-serif text-2xl text-sky-950">{t('initiationTitle')}</h3>
            <dl className="mt-4 grid gap-6 sm:grid-cols-2">
              {initiationAdult && (
                <div>
                  <dt className="text-sm text-slate-600">{t('initiationAdult')}</dt>
                  <dd className="font-serif text-3xl text-sky-950">{money(initiationAdult.amount)}</dd>
                </div>
              )}
              {initiationReduced && (
                <div>
                  <dt className="text-sm text-slate-600">{t('initiationReduced')}</dt>
                  <dd className="font-serif text-3xl text-sky-950">{money(initiationReduced.amount)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6">
              <Button href="/decouvrir">{th('bookCta')}</Button>
            </div>
          </div>
        )}
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

/** A group heading row followed by its rows. */
function GroupRows({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <tr className="border-b border-sky-900/10 bg-ciel">
        <th scope="colgroup" colSpan={3} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
          {title}
        </th>
      </tr>
      {children}
    </>
  );
}

/** The free-text detail of a price line, under the amount. */
function Details({ tariff, locale }: { tariff: Tariff | undefined; locale: string }) {
  const details = localize(tariff?.details, locale);
  return details ? <span className="block text-xs text-slate-600">{details}</span> : null;
}
