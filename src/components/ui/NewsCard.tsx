import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Tag from '@/components/ui/Tag';
import { formatDate } from '@/lib/format';
import { localize } from '@/lib/sanity/localize';
import type { Article } from '@/lib/sanity/types';

interface NewsCardProps {
  article: Article;
}

/**
 * A news item on the home page: 16:10 photo, date, title and excerpt.
 * Only the title is a link, so the text stays selectable and the focus order stays clean.
 */
export default async function NewsCard({ article }: NewsCardProps) {
  const locale = await getLocale();
  const title = localize(article.title, locale) ?? '';
  const category = localize(article.category?.title, locale);
  const excerpt = localize(article.excerpt, locale);

  return (
    <article className="flex flex-col gap-[18px]">
      <SanityPhoto
        image={article.featuredImage}
        label={title}
        className="aspect-[16/10]"
        ratio={0.625}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <time dateTime={article.publishedAt} className="text-sm font-semibold text-nuit">
          {formatDate(article.publishedAt, locale)}
        </time>
        {category && <Tag>{category}</Tag>}
      </div>
      <h3 className="font-display text-h4 font-semibold text-azur">
        <Link
          href={{ pathname: '/actualites/[slug]', params: { slug: article.slug.current } }}
          className="decoration-2 underline-offset-4 hover:underline"
        >
          {title}
        </Link>
      </h3>
      {excerpt && <p className="line-clamp-3 text-texte">{excerpt}</p>}
    </article>
  );
}
