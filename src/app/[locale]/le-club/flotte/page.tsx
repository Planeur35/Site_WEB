import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Image from 'next/image';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { client } from '@/lib/sanity/client';
import { allAircraftQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import type { Aircraft, AircraftCategory } from '@/lib/sanity/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Notre flotte \u2014 Planeurs d\u2019Ille-et-Vilaine"
      : "Our fleet \u2014 Planeurs d\u2019Ille-et-Vilaine",
    description: locale === 'fr'
      ? "D\u00e9couvrez les planeurs du club PIV : biplaces de formation, monoplaces de performance et de comp\u00e9tition."
      : "Discover the PIV club gliders: training two-seaters, performance and competition single-seaters.",
    locale,
    pathname: '/le-club/flotte',
  });
}

const categoryLabels: Record<string, Record<AircraftCategory, string>> = {
  fr: {
    'biplace-ecole': 'Biplaces \u00e9cole',
    'biplace-perf': 'Biplaces performance',
    'handiplaneur': 'Handiplaneur',
    'monoplace-debut': 'Monoplace d\u00e9butant',
    'monoplace-perf': 'Monoplaces performance',
    'remorqueur': 'Remorqueur',
  },
  en: {
    'biplace-ecole': 'Training two-seaters',
    'biplace-perf': 'Performance two-seaters',
    'handiplaneur': 'Handiglider',
    'monoplace-debut': 'Beginner single-seater',
    'monoplace-perf': 'Performance single-seaters',
    'remorqueur': 'Tow plane',
  },
};

const categoryOrder: AircraftCategory[] = [
  'biplace-ecole',
  'handiplaneur',
  'biplace-perf',
  'monoplace-debut',
  'monoplace-perf',
  'remorqueur',
];

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let aircraft: Aircraft[] = [];
  try {
    aircraft = await client.fetch<Aircraft[]>(allAircraftQuery);
  } catch {
    aircraft = [];
  }

  // Only use Sanity data if aircraft have the new `category` field
  const hasCategoryData = aircraft.length > 0 && aircraft.some((a) => a.category);

  return <FleetContent locale={locale} aircraft={hasCategoryData ? aircraft : []} />;
}

function FleetContent({
  locale,
  aircraft,
}: {
  locale: string;
  aircraft: Aircraft[];
}) {
  const tNav = useTranslations('nav');
  const tFleet = useTranslations('fleet');
  const lang = locale === 'en' ? 'en' : 'fr';

  const useSanity = aircraft.length > 0;

  return (
    <>
      <Hero
        title={tNav('fleet')}
        subtitle={tFleet('heroSubtitle')}
      />

      {useSanity ? (
        <>
          {categoryOrder.map((cat) => {
            const items = aircraft.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            return (
              <section key={cat} className="py-12 first:pt-16 last:pb-16">
                <SectionContainer>
                  <h2 className="text-2xl font-bold text-primary mb-8">
                    {categoryLabels[lang]?.[cat] ?? cat}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((ac) => (
                      <AircraftCard key={ac._id} aircraft={ac} locale={lang} tFleet={tFleet} />
                    ))}
                  </div>
                </SectionContainer>
              </section>
            );
          })}

          {/* Launch systems */}
          <section className="py-12 bg-light-bg">
            <SectionContainer>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-xl font-bold text-primary mb-4">
                  {locale === 'fr' ? 'Moyens de lancement' : 'Launch systems'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-primary mb-1">Skylaunch</h3>
                    <p className="text-muted text-sm">
                      {locale === 'fr' ? 'Treuil principal \u2014 lancement silencieux, faible co\u00fbt et faible empreinte carbone' : 'Primary winch \u2014 silent launch, low cost and low carbon footprint'}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-primary mb-1">ULM WT9 Dynamic</h3>
                    <p className="text-muted text-sm">
                      {locale === 'fr' ? 'Remorqueur ULM r\u00e9gional pour les remorquages a\u00e9riens' : 'Regional ULM tow plane for aerotow launches'}
                    </p>
                  </div>
                </div>
              </div>
            </SectionContainer>
          </section>
        </>
      ) : (
        <section className="py-16">
          <SectionContainer>
            <p className="text-center text-muted">
              {locale === 'fr' ? 'Flotte en cours de chargement...' : 'Fleet loading...'}
            </p>
          </SectionContainer>
        </section>
      )}
    </>
  );
}

function AircraftCard({
  aircraft: ac,
  locale,
  tFleet,
}: {
  aircraft: Aircraft;
  locale: string;
  tFleet: ReturnType<typeof useTranslations>;
}) {
  const description = ac.description
    ? (locale === 'en' ? ac.description.en : ac.description.fr)
    : undefined;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      {ac.photo?.asset ? (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={urlFor(ac.photo).width(600).height(400).auto('format').url()}
            alt={ac.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
          <svg className="w-16 h-16 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-primary text-lg leading-tight">
            {ac.name}
          </h3>
          {ac.callsign && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-mono font-medium flex-shrink-0">
              {ac.callsign}
            </span>
          )}
        </div>

        {description && (
          <p className="text-muted text-sm mb-3">{description}</p>
        )}

        {/* Specs grid */}
        {ac.specs && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {ac.specs.wingspan && (
              <div className="bg-light-bg rounded-lg p-2">
                <span className="text-muted block">{tFleet('wingspan')}</span>
                <span className="font-semibold text-dark-text">{ac.specs.wingspan}</span>
              </div>
            )}
            {ac.specs.glideRatio && (
              <div className="bg-light-bg rounded-lg p-2">
                <span className="text-muted block">{tFleet('glideRatio')}</span>
                <span className="font-semibold text-dark-text">{ac.specs.glideRatio}</span>
              </div>
            )}
            {ac.specs.seats && (
              <div className="bg-light-bg rounded-lg p-2">
                <span className="text-muted block">{tFleet('seats')}</span>
                <span className="font-semibold text-dark-text">
                  {ac.specs.seats} {ac.specs.seats === 1 ? tFleet('seat') : tFleet('seatsPlural')}
                </span>
              </div>
            )}
            {ac.specs.year && (
              <div className="bg-light-bg rounded-lg p-2">
                <span className="text-muted block">{locale === 'fr' ? 'Ann\u00e9e' : 'Year'}</span>
                <span className="font-semibold text-dark-text">{ac.specs.year}</span>
              </div>
            )}
          </div>
        )}

        {/* Extra info */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {ac.manufacturer && <span className="text-muted">{ac.manufacturer}</span>}
          {ac.registration && <span className="text-muted font-mono">{ac.registration}</span>}
          {ac.instrumentation && <span className="text-muted">{ac.instrumentation}</span>}
        </div>
      </div>
    </div>
  );
}
