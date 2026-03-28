import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { client } from '@/lib/sanity/client';
import { allAircraftQuery } from '@/lib/sanity/queries';
import type { Aircraft } from '@/lib/sanity/types';

interface PlaceholderAircraft {
  _id: string;
  name: string;
  type: 'training' | 'performance' | 'tandem';
  specs: {
    wingspan: string;
    glideRatio: string;
    seats: number;
  };
}

const placeholderFleet: PlaceholderAircraft[] = [
  {
    _id: 'ask-21',
    name: 'ASK-21',
    type: 'training',
    specs: { wingspan: '17 m', glideRatio: '34', seats: 2 },
  },
  {
    _id: 'ask-13',
    name: 'ASK-13',
    type: 'training',
    specs: { wingspan: '16 m', glideRatio: '28', seats: 2 },
  },
  {
    _id: 'ls-4',
    name: 'LS-4',
    type: 'performance',
    specs: { wingspan: '15 m', glideRatio: '40.5', seats: 1 },
  },
  {
    _id: 'duo-discus',
    name: 'Duo Discus',
    type: 'tandem',
    specs: { wingspan: '20 m', glideRatio: '44', seats: 2 },
  },
];

async function getAircraft(): Promise<PlaceholderAircraft[]> {
  try {
    const aircraft: Aircraft[] = await client.fetch(allAircraftQuery);
    if (aircraft && aircraft.length > 0) {
      return aircraft.map((a) => ({
        _id: a._id,
        name: a.name,
        type: a.type || 'training',
        specs: {
          wingspan: a.specs?.wingspan || '-',
          glideRatio: a.specs?.glideRatio || '-',
          seats: a.specs?.seats || 1,
        },
      }));
    }
    return placeholderFleet;
  } catch {
    return placeholderFleet;
  }
}

const typeColors: Record<string, string> = {
  training: 'bg-blue-500',
  performance: 'bg-amber-500',
  tandem: 'bg-emerald-500',
};

const typeBgColors: Record<string, string> = {
  training: 'from-blue-100 to-blue-200',
  performance: 'from-amber-100 to-amber-200',
  tandem: 'from-emerald-100 to-emerald-200',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Notre flotte de planeurs \u2014 Planeurs d'Ille-et-Vilaine"
      : "Our glider fleet \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "D\u00e9couvrez les planeurs du club : appareils \u00e9cole, performance et biplace. Caract\u00e9ristiques et sp\u00e9cifications de chaque a\u00e9ronef."
      : 'Discover the club gliders: training, performance, and tandem aircraft. Characteristics and specifications of each aircraft.',
    locale,
    pathname: '/le-club/flotte',
  });
}

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const aircraft = await getAircraft();

  return <FleetPageContent aircraft={aircraft} />;
}

function FleetPageContent({ aircraft }: { aircraft: PlaceholderAircraft[] }) {
  const tNav = useTranslations('nav');
  const tFleet = useTranslations('fleet');

  return (
    <div>
      <Hero
        title={tNav('fleet')}
        subtitle={tFleet('heroSubtitle')}
      />

      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aircraft.map((plane) => (
              <div
                key={plane._id}
                className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                {/* Colored placeholder image area */}
                <div
                  className={`relative aspect-video bg-gradient-to-br ${typeBgColors[plane.type] || 'from-gray-100 to-gray-200'} flex items-center justify-center`}
                >
                  <svg
                    className="w-16 h-16 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${typeColors[plane.type] || 'bg-gray-500'}`}
                  >
                    {tFleet(plane.type)}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h3 className="font-semibold text-xl text-primary mb-4">
                    {plane.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">{tFleet('wingspan')}</span>
                      <span className="font-medium text-primary">
                        {plane.specs.wingspan}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">{tFleet('glideRatio')}</span>
                      <span className="font-medium text-primary">
                        {plane.specs.glideRatio}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">{tFleet('seats')}</span>
                      <span className="font-medium text-primary">
                        {plane.specs.seats}{' '}
                        {plane.specs.seats > 1
                          ? tFleet('seatsPlural')
                          : tFleet('seat')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
