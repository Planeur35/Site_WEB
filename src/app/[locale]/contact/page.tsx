import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import ContactForm from '@/components/ui/ContactForm';
import Kicker from '@/components/ui/Kicker';
import Map from '@/components/ui/Map';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

// Fallback map position: the club's aerodrome
const DEFAULT_COORDINATES = { lat: 47.885, lng: -1.688 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/contact' });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  const coordinates = settings?.aerodromeCoordinates ?? DEFAULT_COORDINATES;

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={t('title')} variant={0} />
      <Section kicker={t('formKicker')} title={t('formTitle')} sub={t('subtitle')}>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <div className="space-y-8">
            {(settings?.contactEmail || settings?.contactPhone || settings?.address) && (
              <dl className="space-y-5 border-t border-sky-900/15 pt-6">
                {settings.address && (
                  <div>
                    <dt><Kicker>{t('address')}</Kicker></dt>
                    <dd className="whitespace-pre-line text-slate-700">{settings.address}</dd>
                  </div>
                )}
                {settings.contactEmail && (
                  <div>
                    <dt><Kicker>{t('email')}</Kicker></dt>
                    <dd>
                      <a href={`mailto:${settings.contactEmail}`} className="text-sky-900 underline decoration-sky-300 underline-offset-4">
                        {settings.contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {settings.contactPhone && (
                  <div>
                    <dt><Kicker>{t('phone')}</Kicker></dt>
                    <dd>
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-sky-900 underline decoration-sky-300 underline-offset-4">
                        {settings.contactPhone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </Section>
      <Section kicker={t('findUsKicker')} title={t('findUs')}>
        <Map lat={coordinates.lat} lng={coordinates.lng} zoom={12} popupText={t('mapPopup')} />
      </Section>
    </>
  );
}
