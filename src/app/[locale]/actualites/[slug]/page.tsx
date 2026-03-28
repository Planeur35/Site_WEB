import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import PortableText from '@/components/sanity/PortableText';
import { Link } from '@/i18n/navigation';
import { client } from '@/lib/sanity/client';
import {
  articleBySlugQuery,
  allArticlesQuery,
} from '@/lib/sanity/queries';
import { localize } from '@/lib/sanity/localize';
import { urlFor } from '@/lib/sanity/image';
import type { Article } from '@/lib/sanity/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ---------------------------------------------------------------------------
// Placeholder data for when Sanity is not connected
// ---------------------------------------------------------------------------
function getPlaceholderArticle(slug: string, locale: string) {
  const frPlaceholders: Record<
    string,
    { title: string; excerpt: string; body: string; category: string; author: string; date: string }
  > = {
    'ouverture-saison-2026': {
      title: 'Ouverture de la saison 2026',
      excerpt:
        'La saison de vol a voile reprend avec de belles conditions meteorologiques prevues pour ce printemps.',
      body: "La saison 2026 s'annonce exceptionnelle pour le club des Planeurs d'Ille-et-Vilaine. Apres une intersaison consacree a la maintenance de notre flotte et a l'amenagement de nos installations, nous sommes prets a accueillir nos membres pour une nouvelle annee de vol a voile.\n\nLes conditions meteorologiques prevues pour ce printemps sont particulierement encourageantes, avec des thermiques precoces et des journees de vol qui s'allongent.\n\nNous invitons tous nos membres a participer a la journee d'ouverture prevue le 15 mars, avec au programme : briefing meteorologique, vols de reprise pour les pilotes, et un moment convivial au club house.\n\nLes nouveaux membres sont egalement les bienvenus. N'hesitez pas a nous contacter pour planifier un vol decouverte.",
      category: 'Club',
      author: 'Bureau PIV',
      date: '2026-03-15',
    },
    'stage-initiation-2026': {
      title: "Stage d'initiation au vol a voile",
      excerpt:
        "Venez decouvrir le vol a voile lors de notre prochain stage d'initiation ouvert a tous.",
      body: "Le club propose un stage d'initiation au vol a voile d'une semaine, ouvert a toutes et tous des 15 ans. Ce stage est l'occasion ideale de decouvrir les sensations uniques du vol silencieux.\n\nAu programme de cette semaine intensive :\n\n- Cours theoriques : meteorologie, aerodynamique, reglementation\n- Vols en biplace avec un instructeur qualifie\n- Apprentissage du decollage au treuil et en remorque\n- Exercices de vol thermique\n- Premiers vols solo pour les plus avances\n\nLe stage se deroule du lundi au samedi, avec environ 4 a 6 vols par jour selon les conditions meteorologiques. L'hebergement et la restauration peuvent etre organises sur place.\n\nInscriptions ouvertes des maintenant. Places limitees a 6 stagiaires par session.",
      category: 'Formation',
      author: 'Chef pilote',
      date: '2026-03-01',
    },
    'resultats-championnat-regional': {
      title: 'Resultats du championnat regional',
      excerpt:
        'Retour sur les performances de nos pilotes lors du dernier championnat regional de vol a voile.',
      body: "Le championnat regional de vol a voile s'est deroule du 10 au 15 fevrier sur l'aerodrome de Fougeres. Le PIV etait represente par quatre pilotes qui ont realise d'excellentes performances.\n\nClassement de nos pilotes :\n\n- Jean Dupont : 3eme en classe standard\n- Marie Martin : 5eme en classe club\n- Pierre Lebreton : 8eme en classe standard\n- Sophie Durand : 12eme en classe club\n\nLes conditions de vol ont ete variees tout au long de la semaine, avec des journees de convection marquee et d'autres plus techniques necessitant une lecture fine de la masse d'air.\n\nFelicitations a tous nos competiteurs pour leur engagement et leurs resultats. Rendez-vous cet ete pour le championnat inter-regional !",
      category: 'Competition',
      author: 'Bureau PIV',
      date: '2026-02-20',
    },
  };

  const enPlaceholders: Record<
    string,
    { title: string; excerpt: string; body: string; category: string; author: string; date: string }
  > = {
    'ouverture-saison-2026': {
      title: '2026 Season Opening',
      excerpt:
        'The soaring season kicks off with great weather conditions expected this spring.',
      body: "The 2026 season is shaping up to be exceptional for the Planeurs d'Ille-et-Vilaine club. After a winter dedicated to fleet maintenance and facility improvements, we are ready to welcome our members for another great year of soaring.\n\nWeather forecasts for this spring are particularly encouraging, with early thermals and longer flying days ahead.\n\nWe invite all members to join us for opening day on March 15th, featuring: weather briefing, refresher flights for pilots, and a social gathering at the clubhouse.\n\nNew members are also welcome. Don't hesitate to contact us to plan a discovery flight.",
      category: 'Club',
      author: 'PIV Committee',
      date: '2026-03-15',
    },
    'stage-initiation-2026': {
      title: 'Introductory Soaring Course',
      excerpt:
        'Discover soaring at our next introductory course, open to everyone.',
      body: "The club offers a one-week introductory soaring course, open to everyone aged 15 and above. This course is the perfect opportunity to discover the unique sensations of silent flight.\n\nThe week's programme includes:\n\n- Theory lessons: meteorology, aerodynamics, regulations\n- Tandem flights with a qualified instructor\n- Learning winch and aerotow launches\n- Thermal flying exercises\n- First solo flights for the most advanced students\n\nThe course runs from Monday to Saturday, with approximately 4 to 6 flights per day depending on weather conditions. Accommodation and meals can be arranged on site.\n\nRegistration is now open. Places are limited to 6 students per session.",
      category: 'Training',
      author: 'Chief Instructor',
      date: '2026-03-01',
    },
    'resultats-championnat-regional': {
      title: 'Regional Championship Results',
      excerpt:
        "A look back at our pilots' performances at the latest regional soaring championship.",
      body: "The regional soaring championship took place from February 10th to 15th at Fougeres aerodrome. PIV was represented by four pilots who achieved excellent results.\n\nOur pilots' standings:\n\n- Jean Dupont: 3rd in Standard class\n- Marie Martin: 5th in Club class\n- Pierre Lebreton: 8th in Standard class\n- Sophie Durand: 12th in Club class\n\nFlying conditions varied throughout the week, with strong convection days and more technical days requiring careful reading of the air mass.\n\nCongratulations to all our competitors for their dedication and results. See you this summer for the inter-regional championship!",
      category: 'Competition',
      author: 'PIV Committee',
      date: '2026-02-20',
    },
  };

  const placeholders = locale === 'fr' ? frPlaceholders : enPlaceholders;
  const placeholder = placeholders[slug];

  if (!placeholder) {
    // Generic fallback
    return {
      title: locale === 'fr' ? 'Article' : 'Article',
      excerpt:
        locale === 'fr'
          ? "Cet article n'est pas encore disponible."
          : 'This article is not yet available.',
      body:
        locale === 'fr'
          ? "Le contenu de cet article sera bientot disponible. Revenez nous voir prochainement pour decouvrir les dernieres actualites du club."
          : 'The content of this article will be available soon. Come back soon to discover the latest club news.',
      category: 'Club',
      author: locale === 'fr' ? 'Bureau PIV' : 'PIV Committee',
      date: '2026-03-01',
    };
  }

  return placeholder;
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getArticle(
  slug: string,
  locale: string
): Promise<{
  article: Article | null;
  placeholder: ReturnType<typeof getPlaceholderArticle> | null;
}> {
  try {
    const article = await client.fetch<Article | null>(articleBySlugQuery, { slug });
    if (article) {
      return { article, placeholder: null };
    }
    return { article: null, placeholder: getPlaceholderArticle(slug, locale) };
  } catch {
    return { article: null, placeholder: getPlaceholderArticle(slug, locale) };
  }
}

async function getRelatedArticles(
  currentSlug: string,
  categoryId: string | undefined,
  locale: string
): Promise<
  Array<{ slug: string; title: string; date: string; color: string }>
> {
  const articleColors = [
    'from-sky-200 to-sky-300',
    'from-blue-200 to-indigo-300',
    'from-indigo-200 to-purple-300',
    'from-teal-200 to-cyan-300',
  ];

  try {
    const allArticles: Article[] = await client.fetch(allArticlesQuery);
    if (allArticles && allArticles.length > 0) {
      const related = allArticles
        .filter(
          (a) =>
            a.slug.current !== currentSlug &&
            (categoryId ? a.category?._id === categoryId : true)
        )
        .slice(0, 3);
      return related.map((a, i) => ({
        slug: a.slug.current,
        title: localize(a.title, locale) || 'Article',
        date: a.publishedAt || '',
        color: articleColors[i % articleColors.length],
      }));
    }
    return [];
  } catch {
    return [];
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

// ---------------------------------------------------------------------------
// Metadata & static params
// ---------------------------------------------------------------------------
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const articles: Article[] = await client.fetch(allArticlesQuery);
    return articles.map((a) => ({ slug: a.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  let title = 'Article';
  let description = '';

  try {
    const article = await client.fetch<Article | null>(articleBySlugQuery, { slug });
    if (article) {
      title = localize(article.title, locale) || 'Article';
      description = localize(article.excerpt, locale) || '';
    } else {
      const placeholder = getPlaceholderArticle(slug, locale);
      title = placeholder.title;
      description = placeholder.excerpt;
    }
  } catch {
    const placeholder = getPlaceholderArticle(slug, locale);
    title = placeholder.title;
    description = placeholder.excerpt;
  }

  return buildMetadata({
    title,
    description,
    locale,
    pathname: `/actualites/${slug}`,
  });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function ArticleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const { article, placeholder } = await getArticle(slug, locale);

  let related: Array<{ slug: string; title: string; date: string; color: string }> = [];
  if (article) {
    related = await getRelatedArticles(slug, article.category?._id, locale);
  }

  return (
    <ArticleDetailContent
      locale={locale}
      article={article}
      placeholder={placeholder}
      related={related}
    />
  );
}

function ArticleDetailContent({
  locale,
  article,
  placeholder,
  related,
}: {
  locale: string;
  article: Article | null;
  placeholder: ReturnType<typeof getPlaceholderArticle> | null;
  related: Array<{ slug: string; title: string; date: string; color: string }>;
}) {
  const tNews = useTranslations('news');
  const tCommon = useTranslations('common');

  // Resolve display values from either Sanity article or placeholder
  const title = article
    ? localize(article.title, locale) || 'Article'
    : placeholder?.title || 'Article';
  const excerpt = article
    ? localize(article.excerpt, locale) || ''
    : placeholder?.excerpt || '';
  const author = article ? article.author : placeholder?.author;
  const date = article ? article.publishedAt : placeholder?.date;
  const categoryName = article
    ? article.category
      ? localize(article.category.title, locale)
      : undefined
    : placeholder?.category;
  const heroImageUrl = article?.featuredImage
    ? urlFor(article.featuredImage).width(1400).height(600).auto('format').url()
    : undefined;
  const body = article ? localize(article.body, locale) : null;
  const placeholderBody = placeholder?.body || null;

  return (
    <div>
      {/* Hero */}
      <Hero
        title={title}
        subtitle={excerpt}
        backgroundImage={heroImageUrl}
      />

      {/* Article content */}
      <section className="py-12">
        <SectionContainer className="max-w-4xl">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
            {categoryName && (
              <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                {categoryName}
              </span>
            )}
            {date && (
              <span className="text-sm text-muted">
                {tNews('publishedOn')} {formatDate(date, locale)}
              </span>
            )}
            {author && (
              <span className="text-sm text-muted">
                {tNews('by')} {author}
              </span>
            )}
          </div>

          {/* Body content */}
          {body ? (
            <PortableText value={body} className="prose prose-lg max-w-none" />
          ) : placeholderBody ? (
            <div className="prose prose-lg max-w-none">
              {placeholderBody.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed text-primary/80">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted">{tNews('noArticles')}</p>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/actualites"
              className="text-accent font-medium hover:underline"
            >
              &larr; {tCommon('backToHome').replace(
                locale === 'fr' ? "l'accueil" : 'home',
                locale === 'fr' ? 'les actualites' : 'news'
              )}
            </Link>
          </div>
        </SectionContainer>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-12 bg-light-bg">
          <SectionContainer>
            <h2 className="text-2xl font-bold text-primary mb-8">
              {tNews('relatedArticles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={{
                    pathname: '/actualites/[slug]',
                    params: { slug: rel.slug },
                  }}
                  className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border"
                >
                  <div
                    className={`aspect-video bg-gradient-to-br ${rel.color} flex items-center justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-white/50"
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
                  <div className="p-5">
                    {rel.date && (
                      <span className="text-xs text-muted">
                        {formatDate(rel.date, locale)}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg text-primary mt-1 group-hover:text-accent transition-colors">
                      {rel.title}
                    </h3>
                    <span className="inline-block mt-3 text-accent text-sm font-medium group-hover:underline">
                      {tCommon('readMore')} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}
    </div>
  );
}
