import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Anecdote from '@/components/ui/Anecdote';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Container from '@/components/ui/Container';
import FrenchOnlyNote from '@/components/ui/FrenchOnlyNote';
import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import ShareButtons from '@/components/ui/ShareButtons';
import TextLink from '@/components/ui/TextLink';
import { formatMonthYear } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/image';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
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

/** A flight story, laid out as a long read like the club history. */
export default async function StoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stories');
  const tNav = await getTranslations('nav');

  const story = await getStory(slug);
  if (!story) notFound();

  const title = localize(story.title, locale) ?? '';
  const intro = localize(story.excerpt, locale);
  const url = absoluteUrl({ pathname: '/recits/[slug]', params: { slug } }, locale);

  const meta = [story.flightDate && formatMonthYear(story.flightDate, locale), story.aircraft].filter(Boolean).join(' · ');

  const french = [story.title, story.excerpt, story.body].some((field) => isFrenchFallback(field, locale));
  const fr = french ? 'fr' : undefined;

  return (
    <article className="pt-12 pb-20 lg:pt-16 lg:pb-32">
      <Container>
        <Breadcrumb trail={[{ href: '/recits', label: tNav('stories') }]} current={title} />
        {/* Long read, like the club history: centred header, wide photo, text in a 680 px column */}
        <header className="mx-auto mt-10 flex max-w-[760px] flex-col lg:mt-14 lg:items-center lg:text-center">
          <Kicker className="first-letter:uppercase">{meta || t('heroKicker')}</Kicker>
          <h1 lang={fr} className="font-display text-[2.375rem] leading-[1.05] font-semibold tracking-titre text-balance text-azur lg:text-[3.5rem] lg:leading-[1.03]">
            {title}
          </h1>
          {intro && <p lang={fr} className="mt-5 text-[1.1875rem] leading-[1.55] text-texte lg:text-[1.375rem]">{intro}</p>}
          {french && <FrenchOnlyNote className="mt-5" />}
        </header>
        <SanityPhoto
          image={story.image}
          label={title}
          className="mx-auto mt-10 aspect-[16/9] max-w-[1040px] lg:mt-14"
          ratio={0.5625}
          sizes="(max-width: 1100px) 100vw, 1040px"
          priority
        />
        <PortableText value={localize(story.body, locale)} className="prose-piv-longread mx-auto mt-10 max-w-[680px] lg:mt-16" lang={fr} />
        <div className="mx-auto mt-10 flex max-w-[680px] flex-col items-start gap-6">
          {story.anecdotes?.map((anecdote) => (
            <Anecdote
              key={anecdote._key}
              title={localize(anecdote.title, locale)}
              text={localize(anecdote.text, locale)}
              lang={isFrenchFallback(anecdote.text, locale) ? 'fr' : undefined}
            />
          ))}
          {story.weglideUrl && (
            <TextLink href={story.weglideUrl} external>
              {t('weglide')}
            </TextLink>
          )}
          <div className="flex w-full flex-col items-start gap-6 border-t border-horizon pt-6">
            <ShareButtons url={url} title={title} />
            <TextLink href="/recits">{t('all')}</TextLink>
          </div>
        </div>
      </Container>
    </article>
  );
}
