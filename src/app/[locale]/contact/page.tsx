import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import ContactForm from '@/components/ui/ContactForm';
import Map from '@/components/ui/Map';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import TextLink from '@/components/ui/TextLink';
import { aerodromeCoordinates, directionsUrl } from '@/lib/aerodrome';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

const contactLink =
  'inline-flex min-h-11 items-center text-[1.0625rem] font-semibold [overflow-wrap:anywhere] text-altitude underline decoration-horizon decoration-2 underline-offset-4 hover:decoration-altitude';

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
  const coordinates = aerodromeCoordinates(settings);

  return (
    <>
      <SitePageHero page="contact" kicker={t('heroKicker')} title={t('title')} />
      <Section kicker={t('formKicker')} title={t('formTitle')} sub={t('subtitle')}>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ContactForm />
          {(settings?.contactEmail || settings?.contactPhone || settings?.address) && (
            <dl className="flex flex-col gap-6 self-start rounded-md bg-ciel p-6 lg:p-8">
              {settings.address && (
                <div>
                  <dt className="text-sm font-semibold text-brume">{t('address')}</dt>
                  <dd className="mt-1 whitespace-pre-line text-[1.0625rem] leading-[1.55] text-nuit">{settings.address}</dd>
                  <dd className="mt-2">
                    <TextLink href={directionsUrl(coordinates)} external>
                      {t('directions')}
                    </TextLink>
                  </dd>
                </div>
              )}
              {settings.contactEmail && (
                <div>
                  <dt className="text-sm font-semibold text-brume">{t('email')}</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${settings.contactEmail}`} className={contactLink}>
                      {settings.contactEmail}
                    </a>
                  </dd>
                </div>
              )}
              {settings.contactPhone && (
                <div>
                  <dt className="text-sm font-semibold text-brume">{t('phone')}</dt>
                  <dd className="mt-1">
                    <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, '')}`} className={contactLink}>
                      {settings.contactPhone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </Section>
      <Section id="plan" kicker={t('findUsKicker')} title={t('findUs')}>
        <Map lat={coordinates.lat} lng={coordinates.lng} zoom={12} popupText={t('mapPopup')} />
        <p className="mt-5">
          <TextLink href={directionsUrl(coordinates)} external>
            {t('directions')}
          </TextLink>
        </p>
      </Section>
    </>
  );
}
