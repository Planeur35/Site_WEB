import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/mentions-legales' });
}

export default async function LegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const tc = await getTranslations('common');
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);

  // The identity details come from Studio → Réglages du site → Mentions légales.
  const name = settings?.legalName || tc('clubName');

  return (
    <>
      <SitePageHero page="legal" kicker={t('heroKicker')} title={t('heroTitle')} variant={0} />
      <Section kicker={t('kicker')} title={t('title')} sub={t('intro')}>
        <div className="prose-piv max-w-3xl">
          <h3>{t('editor.title')}</h3>
          <p>{t('editor.text', { name })}</p>
          <ul>
            {settings?.legalAddress && (
              <li>
                <strong>{t('editor.seat')}</strong> <span className="whitespace-pre-line">{settings.legalAddress}</span>
              </li>
            )}
            {settings?.legalId && (
              <li>
                <strong>{t('editor.id')}</strong> {settings.legalId}
              </li>
            )}
            {settings?.contactEmail && (
              <li>
                <strong>{t('editor.email')}</strong> <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </li>
            )}
            {settings?.contactPhone && (
              <li>
                <strong>{t('editor.phone')}</strong> {settings.contactPhone}
              </li>
            )}
            {settings?.publicationDirector && (
              <li>
                <strong>{t('editor.director')}</strong> {settings.publicationDirector}
              </li>
            )}
          </ul>

          <h3>{t('hosting.title')}</h3>
          <p>{t('hosting.site')}</p>
          <p>{t('hosting.content')}</p>

          <h3>{t('ip.title')}</h3>
          <p>{t('ip.text')}</p>

          <h3>{t('data.title')}</h3>
          <p>{t('data.form')}</p>
          <p>{t('data.recipient')}</p>
          <p>{t('data.technical')}</p>
          <p>{t('data.retention')}</p>
          <p>
            {t('data.rights')}{' '}
            <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer">
              {t('data.cnil')}
            </a>
          </p>

          <h3>{t('cookies.title')}</h3>
          <p>{t('cookies.text')}</p>
          <p>{t('cookies.map')}</p>

          <h3>{t('liability.title')}</h3>
          <p>{t('liability.text')}</p>
        </div>
      </Section>
    </>
  );
}
