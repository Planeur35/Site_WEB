import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import { CLUB_ANCHORS } from '@/components/layout/navItems';
import PortableText from '@/components/sanity/PortableText';
import EmptyState from '@/components/ui/EmptyState';
import Kicker from '@/components/ui/Kicker';
import SitePageHero from '@/components/ui/SitePageHero';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { imageDimensions, urlFor } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';
import { allClubPagesQuery, clubHistoryQuery } from '@/lib/sanity/queries';
import type { ClubHistory, ClubPage, ClubSection } from '@/lib/sanity/types';

export const revalidate = 60;

const SECTION_ORDER: ClubSection[] = ['presentation', 'platform', 'activities', 'training', 'campaign', 'competition'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.club' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/club' });
}

export default async function ClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('club');
  const tNav = await getTranslations('nav');

  const [pages, history] = await Promise.all([
    sanityFetch<ClubPage[]>(allClubPagesQuery, []),
    sanityFetch<ClubHistory | null>(clubHistoryQuery, null),
  ]);

  const sections = SECTION_ORDER.flatMap((section) => {
    const page = pages.find((p) => p.section === section);
    return page ? [{ section, page }] : [];
  });

  return (
    <>
      <SitePageHero page="club" kicker={t('heroKicker')} title={t('heroTitle')} variant={0} />

      {sections.length === 0 && !history && (
        <Section title={t('emptyTitle')}>
          <EmptyState>{t('empty')}</EmptyState>
        </Section>
      )}

      {sections.map(({ section, page }) => {
        const intro = localize(page.intro, locale);
        return (
          <Section key={section} id={CLUB_ANCHORS[section]} kicker={tNav(section)} title={localize(page.title, locale) ?? tNav(section)}>
            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
              <div>
                {intro && <p className="mb-6 font-serif text-xl leading-relaxed text-slate-800">{intro}</p>}
                <PortableText value={localize(page.body, locale)} />
              </div>
              <SanityPhoto
                image={page.mainImage}
                label={localize(page.title, locale)}
                className="h-64 md:h-80"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
            {page.diagram?.asset && (
              <figure className="mt-10 border border-sky-900/10 bg-white p-4 md:p-8">
                <Image
                  src={urlFor(page.diagram).width(1400).url()}
                  alt={page.diagram.alt ?? ''}
                  {...imageDimensions(page.diagram.asset._ref)}
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="h-auto w-full"
                />
              </figure>
            )}
          </Section>
        );
      })}

      {history && (
        <Section id={CLUB_ANCHORS.history} kicker={tNav('history')} title={localize(history.title, locale) ?? tNav('history')}>
          <div className="max-w-3xl">
            {localize(history.intro, locale) && (
              <p className="font-serif text-xl leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-sky-950">
                {localize(history.intro, locale)}
              </p>
            )}
            <PortableText value={localize(history.body, locale)} className="mt-8" />
            {history.anecdotes?.map((a) => (
              <aside key={a._key} className="mt-8 border-l-2 border-sky-500 py-1 pl-6">
                <Kicker>
                  {t('anecdote')} · {localize(a.title, locale)}
                </Kicker>
                <p className="font-serif text-lg leading-relaxed text-slate-700">{localize(a.text, locale)}</p>
              </aside>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
