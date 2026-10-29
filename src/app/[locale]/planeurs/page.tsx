import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import SitePageHero from '@/components/ui/SitePageHero';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Section from '@/components/ui/Section';
import Tag from '@/components/ui/Tag';
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
  const sorted = [...aircraft].sort((a, b) => rank(a) - rank(b) || (a.sortOrder ?? 100) - (b.sortOrder ?? 100));

  return (
    <>
      <SitePageHero page="gliders" kicker={t('heroKicker')} title={t('heroTitle')} variant={1} />
      <Section kicker={t('sectionKicker')} title={t('sectionTitle')}>
        {sorted.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
        <div className="border-t border-sky-900/15">
          {sorted.map((a) => {
            const specs = [
              a.specs?.wingspan && { label: t('wingspan'), value: a.specs.wingspan },
              a.specs?.glideRatio && { label: t('glideRatio'), value: a.specs.glideRatio },
              a.manufacturer && { label: t('manufacturer'), value: a.manufacturer },
            ].filter((s): s is { label: string; value: string } => Boolean(s));
            const facts = [
              a.specs?.seats && t('seats', { count: a.specs.seats }),
              a.specs?.year && t('since', { year: a.specs.year }),
              a.registration,
            ].filter(Boolean);
            return (
              <article
                key={a._id}
                className="grid gap-8 border-b border-sky-900/15 px-2 py-8 transition-colors hover:bg-white/70 md:grid-cols-[240px_1fr]"
              >
                <SanityPhoto
                  image={a.photo ? { ...a.photo, alt: a.photo.alt ?? a.name } : undefined}
                  label={a.name}
                  className="h-44"
                  ratio={0.6}
                  sizes="(max-width: 768px) 100vw, 240px"
                />
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="font-serif text-2xl text-sky-950">{a.name}</h3>
                    {a.category && <Tag>{t(`categories.${a.category}`)}</Tag>}
                  </div>
                  {facts.length > 0 && <p className="mt-1 text-sm tracking-wide text-slate-600">{facts.join(' · ')}</p>}
                  {a.description && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700">{localize(a.description, locale)}</p>
                  )}
                  {specs.length > 0 && (
                    <dl className="mt-4 grid max-w-md gap-1 text-sm">
                      {specs.map((s) => (
                        <div key={s.label} className="flex justify-between gap-4 border-b border-sky-900/10 pb-1">
                          <dt className="text-slate-600">{s.label}</dt>
                          <dd className="font-medium text-sky-950">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
