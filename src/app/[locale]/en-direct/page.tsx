import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "En direct \u2014 Planeurs d'Ille-et-Vilaine"
      : "Live \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Suivez en direct l'activit\u00e9 du club : webcam de l'a\u00e9rodrome et vols en cours sur WeGlide."
      : 'Follow the club activity live: aerodrome webcam and current flights on WeGlide.',
    locale,
    pathname: '/en-direct',
  });
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LivePageContent />;
}

function LivePageContent() {
  const tLive = useTranslations('live');

  return (
    <div>
      <Hero
        title={tLive('title')}
        subtitle={tLive('subtitle')}
      />

      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Webcam card */}
            <Link
              href="/en-direct/webcam"
              className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all border border-border block"
            >
              <div className="aspect-video bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-sky-400 group-hover:scale-110 transition-transform"
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
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-2">
                  {tLive('webcamTitle')}
                </h2>
                <p className="text-muted text-sm leading-relaxed">
                  {tLive('webcamDescription')}
                </p>
              </div>
            </Link>

            {/* WeGlide card */}
            <Link
              href="/en-direct/weglide"
              className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all border border-border block"
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-emerald-400 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-2">
                  {tLive('weglideTitle')}
                </h2>
                <p className="text-muted text-sm leading-relaxed">
                  {tLive('weglideDescription')}
                </p>
              </div>
            </Link>
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
