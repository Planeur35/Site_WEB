import type { Metadata } from 'next';
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from '@/lib/metadata';
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SectionContainer from "@/components/ui/SectionContainer";
import { Link } from "@/i18n/navigation";
import { client } from "@/lib/sanity/client";
import { allArticlesQuery, allGalleryImagesQuery } from "@/lib/sanity/queries";
import { localize } from "@/lib/sanity/localize";
import { urlFor } from "@/lib/sanity/image";
import type { Article, GalleryImage } from "@/lib/sanity/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Planeurs d'Ille-et-Vilaine \u2014 Club de vol \u00e0 voile en Bretagne"
      : "Planeurs d'Ille-et-Vilaine \u2014 Soaring club in Brittany",
    description: locale === 'fr'
      ? "Club de vol \u00e0 voile en Bretagne. Vols d\u00e9couverte, formation au brevet de pilote planeur, a\u00e9rodrome de Saint-Sulpice-des-Landes."
      : 'Soaring club in Brittany, France. Discovery flights, glider pilot training, Saint-Sulpice-des-Landes aerodrome.',
    locale,
    pathname: '',
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let articles: Article[] = [];
  let galleryImages: GalleryImage[] = [];

  try {
    articles = await client.fetch<Article[]>(allArticlesQuery);
  } catch {
    articles = [];
  }

  try {
    galleryImages = await client.fetch<GalleryImage[]>(allGalleryImagesQuery);
  } catch {
    galleryImages = [];
  }

  return <HomeContent locale={locale} articles={articles} galleryImages={galleryImages} />;
}

function HomeContent({
  locale,
  articles,
  galleryImages,
}: {
  locale: string;
  articles: Article[];
  galleryImages: GalleryImage[];
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  const recentArticles = articles.slice(0, 3);
  const previewImages = galleryImages.slice(0, 6);

  const highlights = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      title: t("discoverCardTitle"),
      text: t("discoverCardText"),
      href: "/decouvrir/vols-decouverte" as const,
      color: "bg-blue-50",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      title: t("trainingCardTitle"),
      text: t("trainingCardText"),
      href: "/decouvrir/devenir-pilote" as const,
      color: "bg-sky-50",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
      title: t("fleetCardTitle"),
      text: t("fleetCardText"),
      href: "/le-club/flotte" as const,
      color: "bg-indigo-50",
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Planeurs d'Ille-et-Vilaine",
    url: 'https://www.planeur35.org',
    description: 'Club de vol \u00e0 voile en Bretagne',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saint-Sulpice-des-Landes',
      addressRegion: 'Bretagne',
      addressCountry: 'FR',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <Hero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaText={tCommon("discoveryFlightCTA")}
        ctaHref="/contact"
      />

      {/* Highlight Cards */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:-translate-y-1"
              >
                <div className={`${item.color} flex items-center justify-center py-10`}>
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-xl text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted">{item.text}</p>
                  <span className="inline-block mt-4 text-accent font-medium text-sm group-hover:underline">
                    {tCommon("learnMore")} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Gallery Preview */}
      <section className="py-16">
        <SectionContainer>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">{t("photoGallery")}</h2>
            <Button variant="ghost" href="/galerie">
              {tCommon("seeAll")} &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewImages.length > 0
              ? previewImages.map((img) => (
                  <div
                    key={img._id}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={urlFor(img.image).width(600).height(400).auto("format").url()}
                      alt={localize(img.caption, locale) || ""}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                      />
                    </svg>
                  </div>
                ))}
          </div>
        </SectionContainer>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">{t("latestNews")}</h2>
            <Button variant="ghost" href="/actualites">
              {tCommon("seeAll")} &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.length > 0
              ? recentArticles.map((article) => {
                  const title = localize(article.title, locale) || "Article";
                  const excerpt = localize(article.excerpt, locale) || "";
                  const imageUrl = article.featuredImage
                    ? urlFor(article.featuredImage).width(600).height(400).auto("format").url()
                    : undefined;

                  return (
                    <Card
                      key={article._id}
                      image={imageUrl}
                      imageAlt={title}
                      title={title}
                      description={excerpt}
                    >
                      <p className="mt-3 text-accent text-sm font-medium">
                        {tCommon("readMore")} &rarr;
                      </p>
                    </Card>
                  );
                })
              : Array.from({ length: 3 }).map((_, i) => {
                  const placeholderTitles =
                    locale === "fr"
                      ? [
                          "Ouverture de la saison 2026",
                          "Stage d'initiation au vol a voile",
                          "Resultats du championnat regional",
                        ]
                      : [
                          "2026 Season opening",
                          "Introductory soaring course",
                          "Regional championship results",
                        ];
                  const placeholderDescriptions =
                    locale === "fr"
                      ? [
                          "La saison de vol a voile reprend avec de belles conditions meteorologiques prevues pour ce printemps.",
                          "Venez decouvrir le vol a voile lors de notre prochain stage d'initiation ouvert a tous.",
                          "Retour sur les performances de nos pilotes lors du dernier championnat regional de vol a voile.",
                        ]
                      : [
                          "The soaring season kicks off with great weather conditions expected this spring.",
                          "Discover soaring at our next introductory course, open to everyone.",
                          "A look back at our pilots' performances at the latest regional soaring championship.",
                        ];

                  return (
                    <Card
                      key={i}
                      title={placeholderTitles[i]}
                      description={placeholderDescriptions[i]}
                    >
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted">
                          {locale === "fr" ? "Mars 2026" : "March 2026"}
                        </span>
                        <span className="text-accent text-sm font-medium">
                          {tCommon("readMore")} &rarr;
                        </span>
                      </div>
                    </Card>
                  );
                })}
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
