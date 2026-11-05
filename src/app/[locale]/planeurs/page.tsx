import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import FlightTrace from '@/components/ui/FlightTrace';
import SanityPhoto from '@/components/ui/SanityPhoto';
import SitePageHero from '@/components/ui/SitePageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { allAircraftQuery } from '@/lib/sanity/queries';
import type { Aircraft, AircraftCategory } from '@/lib/sanity/types';

export const revalidate = 60;

const CATEGORY_ORDER: AircraftCategory[] = [
  'biplace-ecole',
  'handiplaneur',
  'biplace-perf',
  'monoplace-debut',
  'monoplace-perf',
  'remorqueur',
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.gliders' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/planeurs' });
}

export default async function GlidersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gliders');

  const aircraft = await sanityFetch<Aircraft[]>(allAircraftQuery, []);
  const rank = (a: Aircraft) => {
    const i = a.category ? CATEGORY_ORDER.indexOf(a.category) : -1;
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  const tClub = await getTranslations('club');
  // "13 planeurs, des biplaces école…", counted from the fleet itself (tow planes excluded)
  const gliderCount = aircraft.filter((a) => a.category !== 'remorqueur').length;
  const lead = gliderCount > 0 ? tClub('factsFleetText', { count: gliderCount }) : undefined;
  const sorted = [...aircraft].sort((a, b) => rank(a) - rank(b) || (a.sortOrder ?? 100) - (b.sortOrder ?? 100));

  return (
    <>
      <SitePageHero page="gliders" kicker={t('heroKicker')} title={t('heroTitle')} lead={lead} />
      <Container className="pt-10 pb-16 lg:pt-14 lg:pb-28">
        {sorted.length === 0 ? (
          <EmptyState seed="flotte">{t('empty')}</EmptyState>
        ) : (
          <ul className="grid items-start gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((a) => {
              const meta = [
                a.specs?.seats && t('seats', { count: a.specs.seats }),
                a.specs?.wingspan && `${t('wingspan')} ${a.specs.wingspan}`,
                a.specs?.glideRatio && `${t('glideRatio')} ${a.specs.glideRatio}`,
              ].filter(Boolean);
              const specs = [
                a.manufacturer && { label: t('manufacturer'), value: a.manufacturer },
                a.registration && { label: t('registration'), value: a.registration },
                a.specs?.year && { label: t('year'), value: String(a.specs.year) },
                a.specs?.maxWeight && { label: t('maxWeight'), value: a.specs.maxWeight },
                a.instrumentation && { label: t('instrumentation'), value: a.instrumentation },
              ].filter((s): s is { label: string; value: string } => Boolean(s));
              const description = localize(a.description, locale);
              return (
                <li key={a._id} className="flex flex-col">
                  {a.photo?.asset ? (
                    <SanityPhoto
                      image={{ ...a.photo, alt: a.photo.alt ?? a.name }}
                      label={a.name}
                      className="aspect-[4/3]"
                      ratio={0.75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    />
                  ) : (
                    // No photo: the contest letters on a tail fin, or the flight trace without them
                    <FlightTrace seed={a.name} callsign={a.callsign || undefined} className="aspect-[4/3] rounded-md" />
                  )}
                  {a.category && (
                    <p className="mt-4 text-sm font-semibold text-balise">{t(`categories.${a.category}`)}</p>
                  )}
                  <h3 className="mt-1.5 font-display text-[1.375rem] leading-[1.2] font-semibold text-azur">{a.name}</h3>
                  {meta.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-texte tabular-nums">
                      {meta.map((m) => (
                        <span key={m as string}>{m}</span>
                      ))}
                    </p>
                  )}
                  {(description || specs.length > 0) && (
                    <details className="group mt-3 border-t border-horizon">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-altitude [&::-webkit-details-marker]:hidden">
                        {t('details')}
                        <ChevronDown
                          size={18}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-150 ease-planeur group-open:rotate-180"
                        />
                      </summary>
                      <div className="pb-2">
                        {description && <p className="text-[0.9375rem] leading-[1.6] text-texte">{description}</p>}
                        {specs.length > 0 && (
                          <dl className="mt-3">
                            {specs.map((s) => (
                              <div key={s.label} className="flex justify-between gap-4 border-b border-horizon py-2 text-[0.9375rem] last:border-b-0">
                                <dt className="text-brume">{s.label}</dt>
                                <dd className="text-right font-medium text-nuit tabular-nums">{s.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    </details>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </>
  );
}
