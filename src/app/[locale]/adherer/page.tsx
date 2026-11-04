import type { Metadata } from 'next';
import Image from 'next/image';
import clsx from 'clsx';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import TextLink from '@/components/ui/TextLink';
import { sanityFetch } from '@/lib/sanity/fetch';
import { imageDimensions, urlFor } from '@/lib/sanity/image';
import { localize, nonEmpty } from '@/lib/sanity/localize';
import { joinPageQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { JoinPage, SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.join' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/adherer' });
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('join');

  const [page, settings] = await Promise.all([
    sanityFetch<JoinPage | null>(joinPageQuery, null),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
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

  const hasIntro = !!intro;
  const isEmpty = !hasIntro && !table?.asset && parts.length === 0;

  return (
    <>
      <SitePageHero page="join" kicker={t('heroKicker')} title={t('heroTitle')} variant={2} />

      {(hasIntro || table?.asset || isEmpty) && (
        <Section id="tarifs" kicker={t('introKicker')} title={t('introTitle')}>
          {isEmpty && <EmptyState>{t('empty')}</EmptyState>}
          {hasIntro && <PortableText value={intro} className="max-w-3xl" />}
          {table?.asset && (
            <figure className={clsx('border border-sky-900/10 bg-white p-3 md:p-6', hasIntro && 'mt-10')}>
              <Image
                src={urlFor(table).width(2400).url()}
                alt={table.alt ?? ''}
                {...imageDimensions(table.asset._ref)}
                sizes="(max-width: 1024px) 100vw, 960px"
                className="h-auto w-full"
              />
              <figcaption className="mt-4">
                <TextLink href={urlFor(table).url()} external>
                  {t('tableOpen')}
                </TextLink>
              </figcaption>
            </figure>
          )}
        </Section>
      )}

      {parts.map((part) => (
        <Section key={part.id} id={part.id} title={part.title}>
          <PortableText value={part.body} className="max-w-3xl" />
        </Section>
      ))}

      <Section kicker={t('howKicker')} title={t('howTitle')}>
        {how ? (
          <PortableText value={how} className="max-w-2xl" />
        ) : howPlain ? (
          <p className="max-w-2xl whitespace-pre-line leading-relaxed text-slate-700">{howPlain}</p>
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
