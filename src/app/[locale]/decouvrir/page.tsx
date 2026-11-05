import type { Metadata } from 'next';
import { Briefcase, ChevronDown, Gift } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import { Link } from '@/i18n/navigation';
import PortableText from '@/components/sanity/PortableText';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import FlightTrace from '@/components/ui/FlightTrace';
import FrenchOnlyNote from '@/components/ui/FrenchOnlyNote';
import Kicker from '@/components/ui/Kicker';
import Section from '@/components/ui/Section';
import SitePageHero from '@/components/ui/SitePageHero';
import StickyBookingBar from '@/components/ui/StickyBookingBar';
import TextLink from '@/components/ui/TextLink';
import { formatAmount } from '@/lib/pricing';
import { sanityFetch } from '@/lib/sanity/fetch';
import { isFrenchFallback, localize, nonEmpty } from '@/lib/sanity/localize';
import { allTariffsQuery, discoverPageQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { DiscoverPage, SiteSettings, Tariff } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.discover' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/decouvrir' });
}

/** The price panel; the mobile booking bar hides while it is on screen. */
const PANEL_ID = 'tarif';

const sectionTitle = 'font-display text-[1.875rem] leading-[1.12] font-semibold text-azur lg:text-h2';
const subTitle = 'font-display text-h4 font-semibold text-azur';

