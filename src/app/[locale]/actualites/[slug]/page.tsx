import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import SanityPhoto from '@/components/ui/SanityPhoto';
import ShareButtons from '@/components/ui/ShareButtons';
import Tag from '@/components/ui/Tag';
import TextLink from '@/components/ui/TextLink';
import { formatDate } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';
import { allArticlesQuery, articleBySlugQuery } from '@/lib/sanity/queries';
import type { Article } from '@/lib/sanity/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = await sanityFetch<Article[]>(allArticlesQuery, []);
  return articles.map((article) => ({ slug: article.slug.current }));
}

const getArticle = (slug: string) => sanityFetch<Article | null>(articleBySlugQuery, null, { slug });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const title = localize(article.seo?.metaTitle, locale) ?? localize(article.title, locale) ?? '';
  const description = localize(article.seo?.metaDescription, locale) ?? localize(article.excerpt, locale) ?? '';
  return buildMetadata({
    title,
    description,
    locale,
    pathname: { pathname: '/actualites/[slug]', params: { slug } },
    image: article.featuredImage?.asset ? urlFor(article.featuredImage).width(1200).height(630).fit('crop').url() : undefined,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const article = await getArticle(slug);
  if (!article) notFound();

  const title = localize(article.title, locale) ?? '';
  const category = localize(article.category?.title, locale);
  const url = absoluteUrl({ pathname: '/actualites/[slug]', params: { slug } }, locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <TextLink href="/actualites">{t('allNews')}</TextLink>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <time dateTime={article.publishedAt} className="text-xs font-medium uppercase tracking-[0.25em] text-sky-800">
          {formatDate(article.publishedAt, locale)}
        </time>
        {category && <Tag>{category}</Tag>}
      </div>
      <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight text-sky-950 md:text-5xl">{title}</h1>
      {article.featuredImage?.asset && (
        <SanityPhoto
          image={article.featuredImage}
          className="mt-8 aspect-[3/2] w-full"
          ratio={2 / 3}
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      )}
      {article.excerpt && <p className="mt-8 font-serif text-xl leading-relaxed text-slate-800">{localize(article.excerpt, locale)}</p>}
      <PortableText value={localize(article.body, locale)} className="mt-8" />
      <ShareButtons url={url} title={title} className="mt-12 border-t border-sky-900/15 pt-6" />
    </article>
  );
}
