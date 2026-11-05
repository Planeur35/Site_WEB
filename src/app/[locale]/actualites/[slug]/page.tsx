import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildMetadata } from '@/lib/metadata';
import PortableText from '@/components/sanity/PortableText';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Container from '@/components/ui/Container';
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
  const tNav = await getTranslations('nav');

  const article = await getArticle(slug);
  if (!article) notFound();

  const title = localize(article.title, locale) ?? '';
  const category = localize(article.category?.title, locale);
  const excerpt = localize(article.excerpt, locale);
  const url = absoluteUrl({ pathname: '/actualites/[slug]', params: { slug } }, locale);

  return (
    <article className="pt-12 pb-20 lg:pt-16 lg:pb-32">
      <Container>
        <Breadcrumb trail={[{ href: '/actualites', label: tNav('news') }]} current={title} />
        {/* Long read: centred header, wide photo, text in a 680 px column */}
        <header className="mx-auto mt-10 flex max-w-[760px] flex-col lg:mt-14 lg:items-center lg:text-center">
          <div className="flex flex-wrap items-center gap-3 lg:justify-center">
            <time dateTime={article.publishedAt} className="text-sm font-semibold text-nuit">
              {formatDate(article.publishedAt, locale)}
            </time>
            {category && <Tag>{category}</Tag>}
          </div>
          <h1 className="mt-4 font-display text-[2.375rem] leading-[1.05] font-semibold tracking-titre text-balance text-azur lg:text-[3.5rem] lg:leading-[1.03]">
            {title}
          </h1>
          {excerpt && <p className="mt-5 text-[1.1875rem] leading-[1.55] text-texte lg:text-[1.375rem]">{excerpt}</p>}
        </header>
        {article.featuredImage?.asset && (
          <SanityPhoto
            image={article.featuredImage}
            className="mx-auto mt-10 aspect-[3/2] max-w-[1040px] lg:mt-14"
            ratio={2 / 3}
            sizes="(max-width: 1100px) 100vw, 1040px"
            priority
          />
        )}
        <PortableText value={localize(article.body, locale)} className="prose-piv-longread mx-auto mt-10 max-w-[680px] lg:mt-16" />
        <div className="mx-auto mt-12 flex max-w-[680px] flex-col items-start gap-6 border-t border-horizon pt-6">
          <ShareButtons url={url} title={title} />
          <TextLink href="/actualites">{t('allNews')}</TextLink>
        </div>
      </Container>
    </article>
  );
}