export default async function DiscoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('discover');
  const tp = await getTranslations('pricing');
  const tNav = await getTranslations('nav');

  const [tariffs, settings, page] = await Promise.all([
    sanityFetch<Tariff[]>(allTariffsQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<DiscoverPage | null>(discoverPageQuery, null),
  ]);
  // Adults first, then the reduced price
  const prices = tariffs.filter((tariff) => tariff.offer === 'vol-initiation').sort((a, b) => b.amount - a.amount);
  const paymentUrl = settings?.paymentUrl;

  // Texts come from the page document (Studio → Page « Venez essayer »).
  // The old plain-text fields of the site settings are used only while the new ones are empty.
  const flights = nonEmpty(localize(page?.flights, locale));
  const flightsPlain = localize(settings?.discoveryText, locale);
  const booking = nonEmpty(localize(page?.booking, locale));
  const bookingPlain = localize(settings?.bookingText, locale);
  const textsFrench = [page?.flights, page?.booking].some((field) => isFrenchFallback(field, locale));
  const faqFrench = (page?.faq ?? []).some((item) => isFrenchFallback(item.question, locale) || isFrenchFallback(item.answer, locale));
  const faq = (page?.faq ?? []).flatMap((item) => {
    const question = localize(item.question, locale);
    const answer = nonEmpty(localize(item.answer, locale));
    return question && answer ? [{ key: item._key, question, answer }] : [];
  });

  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`step${n}Title` as 'step1Title'),
    text: t(`step${n}Text` as 'step1Text'),
  }));

  // « Bon à savoir »: the four Studio fields show only once filled in
  const access = settings?.address?.split('\n')[0];
  const practical = [
    { key: 'age', label: t('practicalAge'), text: localize(page?.practicalAge, locale) },
    { key: 'weight', label: t('practicalWeight'), text: localize(page?.practicalWeight, locale) },
    { key: 'duration', label: t('practicalDuration'), text: localize(page?.practicalDuration, locale) },
    { key: 'weather', label: t('practicalWeather'), text: localize(page?.practicalWeather, locale) },
    { key: 'clothes', label: t('practicalClothes'), text: t('practicalClothesText') },
  ].flatMap((item) => (item.text ? [{ key: item.key, label: item.label, body: <>{item.text}</> }] : []));
  practical.push({
    key: 'access',
    label: t('practicalAccess'),
    body: (
      <>
        {access && <span className="block">{access}</span>}
        <TextLink href={{ pathname: '/contact', hash: 'plan' }}>{t('practicalMap')}</TextLink>
      </>
    ),
  });

  const voucherUrl = settings?.voucherUrl ?? paymentUrl;

  // Short price line for the mobile booking bar
  const [adult, young] = prices;
  const barPrice = adult ? (
    young?.ageCategory === 'under18' ? (
      tNav('trialPrice', { adult: formatAmount(adult.amount, locale), young: formatAmount(young.amount, locale) })
    ) : (
      tNav('trialPriceSingle', { amount: formatAmount(adult.amount, locale) })
    )
  ) : (
    tp('offers.vol-initiation')
  );

  const bookingButton = (size: 'sm' | 'lg', label: string) =>
    paymentUrl ? (
      <Button href={paymentUrl} external size={size} fullWidth={size === 'lg'} mainCta>
        {label}
      </Button>
    ) : (
      <Button href="/contact" size={size} fullWidth={size === 'lg'} mainCta>
        {size === 'lg' ? t('contactCta') : label}
      </Button>
    );

  const pricePanel = (
    <aside id={PANEL_ID} aria-label={t('bookingTitle')} className="scroll-mt-28 rounded-md bg-ciel p-6 lg:p-8">
      {prices.length > 0 && (
        <dl className="mb-6 grid grid-cols-2 gap-4 sm:block sm:divide-y sm:divide-horizon">
          {prices.map((tariff) => (
            <div
              key={tariff._id}
              className="flex flex-col-reverse gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:py-3 sm:first:pt-0"
            >
              <dt className="text-[0.9375rem] text-texte">
                {tariff.ageCategory ? tp(`ages.${tariff.ageCategory}`) : tp('offers.vol-initiation')}
              </dt>
              <dd className="font-display text-[2rem] leading-none font-semibold text-azur tabular-nums sm:text-[1.75rem]">
                {tp('amount', { amount: tariff.amount })}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {bookingButton('lg', t('bookingCta'))}
      {paymentUrl && (
        <p className="mt-4 text-sm leading-relaxed text-brume">
          {t('leavingSite')}{' '}
          <Link href="/contact" className="font-semibold text-altitude underline underline-offset-4">
            {t('questionCta')}
          </Link>
        </p>
      )}
    </aside>
  );

  return (
    <>
      <SitePageHero
        page="discover"
        kicker={t('heroKicker')}
        title={t('heroTitle')}
        crumb={tNav('discover')}
        lead={t('defaultDescription')}
        aside={pricePanel}
      />

      {/* How the flight goes */}
      <Section kicker={t('stepsKicker')} title={t('stepsTitle')}>
        <ol className="flex flex-col gap-7 lg:grid lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <li key={step.n} className="grid grid-cols-[32px_1fr] gap-x-4 lg:block lg:border-t-2 lg:border-azur lg:pt-5">
              <span
                aria-hidden="true"
                className={
                  step.n === steps.length
                    ? 'flex size-8 items-center justify-center rounded-full bg-balise text-sm font-semibold text-white lg:size-auto lg:justify-start lg:rounded-none lg:bg-transparent lg:font-display lg:text-[0.9375rem] lg:text-balise'
                    : 'flex size-8 items-center justify-center rounded-full bg-azur text-sm font-semibold text-white lg:size-auto lg:justify-start lg:rounded-none lg:bg-transparent lg:font-display lg:text-[0.9375rem] lg:text-balise'
                }
              >
                <span className="lg:hidden">{step.n}</span>
                <span className="hidden lg:inline">{String(step.n).padStart(2, '0')}</span>
              </span>
              <div>
                <h3 className={`${subTitle} pt-0.5 lg:mt-3 lg:pt-0`}>{step.title}</h3>
                <p className="mt-2 text-texte">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* The club's own texts (Studio): the flight in detail, and how to book */}
      <Section band kicker={t('kicker')} title={t('title')}>
        {textsFrench && <FrenchOnlyNote className="mb-8" />}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className={`${subTitle} mb-4`}>{t('descriptionKicker')}</h3>
            {flights ? (
              <PortableText value={flights} lang={isFrenchFallback(page?.flights, locale) ? 'fr' : undefined} />
            ) : (
              <p className="whitespace-pre-line text-texte">{flightsPlain ?? t('defaultDescription')}</p>
            )}
          </div>
          <div>
            <h3 className={`${subTitle} mb-4`}>{t('bookingTitle')}</h3>
            {booking ? (
              <PortableText value={booking} lang={isFrenchFallback(page?.booking, locale) ? 'fr' : undefined} />
            ) : (
              <p className="whitespace-pre-line text-texte">{bookingPlain ?? t('bookingText')}</p>
            )}
          </div>
        </div>
      </Section>

      {/* Good to know */}
      <Container className="py-16 lg:py-28">
        <div className="flex flex-wrap gap-x-16 gap-y-10">
          <FlightTrace seed="decouvrir" className="min-h-60 flex-[1_1_420px] rounded-md md:min-h-80" />
          <div className="min-w-0 flex-[1_1_480px]">
            <Kicker>{t('practicalKicker')}</Kicker>
            <h2 className={sectionTitle}>{t('practicalTitle')}</h2>
            <dl className="mt-8 hidden gap-x-8 gap-y-6 md:grid md:grid-cols-2">
              {practical.map((item) => (
                <div key={item.key}>
                  <dt className="font-semibold text-azur">{item.label}</dt>
                  <dd className="mt-1 text-texte">{item.body}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-b border-horizon md:hidden">
              {practical.map((item, i) => (
                <details key={item.key} open={i === 0} className="group border-t border-horizon">
                  <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 font-semibold text-azur">
                    {item.label}
                    <ChevronDown size={20} strokeWidth={2} aria-hidden="true" className="shrink-0 transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <div className="pb-4 text-texte">{item.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Frequently asked questions (Studio): each answer opens under its question */}
      {faq.length > 0 && (
        <Section id="faq" kicker={t('faqKicker')} title={t('faqTitle')}>
          {faqFrench && <FrenchOnlyNote className="mb-6" />}
          <div lang={faqFrench ? 'fr' : undefined} className="max-w-3xl border-b border-horizon">
            {faq.map((item) => (
              <details key={item.key} className="group border-t border-horizon">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 font-display text-lg leading-snug font-semibold text-azur">
                  {item.question}
                  <ChevronDown size={20} strokeWidth={2} aria-hidden="true" className="shrink-0 transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <PortableText value={item.answer} className="pb-6" />
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* Vouchers */}
      <Section band id="bons" kicker={t('vouchersKicker')} title={t('vouchersTitle')} sub={t('bookingText')}>
        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <div className="flex flex-col items-start gap-4 rounded-md bg-blanc p-7 lg:p-9">
            <Gift size={28} strokeWidth={1.8} aria-hidden="true" className="text-altitude" />
            <h3 className={subTitle}>{t('voucherPersonTitle')}</h3>
            <p className="text-texte">{t('voucherPersonText')}</p>
            <div className="mt-auto pt-2">
              {voucherUrl ? (
                <Button href={voucherUrl} external variant="secondary">
                  {t('voucherPersonCta')}
                </Button>
              ) : (
                <Button href="/contact" variant="secondary">
                  {t('voucherPersonCta')}
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-md bg-blanc p-7 lg:p-9">
            <Briefcase size={28} strokeWidth={1.8} aria-hidden="true" className="text-altitude" />
            <h3 className={subTitle}>{t('voucherCompanyTitle')}</h3>
            <p className="text-texte">{t('voucherCompanyText')}</p>
            <div className="mt-auto pt-2">
              <TextLink href="/contact">{t('voucherCompanyCta')}</TextLink>
            </div>
          </div>
        </div>
      </Section>

      {/* After the first flight */}
      <Container className="py-16 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="max-w-[640px]">
            <h2 className={sectionTitle}>{t('nextTitle')}</h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-texte lg:text-lg">{t('nextText')}</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Button href={{ pathname: '/club', hash: 'formation' }} variant="secondary" className="w-full sm:w-auto">
              {t('nextLearnCta')}
            </Button>
            <TextLink href="/adherer" className="px-2">
              {t('nextJoinCta')}
            </TextLink>
          </div>
        </div>
      </Container>

      <StickyBookingBar panelId={PANEL_ID} price={<span className="font-semibold text-nuit">{barPrice}</span>}>
        {bookingButton('sm', t('stickyCta'))}
      </StickyBookingBar>
    </>
  );
}
