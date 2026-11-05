import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import Kicker from '@/components/ui/Kicker';
import PriceTable, { type PriceRow } from '@/components/ui/PriceTable';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import TextLink from '@/components/ui/TextLink';
import { sanityFetch } from '@/lib/sanity/fetch';
import { imageDimensions, urlFor } from '@/lib/sanity/image';
import { localize, nonEmpty } from '@/lib/sanity/localize';
import { allTariffsQuery, joinPageQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { AgeCategory, JoinPage, SiteSettings, Tariff, TariffOffer } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.join' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/adherer' });
}

const PACKAGES: TariffOffer[] = ['forfait-20h', 'forfait-illimite'];
const PACKAGE_AGES: AgeCategory[] = ['under25', 'over25'];
const TRAINING_PACKS: TariffOffer[] = ['pack-formation', 'pack-complement-formation'];

const partTitle = 'font-display text-[1.625rem] leading-[1.15] font-semibold text-balance text-azur lg:text-[2rem]';

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('join');
  const tPricing = await getTranslations('pricing');

  const [page, settings, tariffs] = await Promise.all([
    sanityFetch<JoinPage | null>(joinPageQuery, null),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<Tariff[]>(allTariffsQuery, []),
  ]);

  // The text comes from the page document (Studio → Page « Venez voler ! »).
  // The old fields of the site settings are used only while the new ones are empty.
  const intro = nonEmpty(localize(page?.intro, locale)) ?? nonEmpty(localize(settings?.pricingIntro, locale));
  const table = page?.table?.asset ? page.table : settings?.pricingTable;
  const how = nonEmpty(localize(page?.how, locale));
  const howPlain = localize(settings?.joinText, locale);

  // The three sub-parts, in this order. A sub-part without text is not shown.
  const parts = [
    {
      id: 'cotisation',
      title: t('membershipTitle'),
      body: nonEmpty(localize(page?.membership, locale)) ?? nonEmpty(localize(settings?.pricingMembership, locale)),
    },
    {
      id: 'pack-formation',
      title: t('trainingPackTitle'),
      body: nonEmpty(localize(page?.training, locale)) ?? nonEmpty(localize(settings?.pricingTraining, locale)),
    },
    {
      id: 'pack-complement',
      title: t('advancedPackTitle'),
      body: nonEmpty(localize(page?.advanced, locale)) ?? nonEmpty(localize(settings?.pricingAdvanced, locale)),
    },
  ].flatMap((part) => (part.body ? [{ id: part.id, title: part.title, body: part.body }] : []));

  // Price tables from the `tariff` documents: an offer shows once one of its prices is entered
  const tariffRow = (offer: TariffOffer, ages: (AgeCategory | undefined)[]): PriceRow[] => {
    const own = tariffs.filter((tariff) => tariff.offer === offer);
    if (own.length === 0) return [];
    return [
      {
        key: offer,
        name: tPricing(`offers.${offer}`),
        details: localize(own.find((tariff) => tariff.details)?.details, locale),
        prices: ages.map((age) => own.find((tariff) => (age ? tariff.ageCategory === age : true))?.amount),
      },
    ];
  };
  const packageRows = PACKAGES.flatMap((offer) => tariffRow(offer, PACKAGE_AGES));
  const packRows = TRAINING_PACKS.flatMap((offer) => tariffRow(offer, [undefined]));

  const isEmpty = !intro && !table?.asset && parts.length === 0 && packageRows.length === 0 && packRows.length === 0;

  return (
    <>
      <SitePageHero page="join" kicker={t('heroKicker')} title={t('heroTitle')} lead={t('heroLead')} />

      <Section id="tarifs" kicker={t('introKicker')} title={t('introTitle')}>
        {isEmpty && <EmptyState action={{ href: '/contact', label: t('contactCta') }}>{t('empty')}</EmptyState>}
        <div className="flex flex-col gap-10 lg:gap-14">
          {intro && <PortableText value={intro} className="max-w-[680px]" />}
          {packageRows.length > 0 && (
            <PriceTable
              caption={t('packagesCaption')}
              offerLabel={t('packagesOffer')}
              columns={PACKAGE_AGES.map((age) => tPricing(`ages.${age}`))}
              rows={packageRows}
              locale={locale}
            />
          )}
          {packRows.length > 0 && (
            <PriceTable
              caption={t('packsCaption')}
              offerLabel={t('packsOffer')}
              columns={[t('packsPrice')]}
              rows={packRows}
              locale={locale}
            />
          )}
          {table?.asset && (
            <figure className="rounded-md bg-ciel p-3 lg:p-6">
              <Image
                src={urlFor(table).width(2400).url()}
                alt={table.alt ?? ''}
                {...imageDimensions(table.asset._ref)}
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="h-auto w-full rounded-sm"
              />
              <figcaption className="mt-3">
                <TextLink href={urlFor(table).url()} external>
                  {t('tableOpen')}
                </TextLink>
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {/* Adhésion, pack formation, pack complément: title on the left, the club's text on the right */}
      {parts.length > 0 && (
        <section className="bg-ciel py-16 lg:py-28">
          <Container>
            <div className="flex flex-col">
              {parts.map((part, i) => (
                <div
                  key={part.id}
                  id={part.id}
                  className="grid scroll-mt-36 gap-x-16 gap-y-5 border-t border-horizon py-10 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-14"
                >
                  <div>
                    <Kicker>{String(i + 1).padStart(2, '0')}</Kicker>
                    <h2 className={partTitle}>{part.title}</h2>
                  </div>
                  <PortableText value={part.body} className="max-w-[680px]" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Section kicker={t('howKicker')} title={t('howTitle')}>
        {how ? (
          <PortableText value={how} className="max-w-[680px]" />
        ) : howPlain ? (
          <p className="max-w-[680px] text-[1.0625rem] leading-[1.75] whitespace-pre-line text-texte lg:text-[1.1875rem]">
            {howPlain}
          </p>
        ) : (
          <EmptyState seed="inscription">{t('howEmpty')}</EmptyState>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {/* The sign-up page, once the club has entered it in the Studio */}
          {settings?.joinUrl && (
            <Button href={settings.joinUrl} external mainCta className="w-full sm:w-auto">
              {t('joinOnline')}
            </Button>
          )}
          <Button href="/contact" variant="secondary" className="w-full sm:w-auto">
            {t('contactCta')}
          </Button>
          <TextLink href="/decouvrir" className="px-2">
            {t('tryCta')}
          </TextLink>
        </div>
      </Section>
    </>
  );
}
