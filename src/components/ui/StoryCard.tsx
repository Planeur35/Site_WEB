import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Tag from '@/components/ui/Tag';
import { formatMonthYear } from '@/lib/format';
import { localize } from '@/lib/sanity/localize';
import type { FlightStory } from '@/lib/sanity/types';

interface StoryCardProps {
  story: FlightStory;
  locale: string;
  /** Wide 16:9 photo, used when the club has a single story. */
  wide?: boolean;
  className?: string;
}

/** One cell of the flight stories grid: photo, date, glider and title. */
export default function StoryCard({ story, locale, wide = false, className }: StoryCardProps) {
  const slug = story.slug?.current;
  if (!slug) return null;
  const title = localize(story.title, locale) ?? '';

  return (
    <Link href={{ pathname: '/recits/[slug]', params: { slug } }} className={clsx('group block', className)}>
      <SanityPhoto
        image={story.image}
        label={title}
        className={clsx('w-full', wide ? 'aspect-[16/9]' : 'aspect-[4/3]')}
        ratio={wide ? 0.5625 : 0.75}
        sizes={wide ? '(max-width: 1024px) 100vw, 960px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px'}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {story.flightDate && (
          <span className="text-sm font-semibold text-nuit">
            {formatMonthYear(story.flightDate, locale)}
          </span>
        )}
        {story.aircraft && <Tag>{story.aircraft}</Tag>}
      </div>
      <h3 className="mt-2 font-display text-[1.1875rem] leading-snug font-semibold text-azur decoration-2 underline-offset-4 group-hover:underline lg:text-h4">
        {title}
      </h3>
    </Link>
  );
}
