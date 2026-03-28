import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import ContactForm from '@/components/ui/ContactForm';
import Map from '@/components/ui/Map';
import { client } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Contact \u2014 Planeurs d'Ille-et-Vilaine"
      : "Contact \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Contactez le club de vol \u00e0 voile Planeurs d'Ille-et-Vilaine. T\u00e9l\u00e9phone, email, adresse et formulaire de contact."
      : "Contact the Planeurs d'Ille-et-Vilaine soaring club. Phone, email, address, and contact form.",
    locale,
    pathname: '/contact',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let settings: SiteSettings | null = null;
  try {
    settings = await client.fetch<SiteSettings>(siteSettingsQuery);
  } catch {
    settings = null;
  }

  return <ContactPageContent settings={settings} />;
}

function ContactPageContent({ settings }: { settings: SiteSettings | null }) {
  const t = useTranslations('contact');

  const phone = settings?.contactPhone || '+33 2 99 XX XX XX';
  const email = settings?.contactEmail || 'contact@planeur35.org';
  const address =
    settings?.address ||
    'Aerodrome de Saint-Sulpice-des-Landes, 35390 Saint-Sulpice-des-Landes';
  const lat = settings?.aerodromeCoordinates?.lat ?? 47.885;
  const lng = settings?.aerodromeCoordinates?.lng ?? -1.688;

  return (
    <div>
      <Hero title={t('title')} subtitle={t('subtitle')} />

      <section className="py-16 bg-white">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column: Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">{t('send')}</h2>
              <ContactForm />
            </div>

            {/* Right column: Contact info + Map */}
            <div className="space-y-8">
              {/* Contact info card */}
              <div className="rounded-xl border border-border bg-light-bg p-6 space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-accent mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-primary">{t('phone')}</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-muted hover:text-accent transition">
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-accent mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-primary">{t('email')}</p>
                    <a href={`mailto:${email}`} className="text-muted hover:text-accent transition">
                      {email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-accent mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-primary">{t('address')}</p>
                    <p className="text-muted">{address}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">{t('findUs')}</h3>
                <Map
                  lat={lat}
                  lng={lng}
                  zoom={13}
                  popupText="Aerodrome de Saint-Sulpice-des-Landes"
                />
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Operating hours section */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Horaires d&apos;ouverture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-primary mb-2">Saison (Avril - Octobre)</h3>
                <p className="text-muted">Mercredi : 14h - 19h</p>
                <p className="text-muted">Samedi &amp; Dimanche : 10h - 19h</p>
                <p className="text-muted">Jours feries : 10h - 19h</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-primary mb-2">Hors saison (Novembre - Mars)</h3>
                <p className="text-muted">Samedi : 10h - 17h</p>
                <p className="text-muted">Dimanche : 10h - 17h</p>
                <p className="text-muted text-sm mt-2">Sous reserve de conditions meteorologiques</p>
              </div>
            </div>
            <p className="text-sm text-muted mt-6">
              Les horaires peuvent varier en fonction de la meteo. N&apos;hesitez pas a nous contacter avant de vous deplacer.
            </p>
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
