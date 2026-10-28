import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Tag from '@/components/ui/Tag';
import { formatDate } from '@/lib/format';
import { localize } from '@/lib/sanity/localize';
import type { Article } from '@/lib/sanity/types';

interface NewsRowProps {
  article: Article;
}

/** One line of the news list: photo, date, title, excerpt. */
export default async function NewsRow({ article }: NewsRowProps) {
  const locale = await getLocale();
  const category = localize(article.category?.title, locale);

  return (
    <Link
      href={{ pathname: '/actualites/[slug]', params: { slug: article.slug.current } }}
      className="flex items-start gap-6 border-b border-sky-900/15 px-2 py-8 transition-colors hover:bg-white/70 md:gap-8"
    >
      <SanityPhoto image={article.featuredImage} className="hidden h-24 w-24 shrink-0 sm:block" ratio={1} sizes="96px" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <time dateTime={article.publishedAt} className="text-xs font-medium uppercase tracking-[0.25em] text-sky-800">
            {formatDate(article.publishedAt, locale)}
          </time>
          {category && <Tag>{category}</Tag>}
        </div>
        <h3 className="mt-2 font-serif text-xl leading-snug text-sky-950">{localize(article.title, locale)}</h3>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{localize(article.excerpt, locale)}</p>
        )}
      </div>
    </Link>
  );
}
