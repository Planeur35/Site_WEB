import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import Map from '@/components/ui/Map';

const AERODROME_LAT = 47.885;
const AERODROME_LNG = -1.688;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "A\u00e9rodrome de Saint-Sulpice-des-Landes \u2014 Planeurs d'Ille-et-Vilaine"
      : "Saint-Sulpice-des-Landes aerodrome \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Informations sur l'a\u00e9rodrome de Saint-Sulpice-des-Landes (LFES) : acc\u00e8s, installations, carte et coordonn\u00e9es GPS."
      : 'Information about Saint-Sulpice-des-Landes aerodrome (LFES): access, facilities, map, and GPS coordinates.',
    locale,
    pathname: '/le-club/aerodrome',
  });
}

export default async function AerodromePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AerodromePageContent />;
}

function AerodromePageContent() {
  const tNav = useTranslations('nav');
  const tAero = useTranslations('aerodrome');

  return (
    <div>
      <Hero
        title={tNav('aerodrome')}
        subtitle={tAero('heroSubtitle')}
      />

      {/* Description */}
      <section className="py-16 bg-white">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-8">
            {tAero('descriptionTitle')}
          </h2>
          <div className="max-w-3xl space-y-6">
            <p className="text-muted leading-relaxed text-lg">
              {tAero('descriptionText1')}
            </p>
            <p className="text-muted leading-relaxed text-lg">
              {tAero('descriptionText2')}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Map */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-8">
            {tAero('mapTitle')}
          </h2>
          <Map
            lat={AERODROME_LAT}
            lng={AERODROME_LNG}
            zoom={14}
            popupText="Aerodrome de Saint-Sulpice-des-Landes (LFES)"
          />
        </SectionContainer>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            {tAero('facilitiesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hangar */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-border p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-primary mb-2">
                {tAero('hangarTitle')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {tAero('hangarText')}
              </p>
            </div>

            {/* Briefing room */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-border p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-primary mb-2">
                {tAero('briefingTitle')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {tAero('briefingText')}
              </p>
            </div>

            {/* Club house */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-border p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-primary mb-2">
                {tAero('clubhouseTitle')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {tAero('clubhouseText')}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Access directions */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-8">
            {tAero('accessTitle')}
          </h2>
          <div className="max-w-3xl">
            <p className="text-muted leading-relaxed text-lg">
              {tAero('accessText')}
            </p>
            <div className="mt-6 p-4 bg-white rounded-lg border border-border">
              <p className="text-sm text-primary font-medium">
                Aerodrome de Saint-Sulpice-des-Landes
              </p>
              <p className="text-sm text-muted mt-1">
                35390 Saint-Sulpice-des-Landes, France
              </p>
              <p className="text-sm text-muted">
                GPS: 47.885, -1.688
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
