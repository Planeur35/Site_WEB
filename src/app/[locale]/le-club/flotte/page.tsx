import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Image from 'next/image';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { client } from '@/lib/sanity/client';
import { allAircraftQuery } from '@/lib/sanity/queries';
import type { Aircraft } from '@/lib/sanity/types';

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

interface FleetItem {
  id: string;
  name: string;
  registration: string;
  callsign: string;
  category: 'biplace-ecole' | 'biplace-perf' | 'monoplace-debut' | 'monoplace-perf' | 'handiplaneur' | 'remorqueur';
  manufacturer: string;
  wingspan: string;
  glideRatio: string;
  seats: number;
  maxWeight?: string;
  year?: string;
  instrumentation?: string;
  image?: string;
  description: { fr: string; en: string };
}

const fleet: FleetItem[] = [
  {
    id: 'dg500-le',
    name: 'DG 500 Trainer "LE"',
    registration: 'F-CILE',
    callsign: 'LE',
    category: 'biplace-ecole',
    manufacturer: 'DG Flugzeugbau',
    wingspan: '18-20 m',
    glideRatio: '35-40',
    seats: 2,
    image: '/images/fleet/dg500.png',
    description: {
      fr: "Biplace spacieux et robuste pour la formation d\u00e9but, la formation campagne et le vol \u00e0 deux.",
      en: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
    },
  },
  {
    id: 'dg500-lg',
    name: 'DG 500 Trainer "LG"',
    registration: 'F-CILG',
    callsign: 'LG',
    category: 'biplace-ecole',
    manufacturer: 'DG Flugzeugbau',
    wingspan: '18-20 m',
    glideRatio: '35-40',
    seats: 2,
    description: {
      fr: "Biplace spacieux et robuste pour la formation d\u00e9but, la formation campagne et le vol \u00e0 deux.",
      en: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
    },
  },
  {
    id: 'ask21-handi',
    name: 'ASK 21 Handiplaneur',
    registration: 'F-CLOL',
    callsign: '',
    category: 'handiplaneur',
    manufacturer: 'Alexander Schleicher',
    wingspan: '17 m',
    glideRatio: '34',
    seats: 2,
    description: {
      fr: "Planeur biplace r\u00e9gional \u00e9quip\u00e9 de commandes adapt\u00e9es permettant aux personnes \u00e0 mobilit\u00e9 r\u00e9duite de pratiquer le vol \u00e0 voile.",
      en: 'Regional two-seat glider with adapted controls enabling people with reduced mobility to practise soaring.',
    },
  },
  {
    id: 'duo-discus',
    name: 'Duo Discus "B4"',
    registration: 'F-CJCP',
    callsign: 'B4',
    category: 'biplace-perf',
    manufacturer: 'Schempp-Hirth',
    wingspan: '20 m',
    glideRatio: '44',
    seats: 2,
    maxWeight: '700 kg',
    year: '1999',
    instrumentation: 'S100',
    image: '/images/fleet/duo-discus.jpg',
    description: {
      fr: "Biplace hautes performances et comp\u00e9tition. Excellent pour le vol de distance \u00e0 deux.",
      en: 'High-performance competition two-seater. Excellent for two-person distance flying.',
    },
  },
  {
    id: 'astir',
    name: 'Astir Standard',
    registration: 'F-CEXT',
    callsign: 'R38',
    category: 'monoplace-debut',
    manufacturer: 'Grob',
    wingspan: '15 m',
    glideRatio: '38',
    seats: 1,
    description: {
      fr: "Monoplace d\u2019entr\u00e9e, utilis\u00e9 pour la progression apr\u00e8s l\u2019autorisation de vol solo.",
      en: 'Entry-level single-seater, used for progression after solo flight authorisation.',
    },
  },
  {
    id: 'pegase-d',
    name: 'P\u00e9gase "D"',
    registration: 'F-CGHQ',
    callsign: 'D',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
  },
  {
    id: 'pegase-bs',
    name: 'P\u00e9gase "BS"',
    registration: 'F-CGBD',
    callsign: 'BS',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
  },
  {
    id: 'pegase-e529',
    name: 'P\u00e9gase "E529"',
    registration: 'F-CDVV',
    callsign: 'E529',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
  },
  {
    id: 'discus-b',
    name: 'Discus B "D16"',
    registration: 'F-CGGQ',
    callsign: 'D16',
    category: 'monoplace-perf',
    manufacturer: 'Schempp-Hirth',
    wingspan: '15 m',
    glideRatio: '43',
    seats: 1,
    maxWeight: '525 kg',
    year: '1991',
    instrumentation: 'S100',
    image: '/images/fleet/discus-b.jpg',
    description: {
      fr: "Hautes performances et comp\u00e9tition.",
      en: 'High performance and competition.',
    },
  },
  {
    id: 'asw24',
    name: 'ASW 24 "CQ"',
    registration: 'F-CGKN',
    callsign: 'CQ',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    wingspan: '15 m',
    glideRatio: '44',
    seats: 1,
    maxWeight: '500 kg',
    year: '1990',
    instrumentation: 'VP4',
    description: {
      fr: "Hautes performances et comp\u00e9tition.",
      en: 'High performance and competition.',
    },
  },
  {
    id: 'ls7',
    name: 'LS 7-WL NEO "AK"',
    registration: 'F-CAKS',
    callsign: 'AK',
    category: 'monoplace-perf',
    manufacturer: 'Rolladen-Schneider',
    wingspan: '15 m',
    glideRatio: '43',
    seats: 1,
    maxWeight: '486 kg',
    year: '1990',
    instrumentation: 'LX9000, transponder',
    image: '/images/fleet/ls7.jpeg',
    description: {
      fr: "Hautes performances et comp\u00e9tition.",
      en: 'High performance and competition.',
    },
  },
  {
    id: 'asw28',
    name: 'ASW 28 "KM"',
    registration: 'D-9877',
    callsign: 'KM',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    wingspan: '15 m',
    glideRatio: '45',
    seats: 1,
    maxWeight: '525 kg',
    year: '2007',
    instrumentation: 'S100',
    image: '/images/fleet/asw28.jpg',
    description: {
      fr: "Hautes performances et comp\u00e9tition.",
      en: 'High performance and competition.',
    },
  },
  {
    id: 'asg29',
    name: 'ASG 29 "V"',
    registration: 'D-2729',
    callsign: 'V',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    wingspan: '15/18 m',
    glideRatio: '45/52',
    seats: 1,
    maxWeight: '600 kg',
    year: '2006',
    instrumentation: 'LX9000',
    image: '/images/fleet/asg29.png',
    description: {
      fr: "Tr\u00e8s hautes performances et comp\u00e9tition. Envergure variable 15 m ou 18 m.",
      en: 'Very high performance and competition. Variable wingspan 15 m or 18 m.',
    },
  },
];

