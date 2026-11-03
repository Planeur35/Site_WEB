import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Kicker from '@/components/ui/Kicker';
import PageHero from '@/components/ui/PageHero';
import ShareButtons from '@/components/ui/ShareButtons';
import Tag from '@/components/ui/Tag';
import TextLink from '@/components/ui/TextLink';
import { formatMonthYear } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';
import { allFlightStoriesQuery, flightStoryBySlugQuery } from '@/lib/sanity/queries';
import type { FlightStory } from '@/lib/sanity/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const stories = await sanityFetch<FlightStory[]>(allFlightStoriesQuery, []);
  return stories.flatMap((story) => (story.slug?.current ? [{ slug: story.slug.current }] : []));
}

const getStory = (slug: string) => sanityFetch<FlightStory | null>(flightStoryBySlugQuery, null, { slug });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};
  return buildMetadata({
    title: localize(story.title, locale) ?? '',
    description: localize(story.excerpt, locale) ?? '',
    locale,
    pathname: { pathname: '/recits/[slug]', params: { slug } },
    image: story.image?.asset ? urlFor(story.image).width(1200).height(630).fit('crop').url() : undefined,
  });
}

/** A flight story, laid out like a magazine article (same spirit as the club history). */
export default async function StoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stories');
  const tClub = await getTranslations('club');

  const story = await getStory(slug);
  if (!story) notFound();

  const title = localize(story.title, locale) ?? '';
  const intro = localize(story.excerpt, locale);
  const url = absoluteUrl({ pathname: '/recits/[slug]', params: { slug } }, locale);

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={title} variant={1} image={story.image} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <TextLink href="/recits">{t('all')}</TextLink>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {story.flightDate && (
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-sky-800">
              {formatMonthYear(story.flightDate, locale)}
            </span>
          )}
          {story.aircraft && <Tag>{story.aircraft}</Tag>}
        </div>
        {intro && (
          <p className="mt-6 font-serif text-xl leading-relaxed text-slate-800 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:text-sky-950">
            {intro}
          </p>
        )}
        <PortableText value={localize(story.body, locale)} className="mt-8" />
        {story.anecdotes?.map((anecdote) => (
          <aside key={anecdote._key} className="mt-8 border-l-2 border-sky-500 py-1 pl-6">
            <Kicker>
              {tClub('anecdote')} · {localize(anecdote.title, locale)}
            </Kicker>
            <p className="font-serif text-lg leading-relaxed text-slate-700">{localize(anecdote.text, locale)}</p>
          </aside>
        ))}
        {story.weglideUrl && (
          <p className="mt-10">
            <TextLink href={story.weglideUrl} external>
              {t('weglide')}
            </TextLink>
          </p>
        )}
        <ShareButtons url={url} title={title} className="mt-12 border-t border-sky-900/15 pt-6" />
      </article>
    </>
  );
}
