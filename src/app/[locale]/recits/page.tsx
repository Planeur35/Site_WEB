import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import StoryCard from '@/components/ui/StoryCard';
import TextLink from '@/components/ui/TextLink';
import { sanityFetch } from '@/lib/sanity/fetch';
import { allFlightStoriesQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { FlightStory, SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

/**
 * Column span of each card in a 6-column grid, for 1 to 6 stories, so that every row is full:
 * 1 wide card · 2 side by side · 3 in a row · 2×2 · 3 + 2 · 3×2.
 * On phones every card takes the full width.
 */
const SPANS: Record<number, string[]> = {
  1: ['sm:col-span-6'],
  2: ['sm:col-span-3', 'sm:col-span-3'],
  3: ['sm:col-span-3 md:col-span-2', 'sm:col-span-3 md:col-span-2', 'sm:col-span-6 md:col-span-2'],
  4: ['sm:col-span-3', 'sm:col-span-3', 'sm:col-span-3', 'sm:col-span-3'],
  5: [
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3',
    'sm:col-span-6 md:col-span-3',
  ],
  6: [
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
    'sm:col-span-3 md:col-span-2',
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.stories' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/recits' });
}

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stories');

  const [allStories, settings] = await Promise.all([
    sanityFetch<FlightStory[]>(allFlightStoriesQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
  ]);
  const stories = allStories.slice(0, 6);
  const spans = SPANS[stories.length] ?? [];

  return (
    <>
      <SitePageHero page="stories" kicker={t('heroKicker')} title={t('heroTitle')} />
      <Section kicker={t('kicker')} title={t('title')}>
        {stories.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-6">
          {stories.map((story, index) => (
            <StoryCard key={story._id} story={story} locale={locale} wide={stories.length === 1} className={spans[index]} />
          ))}
        </div>
        {settings?.weglideUrl && (
          <p className="mt-12">
            <TextLink href={settings.weglideUrl} external>
              {t('clubOnWeglide')}
            </TextLink>
          </p>
        )}
      </Section>
    </>
  );
}
