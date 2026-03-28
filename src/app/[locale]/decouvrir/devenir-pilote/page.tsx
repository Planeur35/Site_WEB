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
      ? "Devenir pilote de planeur \u2014 Planeurs d'Ille-et-Vilaine"
      : "Become a glider pilot \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Formation au brevet de pilote de planeur (SPL). D\u00e9couvrez les \u00e9tapes, pr\u00e9-requis et tarifs pour apprendre \u00e0 voler."
      : 'Glider pilot licence training (SPL). Discover the stages, requirements, and costs to learn to fly.',
    locale,
    pathname: '/decouvrir/devenir-pilote',
  });
}

export default async function BecomeAPilotPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let page: Page | null = null;
  try {
    page = await client.fetch<Page>(pageBySlugQuery, { slug: "devenir-pilote" });
  } catch {
    page = null;
  }

  return <BecomeAPilotContent locale={locale} page={page} />;
}

function BecomeAPilotContent({
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
          introTitle: "Votre parcours vers le brevet de pilote planeur",
          introText:
            "Devenir pilote de planeur est un reve accessible a tous. Au sein de notre club, vous beneficiez d'un encadrement par des instructeurs experimentes et passionnes. La formation se fait a votre rythme, dans une ambiance conviviale et bienveillante.",
          trainingPathTitle: "Les etapes de la formation",
          trainingSteps: [
            {
              title: "Initiation et vols en double commande",
              description:
                "Vous debutez par des vols avec un instructeur pour decouvrir les bases du pilotage : decollage, vol en ligne droite, virages, approche et atterrissage. Cette phase compte environ 30 a 50 vols.",
              duration: "Quelques mois",
            },
            {
              title: "Vol solo supervise",
              description:
                "Quand votre instructeur estime que vous etes pret, vous effectuez vos premiers vols seul a bord. C'est un moment inoubliable ! Les instructeurs restent au sol en contact radio pour vous guider.",
              duration: "Variable",
            },
            {
              title: "Perfectionnement et navigation",
              description:
                "Vous approfondissez vos competences : vol en thermiques, navigation sur la campagne, gestion de l'espace aerien. Vous apprenez a planifier et realiser des circuits de plus en plus longs.",
              duration: "Plusieurs mois",
            },
            {
              title: "Preparation au brevet",
              description:
                "Revision des connaissances theoriques (meteorologie, aerodynamique, reglementation, navigation) et preparation a l'examen pratique avec un examinateur federal.",
              duration: "2 a 4 semaines",
            },
            {
              title: "Obtention du brevet de pilote de planeur (BPP / SPL)",
              description:
                "Apres la reussite de l'examen theorique et de l'epreuve pratique en vol, vous obtenez votre brevet. Vous pouvez desormais voler en toute autonomie et continuer a progresser.",
              duration: "Felicitations !",
            },
          ],
          requirementsTitle: "Conditions et pre-requis",
          requirements: [
            {
              label: "Age",
              value: "A partir de 14 ans pour commencer la formation, 16 ans pour le vol solo",
            },
            {
              label: "Condition physique",
              value: "Un certificat medical de classe LAPL est necessaire (medecin agree aviation civile)",
            },
            {
              label: "Duree de la formation",
              value: "En general 1 a 3 ans selon votre rythme et disponibilite. Des stages intensifs sont proposes en ete.",
            },
            {
              label: "Cout",
              value: "L'adhesion au club et la cotisation annuelle comprennent les heures de vol en formation. Comptez environ 1 500 a 2 500 EUR pour l'ensemble de la formation.",
            },
            {
              label: "Langues",
              value: "La formation se deroule en francais. Les examens theoriques sont en francais.",
            },
          ],
          ctaText:
            "Pret a commencer votre aventure ? Contactez-nous pour vous inscrire ou obtenir plus d'informations sur la formation.",
        }
      : {
          introTitle: "Your path to a glider pilot license",
          introText:
            "Becoming a glider pilot is an achievable dream for everyone. At our club, you'll be trained by experienced and passionate instructors. Training progresses at your own pace, in a friendly and supportive environment.",
          trainingPathTitle: "Training stages",
          trainingSteps: [
            {
              title: "Introduction and dual-control flights",
              description:
                "You begin with flights alongside an instructor to learn the basics of piloting: takeoff, straight flight, turns, approach, and landing. This phase typically consists of about 30 to 50 flights.",
              duration: "A few months",
            },
            {
              title: "Supervised solo flight",
              description:
                "When your instructor determines you are ready, you make your first flights alone. It's an unforgettable moment! Instructors remain on the ground in radio contact to guide you.",
              duration: "Variable",
            },
            {
              title: "Advanced skills and cross-country",
              description:
                "You deepen your skills: thermal flying, cross-country navigation, airspace management. You learn to plan and complete increasingly longer circuits.",
              duration: "Several months",
            },
            {
              title: "License preparation",
              description:
                "Review of theoretical knowledge (meteorology, aerodynamics, regulations, navigation) and preparation for the practical exam with a federal examiner.",
              duration: "2 to 4 weeks",
            },
            {
              title: "Obtaining the glider pilot license (SPL)",
              description:
                "After passing the theoretical exam and the practical flight test, you earn your license. You can now fly independently and continue to develop your skills.",
              duration: "Congratulations!",
            },
          ],
          requirementsTitle: "Requirements and prerequisites",
          requirements: [
            {
              label: "Age",
              value: "From 14 years old to start training, 16 for solo flight",
            },
            {
              label: "Physical fitness",
              value: "A LAPL class medical certificate is required (from an approved aviation medical examiner)",
            },
            {
              label: "Training duration",
              value: "Typically 1 to 3 years depending on your pace and availability. Intensive courses are offered in summer.",
            },
            {
              label: "Cost",
              value: "Club membership and annual fees include training flight hours. Expect approximately EUR 1,500 to 2,500 for the entire training.",
            },
            {
              label: "Language",
              value: "Training is conducted in French. Theoretical exams are in French.",
            },
          ],
          ctaText:
            "Ready to start your adventure? Contact us to sign up or get more information about training.",
        };

  return (
    <>
      <Hero title={tNav("becomeAPilot")} />

      {/* Introduction */}
      <section className="py-16">
        <SectionContainer>
          {pageBody ? (
            <PortableText value={pageBody} className="prose prose-lg max-w-none" />
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {content.introTitle}
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                {content.introText}
              </p>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* Training Path Timeline */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <h2 className="text-2xl font-bold text-primary mb-12 text-center">
            {content.trainingPathTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-10">
                {content.trainingSteps.map((step, i) => (
                  <div key={i} className="relative flex gap-6">
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {i + 1}
                    </div>
                    {/* Step content */}
                    <div className="bg-white rounded-xl border border-border p-6 shadow-sm flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h3 className="font-semibold text-primary text-lg">
                          {step.title}
                        </h3>
                        <span className="text-xs bg-blue-50 text-accent px-3 py-1 rounded-full font-medium">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-muted leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <SectionContainer>
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            {content.requirementsTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {content.requirements.map((req, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border p-5 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3"
                >
                  <span className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{req.label}</h3>
                    <p className="text-muted text-sm leading-relaxed">{req.value}</p>
                  </div>
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
