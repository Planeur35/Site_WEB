import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Button from '@/components/ui/Button';
import Kicker from '@/components/ui/Kicker';
import Section from '@/components/ui/Section';
import SitePageHero from '@/components/ui/SitePageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { allTariffsQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings, Tariff } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.discover' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/decouvrir' });
}

export default async function DiscoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('discover');
  const tp = await getTranslations('pricing');

  const [tariffs, settings] = await Promise.all([
    sanityFetch<Tariff[]>(allTariffsQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
  ]);
  // Adults first, then the reduced price
  const prices = tariffs
    .filter((tariff) => tariff.offer === 'vol-initiation')
    .sort((a, b) => b.amount - a.amount);

  return (
    <>
      <SitePageHero page="discover" kicker={t('heroKicker')} title={t('heroTitle')} variant={3} />

      {/* Introductory flights: text from Studio → Réglages du site → Textes des pages */}
      <Section id="vols-initiation" kicker={t('kicker')} title={t('title')}>
        <div className="grid gap-px border border-sky-900/10 bg-sky-900/10 md:grid-cols-[1.6fr_1fr]">
          <div className="bg-ciel p-8 md:p-10">
            <Kicker>{t('descriptionKicker')}</Kicker>
            <p className="max-w-xl whitespace-pre-line leading-relaxed text-slate-700">
              {localize(settings?.discoveryText, locale) ?? t('defaultDescription')}
            </p>
          </div>
          <div className="bg-ciel p-8 md:p-10">
            <Kicker>{t('priceKicker')}</Kicker>
            {prices.length === 0 && <div className="font-serif text-4xl text-sky-950">—</div>}
            <dl className="space-y-4">
              {prices.map((tariff) => {
                const details = localize(tariff.details, locale);
                return (
                  <div key={tariff._id}>
                    <dd className="font-serif text-4xl text-sky-950">{tp('amount', { amount: tariff.amount })}</dd>
                    <dt className="mt-1 text-sm text-slate-600">
                      {tariff.ageCategory ? tp(`ages.${tariff.ageCategory}`) : null}
                      {tariff.ageCategory && details ? ' · ' : null}
                      {details}
                    </dt>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </Section>

      {/* Online booking and payment: text from Studio, button from the payment link in the settings */}
      <Section id="reservation" kicker={t('bookingKicker')} title={t('bookingTitle')}>
        <p className="max-w-xl whitespace-pre-line leading-relaxed text-slate-700">
          {localize(settings?.bookingText, locale) ?? t('bookingText')}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {settings?.paymentUrl ? (
            <Button href={settings.paymentUrl} external>
              {t('bookingCta')}
            </Button>
          ) : (
            <Button href="/contact">{t('contactCta')}</Button>
          )}
          {settings?.paymentUrl && (
            <Button href="/contact" variant="outline">
              {t('questionCta')}
            </Button>
          )}
        </div>
      </Section>
    </>
  );
}
