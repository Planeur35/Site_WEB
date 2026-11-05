import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Tag from '@/components/ui/Tag';
import TextLink from '@/components/ui/TextLink';
import { formatMonthYear } from '@/lib/format';
import { localize } from '@/lib/sanity/localize';
import type { FlightStory } from '@/lib/sanity/types';

interface StoryCardProps {
  story: FlightStory;
  locale: string;
}

/**
 * A wide card of the flight stories: 16:9 photo (or the trace, seeded by the title),
 * date and glider, title, excerpt, then the story and its WeGlide trace.
 * Only the title and the links are links, so the text stays selectable.
 */
export default async function StoryCard({ story, locale }: StoryCardProps) {
  const slug = story.slug?.current;
  if (!slug) return null;
  const t = await getTranslations('stories');
  const title = localize(story.title, locale) ?? '';
  const excerpt = localize(story.excerpt, locale);
  const href = { pathname: '/recits/[slug]' as const, params: { slug } };

  return (
    <article className="flex flex-col">
      <SanityPhoto
        image={story.image}
        label={title}
        className="aspect-[16/9]"
        ratio={0.5625}
        sizes="(max-width: 768px) 100vw, 600px"
      />
      {(story.flightDate || story.aircraft) && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {story.flightDate && (
            <span className="text-sm font-semibold text-nuit first-letter:uppercase">
              {formatMonthYear(story.flightDate, locale)}
            </span>
          )}
          {story.aircraft && <Tag>{story.aircraft}</Tag>}
        </div>
      )}
      <h3 className="mt-2 font-display text-[1.375rem] leading-[1.2] font-semibold text-balance text-azur lg:text-[1.625rem]">
        <Link href={href} className="decoration-2 underline-offset-4 hover:underline">
          {title}
        </Link>
      </h3>
      {excerpt && <p className="mt-3 line-clamp-3 text-[1.0625rem] leading-[1.6] text-texte">{excerpt}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-x-6">
        <TextLink href={href}>{t('read')}</TextLink>
        {story.weglideUrl && (
          <TextLink href={story.weglideUrl} external>
            {t('weglide')}
          </TextLink>
        )}
      </div>
    </article>
  );
}
