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
      ? "WeGlide \u2014 Vols en direct \u2014 Planeurs d'Ille-et-Vilaine"
      : "WeGlide \u2014 Live flights \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Suivez les vols des pilotes du club en temps r\u00e9el sur WeGlide. Traces, classements et performances."
      : 'Follow the club pilots\' flights in real time on WeGlide. Traces, rankings, and performances.',
    locale,
    pathname: '/en-direct/weglide',
  });
}

async function getWeglideUrl(): Promise<string | null> {
  try {
    const settings: SiteSettings | null = await client.fetch(siteSettingsQuery);
    return settings?.weglideUrl || null;
  } catch {
    return null;
  }
}

export default async function WeGlidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const weglideUrl = await getWeglideUrl();

  return <WeGlidePageContent weglideUrl={weglideUrl} />;
}

function WeGlidePageContent({ weglideUrl }: { weglideUrl: string | null }) {
  const tWeglide = useTranslations('weglide');

  return (
    <div>
      <Hero
        title={tWeglide('title')}
        subtitle={tWeglide('subtitle')}
      />

      <section className="py-16 bg-white">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <p className="text-muted text-lg leading-relaxed mb-8">
              {tWeglide('description')}
            </p>

            {weglideUrl ? (
              <div className="space-y-6">
                <div
                  className="relative w-full overflow-hidden rounded-xl border border-border shadow-sm"
                  style={{ paddingBottom: '56.25%' }}
                >
                  <iframe
                    src={weglideUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="WeGlide"
                  />
                </div>
                <div className="text-center">
                  <a
                    href={weglideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg font-medium transition-colors bg-accent text-white hover:bg-accent-hover px-7 py-3 text-lg"
                  >
                    {tWeglide('visitWeGlide')}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-muted text-lg font-medium text-center">
                  {tWeglide('placeholder')}
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
