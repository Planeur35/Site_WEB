import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import WebcamImage from '@/components/ui/WebcamImage';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.webcam' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/webcam' });
}

export default async function WebcamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('webcam');
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={t('heroTitle')} variant={2} />
      <Section kicker={t('kicker')} title={t('title')}>
        {settings?.webcamUrl ? <WebcamImage url={settings.webcamUrl} /> : <EmptyState>{t('empty')}</EmptyState>}
      </Section>
    </>
  );
}
