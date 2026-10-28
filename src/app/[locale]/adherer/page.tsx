import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { allTariffsQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { AgeCategory, SiteSettings, Tariff, TariffOffer } from '@/lib/sanity/types';

export const revalidate = 60;

const PACKAGES: TariffOffer[] = ['forfait-20h', 'forfait-illimite'];
const TRAINING: TariffOffer[] = ['pack-formation', 'pack-complement-formation'];
const PACKAGE_AGES: AgeCategory[] = ['under25', 'over25'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.join' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/adherer' });
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('join');
  const tp = await getTranslations('pricing');

  const [tariffs, settings] = await Promise.all([
    sanityFetch<Tariff[]>(allTariffsQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
  ]);
  const find = (offer: TariffOffer, age?: AgeCategory) =>
    tariffs.find((tariff) => tariff.offer === offer && (age ? tariff.ageCategory === age : true));
  const euros = (tariff?: Tariff) => (tariff ? tp('amount', { amount: tariff.amount }) : '—');
  const joinText = localize(settings?.joinText, locale);
  const hasPackages = tariffs.some((tariff) => PACKAGES.includes(tariff.offer));
  const hasTraining = tariffs.some((tariff) => TRAINING.includes(tariff.offer));

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={t('heroTitle')} variant={2} />

      {hasPackages && (
        <Section kicker={t('packagesKicker')} title={t('packagesTitle')}>
          <div className="grid gap-px border border-sky-900/10 bg-sky-900/10 md:grid-cols-2">
            {PACKAGES.map((offer) => (
              <div key={offer} className="bg-ciel p-8 md:p-10">
                <h3 className="font-serif text-xl text-sky-950">{tp(`offers.${offer}`)}</h3>
                <dl className="mt-5 space-y-3 border-t border-sky-900/10 pt-5">
                  {PACKAGE_AGES.map((age) => {
                    const tariff = find(offer, age);
                    const details = localize(tariff?.details, locale);
                    return (
                      <div key={age} className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm text-slate-700">
                          {tp(`ages.${age}`)}
                          {details && <span className="block text-xs text-slate-600">{details}</span>}
                        </dt>
                        <dd className="font-serif text-2xl text-sky-950">{euros(tariff)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasTraining && (
        <Section kicker={t('trainingKicker')} title={t('trainingTitle')}>
          <div className="grid gap-px border border-sky-900/10 bg-sky-900/10 md:grid-cols-2">
            {TRAINING.map((offer) => {
              const tariff = find(offer);
              const details = localize(tariff?.details, locale);
              return (
                <div key={offer} className="bg-ciel p-8 md:p-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl text-sky-950">{tp(`offers.${offer}`)}</h3>
                    <div className="font-serif text-2xl text-sky-950">{euros(tariff)}</div>
                  </div>
                  {details && <p className="mt-4 border-t border-sky-900/10 pt-4 text-sm text-slate-600">{details}</p>}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      <Section kicker={t('howKicker')} title={t('howTitle')}>
        {joinText ? (
          <p className="max-w-2xl whitespace-pre-line leading-relaxed text-slate-700">{joinText}</p>
        ) : (
          <EmptyState>{t('howEmpty')}</EmptyState>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/contact">{t('contactCta')}</Button>
          <Button href="/decouvrir" variant="outline">
            {t('tryCta')}
          </Button>
        </div>
      </Section>
    </>
  );
}
