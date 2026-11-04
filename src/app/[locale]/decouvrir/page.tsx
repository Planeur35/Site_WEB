import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Button from '@/components/ui/Button';
import Kicker from '@/components/ui/Kicker';
import Section from '@/components/ui/Section';
import SitePageHero from '@/components/ui/SitePageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize, nonEmpty } from '@/lib/sanity/localize';
import { allTariffsQuery, discoverPageQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { DiscoverPage, SiteSettings, Tariff } from '@/lib/sanity/types';

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

  const [tariffs, settings, page] = await Promise.all([
    sanityFetch<Tariff[]>(allTariffsQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<DiscoverPage | null>(discoverPageQuery, null),
  ]);
  // Adults first, then the reduced price
  const prices = tariffs
    .filter((tariff) => tariff.offer === 'vol-initiation')
    .sort((a, b) => b.amount - a.amount);

  // Texts come from the page document (Studio → Page « Venez essayer »).
  // The old plain-text fields of the site settings are used only while the new ones are empty.
  const flights = nonEmpty(localize(page?.flights, locale));
  const flightsPlain = localize(settings?.discoveryText, locale);
  const booking = nonEmpty(localize(page?.booking, locale));
  const bookingPlain = localize(settings?.bookingText, locale);
  const faq = (page?.faq ?? []).flatMap((item) => {
    const question = localize(item.question, locale);
    const answer = nonEmpty(localize(item.answer, locale));
    return question && answer ? [{ key: item._key, question, answer }] : [];
  });

  return (
    <>
      <SitePageHero page="discover" kicker={t('heroKicker')} title={t('heroTitle')} />

      {/* Introductory flights */}
      <Section id="vols-initiation" kicker={t('kicker')} title={t('title')}>
        <div className="grid gap-px border border-sky-900/10 bg-sky-900/10 md:grid-cols-[1.6fr_1fr]">
          <div className="bg-ciel p-8 md:p-10">
            <Kicker>{t('descriptionKicker')}</Kicker>
            {flights ? (
              <PortableText value={flights} className="max-w-xl" />
            ) : (
              <p className="max-w-xl whitespace-pre-line leading-relaxed text-slate-700">
                {flightsPlain ?? t('defaultDescription')}
              </p>
            )}
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

      {/* Online booking and payment */}
      <Section id="reservation" kicker={t('bookingKicker')} title={t('bookingTitle')}>
        {booking ? (
          <PortableText value={booking} className="max-w-2xl" />
        ) : (
          <p className="max-w-xl whitespace-pre-line leading-relaxed text-slate-700">{bookingPlain ?? t('bookingText')}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          {settings?.paymentUrl ? (
            <Button href={settings.paymentUrl} external>
              {t('bookingCta')}
            </Button>
          ) : (
            <Button href="/contact">{t('contactCta')}</Button>
          )}
          {settings?.paymentUrl && (
            <Button href="/contact" variant="secondary">
              {t('questionCta')}
            </Button>
          )}
        </div>
      </Section>

      {/* Frequently asked questions: each answer opens under its question (native <details>, no script) */}
      {faq.length > 0 && (
        <Section id="faq" kicker={t('faqKicker')} title={t('faqTitle')}>
          <div className="max-w-3xl border-t border-sky-900/15">
            {faq.map((item) => (
              <details key={item.key} className="group border-b border-sky-900/15">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-lg leading-snug text-sky-950 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="text-sm text-sky-700 transition-transform group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <PortableText value={item.answer} className="pb-6" />
              </details>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
