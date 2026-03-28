import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { client } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Webcam a\u00e9rodrome \u2014 Planeurs d'Ille-et-Vilaine"
      : "Aerodrome webcam \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Webcam en direct de l'a\u00e9rodrome de Saint-Sulpice-des-Landes. Consultez les conditions m\u00e9t\u00e9o sur le terrain."
      : 'Live webcam from Saint-Sulpice-des-Landes aerodrome. Check the weather conditions on the field.',
    locale,
    pathname: '/en-direct/webcam',
  });
}

async function getWebcamUrl(): Promise<string | null> {
  try {
    const settings: SiteSettings | null = await client.fetch(siteSettingsQuery);
    return settings?.webcamUrl || null;
  } catch {
    return null;
  }
}

export default async function WebcamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const webcamUrl = await getWebcamUrl();

  return <WebcamPageContent webcamUrl={webcamUrl} />;
}

function WebcamPageContent({ webcamUrl }: { webcamUrl: string | null }) {
  const tWebcam = useTranslations('webcam');

  return (
    <div>
      <Hero
        title={tWebcam('title')}
        subtitle={tWebcam('subtitle')}
      />

      <section className="py-16 bg-white">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <p className="text-muted text-lg leading-relaxed mb-8">
              {tWebcam('description')}
            </p>

            {webcamUrl ? (
              <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-sm"
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  src={webcamUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title="Webcam"
                />
              </div>
            ) : (
              <div className="w-full rounded-xl border-2 border-dashed border-border bg-light-bg flex flex-col items-center justify-center py-20 px-8">
                <svg
                  className="w-16 h-16 text-muted/40 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-muted text-lg font-medium text-center">
                  {tWebcam('placeholder')}
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
