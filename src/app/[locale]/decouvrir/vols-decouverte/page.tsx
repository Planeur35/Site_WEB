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
      ? "Vols d\u00e9couverte en planeur \u2014 Planeurs d'Ille-et-Vilaine"
      : "Discovery flights \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "R\u00e9servez votre vol d\u00e9couverte en planeur. Vivez l'exp\u00e9rience du vol silencieux au-dessus de la Bretagne avec un instructeur qualifi\u00e9."
      : 'Book your glider discovery flight. Experience silent flight over Brittany with a qualified instructor.',
    locale,
    pathname: '/decouvrir/vols-decouverte',
  });
}

export default async function DiscoveryFlightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let page: Page | null = null;
  try {
    page = await client.fetch<Page>(pageBySlugQuery, { slug: "vols-decouverte" });
  } catch {
    page = null;
  }

  return <DiscoveryFlightsContent locale={locale} page={page} />;
}

function DiscoveryFlightsContent({
  locale,
  page,
}: {
  locale: string;
  page: Page | null;
}) {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const pageBody = page?.body ? localize(page.body, locale) : null;

  const content =
    locale === "fr"
      ? {
          whatToExpectTitle: "A quoi s'attendre ?",
          whatToExpectText:
            "Le vol decouverte est une experience inoubliable qui vous permet de vivre les sensations du vol a voile en toute securite. Vous partagerez le cockpit avec un pilote instructeur qualifie qui vous fera decouvrir le plaisir du vol silencieux au-dessus des paysages bretons.",
          steps: [
            {
              title: "Accueil et briefing",
              text: "A votre arrivee sur l'aerodrome, un instructeur vous accueille et vous explique le deroulement du vol : fonctionnement du planeur, securite, et reponses a toutes vos questions.",
            },
            {
              title: "Decollage",
              text: "Le planeur est tracte par un avion remorqueur jusqu'a une altitude d'environ 500 a 800 metres. Le cable est ensuite largue et le vol libre commence.",
            },
            {
              title: "Vol en planeur",
              text: "Profitez du silence et des vues panoramiques. Si vous le souhaitez, l'instructeur peut vous laisser prendre les commandes pour sentir les sensations du pilotage.",
            },
            {
              title: "Atterrissage",
              text: "Retour en douceur sur la piste de l'aerodrome. Le vol complet dure entre 20 et 40 minutes selon les conditions meteorologiques.",
            },
          ],
          durationTitle: "Duree et tarifs",
          durationItems: [
            { label: "Vol decouverte classique", detail: "~20 min", price: "85 EUR" },
            { label: "Vol decouverte prolonge", detail: "~30-40 min", price: "120 EUR" },
          ],
          durationNote:
            "Les durees sont indicatives et dependent des conditions meteorologiques. Le vol est possible d'avril a octobre, les week-ends et jours feries. Reservez a l'avance pour garantir votre place.",
          practicalTitle: "Informations pratiques",
          practicalItems: [
            { label: "Age minimum", value: "Aucun (les mineurs doivent etre accompagnes d'un parent)" },
            { label: "Poids maximum", value: "110 kg" },
            { label: "Tenue vestimentaire", value: "Vetements confortables, chaussures fermees, lunettes de soleil recommandees" },
            { label: "Ce qu'il faut apporter", value: "Casquette, bouteille d'eau, appareil photo" },
          ],
          ctaText: "Pret a vivre l'experience ? Contactez-nous pour reserver votre vol decouverte.",
        }
      : {
          whatToExpectTitle: "What to expect?",
          whatToExpectText:
            "A discovery flight is an unforgettable experience that lets you feel the thrill of soaring in complete safety. You'll share the cockpit with a qualified flight instructor who will introduce you to the joy of silent flight over the Breton countryside.",
          steps: [
            {
              title: "Welcome and briefing",
              text: "When you arrive at the aerodrome, an instructor greets you and explains how the flight will proceed: how the glider works, safety procedures, and answers to all your questions.",
            },
            {
              title: "Takeoff",
              text: "The glider is towed by a powered tug plane to an altitude of about 500 to 800 meters. The tow rope is then released and free flight begins.",
            },
            {
              title: "Soaring flight",
              text: "Enjoy the silence and panoramic views. If you wish, the instructor can let you take the controls and feel what it's like to fly.",
            },
            {
              title: "Landing",
              text: "A smooth return to the aerodrome runway. The total flight lasts between 20 and 40 minutes depending on weather conditions.",
            },
          ],
          durationTitle: "Duration and pricing",
          durationItems: [
            { label: "Standard discovery flight", detail: "~20 min", price: "EUR 85" },
            { label: "Extended discovery flight", detail: "~30-40 min", price: "EUR 120" },
          ],
          durationNote:
            "Durations are approximate and depend on weather conditions. Flights are available from April to October, on weekends and public holidays. Book in advance to secure your spot.",
          practicalTitle: "Practical information",
          practicalItems: [
            { label: "Minimum age", value: "None (minors must be accompanied by a parent)" },
            { label: "Maximum weight", value: "110 kg" },
            { label: "Dress code", value: "Comfortable clothing, closed-toe shoes, sunglasses recommended" },
            { label: "What to bring", value: "Cap, water bottle, camera" },
          ],
          ctaText: "Ready for the experience? Contact us to book your discovery flight.",
        };

  return (
    <>
      <Hero title={tNav("discoveryFlights")} />

      {/* Main Content */}
      <section className="py-16">
        <SectionContainer>
          {pageBody ? (
            <PortableText value={pageBody} className="prose prose-lg max-w-none" />
          ) : (
            <>
              {/* What to Expect */}
              <div className="max-w-3xl mx-auto mb-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {content.whatToExpectTitle}
                </h2>
                <p className="text-muted leading-relaxed text-lg">
                  {content.whatToExpectText}
                </p>
              </div>

              {/* Flight Steps */}
              <div className="max-w-4xl mx-auto mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {content.steps.map((step, i) => (
                    <div
                      key={i}
                      className="relative bg-white rounded-xl border border-border p-6 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-primary text-lg mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SectionContainer>
      </section>

      {/* Duration and Pricing */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.durationTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {content.durationItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border p-6 shadow-sm text-center"
                >
                  <h3 className="font-semibold text-primary text-lg mb-2">
                    {item.label}
                  </h3>
                  <p className="text-muted mb-3">{item.detail}</p>
                  <p className="text-3xl font-bold text-accent">{item.price}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted text-center max-w-2xl mx-auto">
              {content.durationNote}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Practical Information */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.practicalTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.practicalItems.map((item, i) => (
                <div key={i} className="bg-light-bg rounded-xl p-5">
                  <h3 className="font-semibold text-primary mb-1">{item.label}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* CTA */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="bg-primary rounded-2xl p-10 md:p-14 text-center">
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {content.ctaText}
            </p>
            <Button variant="primary" size="lg" href="/contact">
              {tCommon("sendMessage")}
            </Button>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
