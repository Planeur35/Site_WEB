import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import { Link } from '@/i18n/navigation';
import { client } from '@/lib/sanity/client';
import { allArticlesQuery } from '@/lib/sanity/queries';
import { localize } from '@/lib/sanity/localize';
import { urlFor } from '@/lib/sanity/image';
import type { Article } from '@/lib/sanity/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Actualit\u00e9s \u2014 Planeurs d'Ille-et-Vilaine"
      : "News \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Toutes les actualit\u00e9s du club de vol \u00e0 voile : \u00e9v\u00e9nements, comp\u00e9titions, formations et vie du club."
      : 'All the soaring club news: events, competitions, training, and club life.',
    locale,
    pathname: '/actualites',
  });
}

export const revalidate = 60;

interface DisplayArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  imageUrl?: string;
  color: string;
}

const articleColors = [
  'from-sky-200 to-sky-300',
  'from-blue-200 to-indigo-300',
  'from-indigo-200 to-purple-300',
  'from-teal-200 to-cyan-300',
  'from-emerald-200 to-teal-300',
  'from-amber-200 to-orange-300',
];

function getPlaceholderArticles(locale: string): DisplayArticle[] {
  const frArticles = [
    {
      title: 'Ouverture de la saison 2026',
      excerpt:
        'La saison de vol a voile reprend avec de belles conditions meteorologiques prevues pour ce printemps. Rendez-vous sur le terrain des le mois de mars pour les premiers vols de la saison.',
      date: '2026-03-15',
      category: 'Club',
      slug: 'ouverture-saison-2026',
    },
    {
      title: "Stage d'initiation au vol a voile",
      excerpt:
        "Venez decouvrir le vol a voile lors de notre prochain stage d'initiation ouvert a tous. Une semaine pour apprendre les bases du pilotage en planeur.",
      date: '2026-03-01',
      category: 'Formation',
      slug: 'stage-initiation-2026',
    },
    {
      title: 'Resultats du championnat regional',
      excerpt:
        'Retour sur les performances de nos pilotes lors du dernier championnat regional de vol a voile. De belles performances pour le club cette annee.',
      date: '2026-02-20',
      category: 'Competition',
      slug: 'resultats-championnat-regional',
    },
    {
      title: 'Nouveau planeur dans la flotte',
      excerpt:
        "Le club accueille un nouveau planeur LS-8 qui vient enrichir notre flotte. Un appareil performant qui ravira les pilotes experimentes.",
      date: '2026-02-10',
      category: 'Club',
      slug: 'nouveau-planeur-ls8',
    },
    {
      title: 'Journee portes ouvertes',
      excerpt:
        "Le club organise une journee portes ouvertes le premier week-end d'avril. Venez decouvrir le vol a voile et profiter de vols d'initiation a tarif reduit.",
      date: '2026-01-25',
      category: 'Evenement',
      slug: 'journee-portes-ouvertes',
    },
    {
      title: 'Bilan de la saison 2025',
      excerpt:
        'Retour sur une saison 2025 riche en exploits et en convivialite. Plus de 2000 heures de vol realisees et plusieurs brevets obtenus par nos eleves.',
      date: '2026-01-10',
      category: 'Club',
      slug: 'bilan-saison-2025',
    },
  ];

  const enArticles = [
    {
      title: '2026 Season Opening',
      excerpt:
        'The soaring season kicks off with great weather conditions expected this spring. Meet us at the airfield from March for the first flights of the season.',
      date: '2026-03-15',
      category: 'Club',
      slug: 'ouverture-saison-2026',
    },
    {
      title: 'Introductory Soaring Course',
      excerpt:
        'Discover soaring at our next introductory course, open to everyone. One week to learn the basics of glider flying.',
      date: '2026-03-01',
      category: 'Training',
      slug: 'stage-initiation-2026',
    },
    {
      title: 'Regional Championship Results',
      excerpt:
        "A look back at our pilots' performances at the latest regional soaring championship. Great results for the club this year.",
      date: '2026-02-20',
      category: 'Competition',
      slug: 'resultats-championnat-regional',
    },
    {
      title: 'New Glider in the Fleet',
      excerpt:
        'The club welcomes a new LS-8 glider to enrich our fleet. A high-performance aircraft that will delight experienced pilots.',
      date: '2026-02-10',
      category: 'Club',
      slug: 'nouveau-planeur-ls8',
    },
    {
      title: 'Open Day',
      excerpt:
        'The club is hosting an open day on the first weekend of April. Come and discover soaring with discounted introductory flights.',
      date: '2026-01-25',
      category: 'Event',
      slug: 'journee-portes-ouvertes',
    },
    {
      title: '2025 Season Review',
      excerpt:
        'Looking back on a 2025 season full of achievements and camaraderie. Over 2,000 hours flown and several licences earned by our students.',
      date: '2026-01-10',
      category: 'Club',
      slug: 'bilan-saison-2025',
    },
  ];

  const articles = locale === 'fr' ? frArticles : enArticles;
  return articles.map((a, i) => ({
    id: `placeholder-${i}`,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    category: a.category,
    color: articleColors[i % articleColors.length],
  }));
}

async function getArticles(locale: string): Promise<DisplayArticle[]> {
  try {
    const articles: Article[] = await client.fetch(allArticlesQuery);
    if (articles && articles.length > 0) {
      return articles.map((article, i) => ({
        id: article._id,
        slug: article.slug.current,
        title: localize(article.title, locale) || 'Article',
        excerpt: localize(article.excerpt, locale) || '',
        date: article.publishedAt || '',
        category: article.category
          ? localize(article.category.title, locale) || undefined
          : undefined,
        imageUrl: article.featuredImage
          ? urlFor(article.featuredImage).width(600).height(400).auto('format').url()
          : undefined,
        color: articleColors[i % articleColors.length],
      }));
    }
    return getPlaceholderArticles(locale);
  } catch {
    return getPlaceholderArticles(locale);
  }
}

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getArticles(locale);

  return <NewsPageContent locale={locale} articles={articles} />;
}

function NewsPageContent({
  locale,
  articles,
}: {
  locale: string;
  articles: DisplayArticle[];
}) {
  const tNav = useTranslations('nav');
  const tNews = useTranslations('news');
  const tCommon = useTranslations('common');

  return (
    <div>
      <Hero title={tNav('news')} subtitle={tNews('heroSubtitle')} />

      <section className="py-16">
        <SectionContainer>
          {articles.length === 0 ? (
            <p className="text-center text-muted py-12">{tNews('noArticles')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={{
                    pathname: '/actualites/[slug]',
                    params: { slug: article.slug },
                  }}
                  className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border"
                >
                  {/* Image area */}
                  {article.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className={`aspect-video bg-gradient-to-br ${article.color} flex items-center justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-white/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {article.category && (
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                      )}
                      {article.date && (
                        <span className="text-xs text-muted">
                          {formatDate(article.date, locale)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-accent text-sm font-medium group-hover:underline">
                      {tCommon('readMore')} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionContainer>
      </section>
    </div>
  );
}
