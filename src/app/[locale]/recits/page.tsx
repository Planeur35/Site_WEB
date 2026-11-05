import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import StoryCard from '@/components/ui/StoryCard';
import { sanityFetch } from '@/lib/sanity/fetch';
import { allFlightStoriesQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { FlightStory, SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

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

  return (
    <>
      <SitePageHero page="stories" kicker={t('heroKicker')} title={t('heroTitle')} />
      <Section
        kicker={t('kicker')}
        title={t('title')}
        action={settings?.weglideUrl ? { href: settings.weglideUrl, label: t('clubOnWeglide'), external: true } : undefined}
      >
        {stories.length === 0 ? (
          <EmptyState seed="recits">{t('empty')}</EmptyState>
        ) : (
          <div className={stories.length > 1 ? 'grid gap-x-8 gap-y-16 md:grid-cols-2' : 'max-w-[760px]'}>
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} locale={locale} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
