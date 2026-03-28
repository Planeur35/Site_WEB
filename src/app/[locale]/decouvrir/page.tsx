import type { Metadata } from 'next';
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from '@/lib/metadata';
import Hero from "@/components/ui/Hero";
import Button from "@/components/ui/Button";
import SectionContainer from "@/components/ui/SectionContainer";
import { client } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import { localize } from "@/lib/sanity/localize";
import PortableText from "@/components/sanity/PortableText";
import type { Page } from "@/lib/sanity/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "D\u00e9couvrir le vol \u00e0 voile \u2014 Planeurs d'Ille-et-Vilaine"
      : "Discover soaring \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Qu'est-ce que le vol \u00e0 voile ? D\u00e9couvrez le planeur, un sport a\u00e9rien silencieux et \u00e9cologique accessible \u00e0 tous."
      : 'What is soaring? Discover gliding, a silent and eco-friendly air sport accessible to everyone.',
    locale,
    pathname: '/decouvrir',
  });
}

export default async function DiscoverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let page: Page | null = null;
  try {
    page = await client.fetch<Page>(pageBySlugQuery, { slug: "decouvrir" });
  } catch {
    page = null;
  }

  return <DiscoverContent locale={locale} page={page} />;
}

function DiscoverContent({
  locale,
  page,
}: {
  locale: string;
  page: Page | null;
}) {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const pageBody = page?.body ? localize(page.body, locale) : null;

  const fallbackContent =
    locale === "fr"
      ? {
          intro:
            "Le vol a voile, ou planeur, est l'art de voler sans moteur en exploitant les courants aeriens ascendants. C'est une discipline qui combine sport, technique et contemplation de la nature.",
          howItWorks:
            "Comment ca marche ?",
          howItWorksText:
            "Un planeur est un aeronef depourvu de moteur. Il est tracte en altitude par un avion remorqueur ou lance par un treuil. Une fois en l'air, le pilote utilise les courants ascendants thermiques, dynamiques ou de pente pour rester en vol et parcourir parfois des centaines de kilometres.",
          whySoaring: "Pourquoi le vol a voile ?",
          whySoaringPoints: [
            "Un vol silencieux et ecologique, en harmonie avec la nature",
            "Des sensations uniques de liberte et de legerete",
            "Un sport accessible a partir de 14 ans",
            "Une communaute passionnee et accueillante",
            "La possibilite de parcourir de grandes distances sans moteur",
          ],
          videoTitle: "Le vol a voile en images",
          ctaText:
            "Envie de tenter l'experience ? Reservez votre vol decouverte et vivez vos premieres sensations de vol a voile.",
        }
      : {
          intro:
            "Soaring, or gliding, is the art of flying without an engine by harnessing rising air currents. It is a discipline that combines sport, skill, and a deep appreciation of nature.",
          howItWorks: "How does it work?",
          howItWorksText:
            "A glider is an aircraft with no engine. It is towed to altitude by a powered tug plane or launched by a winch. Once airborne, the pilot uses thermal, ridge, or wave lift to stay aloft and can sometimes travel hundreds of kilometers.",
          whySoaring: "Why soaring?",
          whySoaringPoints: [
            "Silent and eco-friendly flight, in harmony with nature",
            "Unique sensations of freedom and weightlessness",
            "A sport accessible from age 14",
            "A passionate and welcoming community",
            "The ability to travel great distances without an engine",
          ],
          videoTitle: "Soaring in pictures",
          ctaText:
            "Want to give it a try? Book your discovery flight and experience the thrill of soaring for yourself.",
        };

  return (
    <>
      <Hero title={tNav("whatIsSoaring")} />

      {/* Main Content */}
      <section className="py-16">
        <SectionContainer>
          {pageBody ? (
            <PortableText value={pageBody} className="prose prose-lg max-w-none" />
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Introduction */}
              <p className="text-xl text-muted leading-relaxed mb-12 text-center">
                {fallbackContent.intro}
              </p>

              {/* How it works */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {fallbackContent.howItWorks}
                </h2>
                <p className="text-muted leading-relaxed">
                  {fallbackContent.howItWorksText}
                </p>
              </div>

              {/* Why soaring */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {fallbackContent.whySoaring}
                </h2>
                <ul className="space-y-3">
                  {fallbackContent.whySoaringPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-accent flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            {fallbackContent.videoTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/UEkHTJIFbQo"
                title={fallbackContent.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-sm text-muted text-center mt-4">
              {locale === "fr"
                ? "Video d'introduction au vol a voile"
                : "Introduction to soaring video"}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* CTA */}
      <section className="py-16">
        <SectionContainer>
          <div className="bg-primary rounded-2xl p-10 md:p-14 text-center">
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {fallbackContent.ctaText}
            </p>
            <Button variant="primary" size="lg" href="/decouvrir/vols-decouverte">
              {tCommon("discoveryFlightCTA")}
            </Button>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
