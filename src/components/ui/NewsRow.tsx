import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SanityPhoto from '@/components/ui/SanityPhoto';
import ShareButtons from '@/components/ui/ShareButtons';
import Tag from '@/components/ui/Tag';
import TextLink from '@/components/ui/TextLink';
import { formatDate } from '@/lib/format';
import { absoluteUrl } from '@/lib/metadata';
import { localize } from '@/lib/sanity/localize';
import type { Article } from '@/lib/sanity/types';

interface NewsRowProps {
  article: Article;
}

/**
 * One line of the news list: date, title, excerpt and a 4:3 photo on the right.
 * On a phone the photo becomes a thumbnail and the excerpt hides.
 * Only the title is a link, so the text stays selectable.
 */
export default async function NewsRow({ article }: NewsRowProps) {
  const locale = await getLocale();
  const t = await getTranslations('news');
  const title = localize(article.title, locale) ?? '';
  const category = localize(article.category?.title, locale);
  const excerpt = localize(article.excerpt, locale);
  const href = { pathname: '/actualites/[slug]' as const, params: { slug: article.slug.current } };

  return (
    <article className="grid grid-cols-[1fr_96px] gap-4 rounded-md bg-blanc p-3.5 sm:grid-cols-[1fr_200px] sm:gap-7 sm:rounded-none sm:border-t sm:border-horizon sm:bg-transparent sm:px-0 sm:py-7">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <time dateTime={article.publishedAt} className="text-sm font-semibold text-nuit">
            {formatDate(article.publishedAt, locale)}
          </time>
          {category && <Tag>{category}</Tag>}
        </div>
        <h3 className="mt-2 font-display text-[1.1875rem] leading-snug font-semibold text-azur lg:text-h4">
          <Link href={href} className="decoration-2 underline-offset-4 hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 line-clamp-2 hidden text-texte sm:block">{excerpt}</p>}
        <div className="mt-2 hidden items-center gap-2 sm:flex">
          <TextLink href={href}>{t('readMore')}</TextLink>
          <ShareButtons url={absoluteUrl(href, locale)} title={title} compact />
        </div>
      </div>
      <SanityPhoto
        image={article.featuredImage}
        label={title}
        className="aspect-square sm:aspect-[4/3]"
        ratio={0.75}
        sizes="(max-width: 640px) 96px, 200px"
        thumbnail
      />
    </article>
  );
}