const categoryLabels = {
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
} as const;

const categoryOrder: FleetItem['category'][] = [
  'biplace-ecole',
  'handiplaneur',
  'biplace-perf',
  'monoplace-debut',
  'monoplace-perf',
];

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let sanityAircraft: Aircraft[] = [];
  try {
    sanityAircraft = await client.fetch<Aircraft[]>(allAircraftQuery);
  } catch {
    sanityAircraft = [];
  }

  return <FleetContent locale={locale} sanityAircraft={sanityAircraft} />;
}

function FleetContent({
  locale,
  sanityAircraft,
}: {
  locale: string;
  sanityAircraft: Aircraft[];
}) {
  const tNav = useTranslations('nav');
  const tFleet = useTranslations('fleet');
  const lang = locale as 'fr' | 'en';

  // Use Sanity data if available, otherwise use hardcoded fleet
  const useSanity = sanityAircraft.length > 0;

  return (
    <>
      <Hero
        title={tNav('fleet')}
        subtitle={tFleet('heroSubtitle')}
      />

      {useSanity ? (
        <section className="py-16">
          <SectionContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sanityAircraft.map((a) => (
                <div key={a._id} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <h3 className="font-semibold text-primary text-lg">{a.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>
        </section>
      ) : (
        <>
          {categoryOrder.map((cat) => {
            const items = fleet.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            return (
              <section key={cat} className="py-12 first:pt-16 last:pb-16">
                <SectionContainer>
                  <h2 className="text-2xl font-bold text-primary mb-8">
                    {categoryLabels[lang][cat]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((aircraft) => (
                      <div
                        key={aircraft.id}
                        className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Image */}
                        {aircraft.image ? (
                          <div className="relative aspect-video bg-gray-100">
                            <Image
                              src={aircraft.image}
                              alt={aircraft.name}
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
                              {aircraft.name}
                            </h3>
                            {aircraft.callsign && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-mono font-medium flex-shrink-0">
                                {aircraft.callsign}
                              </span>
                            )}
                          </div>

                          <p className="text-muted text-sm mb-3">
                            {aircraft.description[lang]}
                          </p>

                          {/* Specs grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-light-bg rounded-lg p-2">
                              <span className="text-muted block">{tFleet('wingspan')}</span>
                              <span className="font-semibold text-dark-text">{aircraft.wingspan}</span>
                            </div>
                            <div className="bg-light-bg rounded-lg p-2">
                              <span className="text-muted block">{tFleet('glideRatio')}</span>
                              <span className="font-semibold text-dark-text">{aircraft.glideRatio}</span>
                            </div>
                            <div className="bg-light-bg rounded-lg p-2">
                              <span className="text-muted block">{tFleet('seats')}</span>
                              <span className="font-semibold text-dark-text">
                                {aircraft.seats} {aircraft.seats === 1 ? tFleet('seat') : tFleet('seatsPlural')}
                              </span>
                            </div>
                            {aircraft.year && (
                              <div className="bg-light-bg rounded-lg p-2">
                                <span className="text-muted block">{locale === 'fr' ? 'Ann\u00e9e' : 'Year'}</span>
                                <span className="font-semibold text-dark-text">{aircraft.year}</span>
                              </div>
                            )}
                          </div>

                          {/* Extra info */}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="text-muted">{aircraft.manufacturer}</span>
                            {aircraft.registration && (
                              <span className="text-muted font-mono">{aircraft.registration}</span>
                            )}
                            {aircraft.instrumentation && (
                              <span className="text-muted">{aircraft.instrumentation}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionContainer>
              </section>
            );
          })}

          {/* Launch systems note */}
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
      )}
    </>
  );
}
