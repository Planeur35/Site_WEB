import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/ui/PageHero';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Section from '@/components/ui/Section';
import Tag from '@/components/ui/Tag';
import TextLink from '@/components/ui/TextLink';
import { formatMonthYear } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
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

  const [stories, settings] = await Promise.all([
    sanityFetch<FlightStory[]>(allFlightStoriesQuery, []),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
  ]);

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={t('heroTitle')} variant={1} />
      <Section kicker={t('kicker')} title={t('title')}>
        {stories.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
        <div className="border-t border-sky-900/15">
          {stories.map((story) => {
            const body = localize(story.body, locale);
            return (
              <article key={story._id} className="grid gap-8 border-b border-sky-900/15 px-2 py-10 md:grid-cols-[1fr_240px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    {story.flightDate && (
                      <span className="text-xs font-medium uppercase tracking-[0.25em] text-sky-800">
                        {formatMonthYear(story.flightDate, locale)}
                      </span>
                    )}
                    {story.aircraft && <Tag>{story.aircraft}</Tag>}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl leading-snug text-sky-950">{localize(story.title, locale)}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">{localize(story.excerpt, locale)}</p>
                  {body && body.length > 0 && (
                    <details className="group mt-4 max-w-2xl">
                      <summary className="inline-flex min-h-11 cursor-pointer items-center text-xs uppercase tracking-[0.25em] text-sky-800 underline decoration-sky-300 underline-offset-4">
                        <span className="group-open:hidden">{t('read')}</span>
                        <span className="hidden group-open:inline">{t('close')}</span>
                      </summary>
                      <PortableText value={body} className="mt-4 text-sm" />
                    </details>
                  )}
                  {story.weglideUrl && (
                    <p className="mt-4">
                      <TextLink href={story.weglideUrl} external>
                        {t('weglide')}
                      </TextLink>
                    </p>
                  )}
                </div>
                {story.image?.asset && (
                  <SanityPhoto image={story.image} className="h-44 md:order-first md:col-start-2 md:row-start-1" ratio={0.7} sizes="(max-width: 768px) 100vw, 240px" />
                )}
              </article>
            );
          })}
        </div>
        {settings?.weglideUrl && (
          <p className="mt-10">
            <TextLink href={settings.weglideUrl} external>
              {t('clubOnWeglide')}
            </TextLink>
          </p>
        )}
      </Section>
    </>
  );
}
