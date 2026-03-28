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
      ? "Devenir pilote de planeur \u2014 Planeurs d\u2019Ille-et-Vilaine"
      : "Become a glider pilot \u2014 Planeurs d\u2019Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Apprenez \u00e0 piloter un planeur avec les PIV. Pack formation tout compris \u00e0 2\u2009100\u20ac, formation d\u00e8s 13 ans, vol solo d\u00e8s 14 ans. A\u00e9rodrome de Saint-Sulpice-des-Landes."
      : "Learn to fly a glider with PIV. All-inclusive training package at \u20ac2,100, training from age 13, solo flight from age 14. Saint-Sulpice-des-Landes aerodrome.",
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
  const tContact = useTranslations("contact");

  const pageBody = page?.body ? localize(page.body, locale) : null;

  const content =
    locale === "fr"
      ? {
          heroSubtitle: "Formule \u00ab J\u2019apprends \u00e0 piloter un planeur \u00bb",
          introTitle: "Devenez pilote !",
          introText:
            "C\u2019est d\u00e9cid\u00e9, vous souhaitez apprendre \u00e0 voler et piloter seul un planeur ! Les Planeurs d\u2019Ille-et-Vilaine sont l\u00e0 pour vous ! Le vol en planeur constitue un sport a\u00e9rien plus accessible qu\u2019imagin\u00e9, tant financi\u00e8rement que physiquement.",
          packTitle: "Pack Formation",
          packSubtitle: "Formule forfaitaire tout compris",
          packPrice: "2\u2009100",
          packYouthNote: "Moins de 25 ans : jusqu\u2019\u00e0 500\u20ac de bourses FFVP sur objectifs atteints dans l\u2019ann\u00e9e (l\u00e2ch\u00e9 solo, pass planeur, SPL)",
          packItems: [
            "Inscription au club",
            "Licence-assurance (option de base, extensible)",
            "Carnet de vol",
            "Cours pratiques en vol et th\u00e9oriques en salle",
            "Heures de vol de formation et en solo illimit\u00e9es",
            "70 d\u00e9collages au treuil et 5 d\u00e9collages au remorqueur (500m)",
          ],
          packValidity: "Validit\u00e9 : du jour de la souscription jusqu\u2019au 31 d\u00e9cembre de la saison (la saison \u00ab\u00a0n\u00a0\u00bb d\u00e9bute le 1er octobre de l\u2019ann\u00e9e \u00ab\u00a0n-1\u00a0\u00bb et se termine le 31 d\u00e9cembre \u00ab\u00a0n\u00a0\u00bb).",
          packNote: "Les inscriptions commencent le 1er octobre. La forte demande recommande de contacter rapidement le club.",
          packDisclaimer: "Le pack formation est un engagement de moyens de la part de l\u2019association. Le r\u00e9sultat \u2014 voler seul en planeur \u2014 comme toute formation, d\u00e9pend de votre motivation et de votre assiduit\u00e9.",
          trainingTitle: "La formation",
          trainingItems: [
            { label: "Formation pratique", value: "Vols en double commande avec instructeur dipl\u00f4m\u00e9 par le Minist\u00e8re des Transports et reconnu par le Minist\u00e8re des Sports" },
            { label: "Formation th\u00e9orique", value: "Cours en salle et simulateur de vol" },
            { label: "P\u00e9riode", value: "R\u00e9alisable toute l\u2019ann\u00e9e, m\u00e9t\u00e9o plus propice au printemps et en \u00e9t\u00e9" },
            { label: "Dur\u00e9e moyenne", value: "30 \u00e0 40 demi-journ\u00e9es de pr\u00e9sence avant de voler seul" },
          ],
          trainingTip: "Il n\u2019est pas n\u00e9cessaire d\u2019avoir de fortes connaissances techniques : des coll\u00e9giens volent seuls en planeur. Le bon sens, l\u2019attention et la motivation sont plus importants.",
          whoTitle: "Qui peut devenir pilote planeur ?",
          whoItems: [
            { label: "\u00c2ge", value: "Formation d\u00e8s 13 ans, sans limite d\u2019\u00e2ge sup\u00e9rieure" },
            { label: "Visite m\u00e9dicale", value: "Certificat m\u00e9dical a\u00e9ronautique classe 2 ou LAPL n\u00e9cessaire avant le premier vol seul. Recommand\u00e9 avant la souscription au pack formation." },
            { label: "Taille", value: "Entre 155 cm et 200 cm (essai d\u2019installation recommand\u00e9 pour les grandes tailles)" },
            { label: "Poids", value: "Entre 40 kg et 100 kg (entre 40-50 kg, coussin lest de 10 kg requis)" },
          ],
          whoNote: "Les crit\u00e8res pour obtenir le certificat m\u00e9dical a\u00e9ronautique sont beaucoup plus souples que pour les pilotes professionnels. La plupart des personnes \u00ab\u00a0en bonne forme physique et mentale\u00a0\u00bb sont aptes.",
          soloTitle: "Voler seul \u00e0 bord",
          soloSubtitle: "C\u2019est possible d\u00e8s 14 ans !",
          soloText: "Apr\u00e8s un apprentissage en double commande d\u2019environ 50 vols, votre instructeur \u00e9value votre ma\u00eetrise de toutes les phases du vol. Le \u00ab\u00a0l\u00e2ch\u00e9 solo\u00a0\u00bb \u2014 votre premier vol solitaire \u2014 est un \u00e9v\u00e9nement marquant dans la vie d\u2019un pilote !",
          certificationsTitle: "Certifications progressives",
          certifications: [
            { title: "Pass Planeur", description: "Apr\u00e8s le l\u00e2ch\u00e9 solo et l\u2019obtention du BIA ou du th\u00e9orique planeur, vous pouvez voler sans supervision d\u2019instructeur." },
            { title: "SPL \u2014 Licence Europ\u00e9enne de Pilote de Planeur", description: "Remplace le Brevet de Pilote de Planeur. C\u2019est votre \u00ab\u00a0permis de conduire\u00a0\u00bb europ\u00e9en pour les planeurs." },
          ],
          afterTitle: "Apr\u00e8s la formation",
          afterText: "Une fois devenu pilote planeur, vous pourrez pratiquer au sein des Planeurs d\u2019Ille-et-Vilaine en utilisant le parc machine du club pour voler \u00e0 votre rythme, en loisir ou performance. Le vol en planeur est un sport merveilleux qui vous proposera de nombreuses activit\u00e9s passionnantes tout au long de votre carri\u00e8re.",
          handicapTitle: "Handicap \u2014 Handiplaneur",
          handicapText: "Planeur biplace sp\u00e9cial \u00e9quip\u00e9 d\u2019une commande manuelle substituant le palonnier, permettant aux personnes \u00e0 mobilit\u00e9 r\u00e9duite d\u2019apprendre et de voler seul \u00e0 bord.",
          ctaText: "Pr\u00eat \u00e0 commencer votre aventure ? Contactez-nous pour vous inscrire ou obtenir plus d\u2019informations.",
        }
      : {
          heroSubtitle: "\u201cLearn to fly a glider\u201d programme",
          introTitle: "Become a pilot!",
          introText:
            "You\u2019ve decided \u2014 you want to learn to fly and pilot a glider on your own! Planeurs d\u2019Ille-et-Vilaine is here for you! Gliding is a more accessible air sport than you might think, both financially and physically.",
          packTitle: "Training Package",
          packSubtitle: "All-inclusive flat-rate formula",
          packPrice: "2,100",
          packYouthNote: "Under 25: up to \u20ac500 in FFVP grants for objectives achieved during the year (solo release, glider pass, SPL)",
          packItems: [
            "Club membership",
            "Licence-insurance (basic option, extensible)",
            "Logbook",
            "Practical flight and classroom theoretical courses",
            "Unlimited training and solo flight hours",
            "70 winch launches and 5 aerotow launches (500m)",
          ],
          packValidity: "Validity: from the day of subscription until 31 December of the season (season \u201cn\u201d starts 1 October of year \u201cn-1\u201d and ends 31 December \u201cn\u201d).",
          packNote: "Enrolment begins 1 October. High demand means we recommend contacting the club promptly.",
          packDisclaimer: "The training package is a commitment of means by the association. The result \u2014 flying solo \u2014 as with any training, depends on your motivation and dedication.",
          trainingTitle: "The training",
          trainingItems: [
            { label: "Practical training", value: "Dual-control flights with instructors certified by the Ministry of Transport and recognised by the Ministry of Sports" },
            { label: "Theoretical training", value: "Classroom courses and flight simulator" },
            { label: "Period", value: "Available year-round, weather more favourable in spring and summer" },
            { label: "Average duration", value: "30 to 40 half-days on the airfield before flying solo" },
          ],
          trainingTip: "You don\u2019t need strong technical knowledge: secondary school students fly gliders solo. Common sense, attentiveness, and motivation matter more.",
          whoTitle: "Who can become a glider pilot?",
          whoItems: [
            { label: "Age", value: "Training from age 13, no upper age limit" },
            { label: "Medical", value: "Class 2 or LAPL aviation medical certificate required before first solo flight. Recommended before subscribing to the training package." },
            { label: "Height", value: "Between 155 cm and 200 cm (fitting test recommended for taller individuals)" },
            { label: "Weight", value: "Between 40 kg and 100 kg (40\u201350 kg: 10 kg ballast cushion required)" },
          ],
          whoNote: "The criteria for obtaining the aviation medical certificate are much more flexible than for professional pilots. Most people \u201cin good physical and mental health\u201d are eligible.",
          soloTitle: "Flying solo",
          soloSubtitle: "Possible from age 14!",
          soloText: "After approximately 50 dual-control flights, your instructor assesses your mastery of all flight phases. The \u201csolo release\u201d \u2014 your first flight alone \u2014 is a landmark moment in every pilot\u2019s life!",
          certificationsTitle: "Progressive certifications",
          certifications: [
            { title: "Glider Pass", description: "After solo release and obtaining the BIA or glider theory, you can fly without instructor supervision." },
            { title: "SPL \u2014 European Sailplane Pilot Licence", description: "Replaces the former Glider Pilot Certificate. It\u2019s your European \u201cdriving licence\u201d for gliders." },
          ],
          afterTitle: "After training",
          afterText: "Once you become a glider pilot, you can fly at Planeurs d\u2019Ille-et-Vilaine using the club\u2019s fleet at your own pace, whether for leisure or performance flying. Gliding is a wonderful sport that offers many exciting activities throughout your flying career.",
          handicapTitle: "Accessibility \u2014 Handiglider",
          handicapText: "A specially equipped two-seat glider with a manual control replacing the rudder pedals, enabling people with reduced mobility to learn and fly solo.",
          ctaText: "Ready to start your adventure? Contact us to sign up or get more information.",
        };

  return (
    <>
      <Hero
        title={tNav("becomeAPilot")}
        subtitle={content.heroSubtitle}
        ctaText={tContact("contactUs")}
        ctaHref="/contact"
      />

      {/* Main Content */}
      <section className="py-16">
        <SectionContainer>
          {pageBody ? (
            <PortableText value={pageBody} className="prose prose-lg max-w-none" />
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-primary mb-6">
                {content.introTitle}
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                {content.introText}
              </p>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* Pack Formation */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-primary mb-2">{content.packTitle}</h2>
              <p className="text-muted">{content.packSubtitle}</p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-8 md:p-10 mb-8">
              {/* Price */}
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-accent">{content.packPrice}</span>
                <span className="text-2xl text-accent">&euro;</span>
                <p className="text-sm text-muted mt-2 max-w-md mx-auto bg-accent/5 rounded-lg p-3 border border-accent/20">
                  {content.packYouthNote}
                </p>
              </div>

              {/* What's included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {content.packItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-dark-text text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Validity and notes */}
              <div className="space-y-3 text-sm text-muted border-t border-border pt-6">
                <p>{content.packValidity}</p>
                <p className="font-medium">{content.packNote}</p>
                <p className="italic">{content.packDisclaimer}</p>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Training details */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.trainingTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {content.trainingItems.map((item, i) => (
                <div key={i} className="bg-light-bg rounded-xl p-5 border border-border">
                  <h3 className="font-semibold text-primary text-sm mb-1">{item.label}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 text-center">
              <p className="text-muted text-sm leading-relaxed">{content.trainingTip}</p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Who can become a pilot */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.whoTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {content.whoItems.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-border">
                  <h3 className="font-semibold text-primary text-sm mb-1">{item.label}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted text-center max-w-2xl mx-auto">{content.whoNote}</p>
          </div>
        </SectionContainer>
      </section>

      {/* Solo flight */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">{content.soloTitle}</h2>
            <p className="text-accent font-medium text-lg mb-6">{content.soloSubtitle}</p>
            <p className="text-muted leading-relaxed">{content.soloText}</p>
          </div>
        </SectionContainer>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.certificationsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.certifications.map((cert, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-primary text-lg mb-3">{cert.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* After training + Handicap */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">{content.afterTitle}</h2>
              <p className="text-muted leading-relaxed">{content.afterText}</p>
            </div>
            <div className="bg-light-bg rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold text-primary mb-4">{content.handicapTitle}</h2>
              <p className="text-muted leading-relaxed mb-4">{content.handicapText}</p>
              <Button variant="secondary" size="sm" href="/contact">
                {tContact("contactUs")}
              </Button>
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
            <Button variant="primary" size="lg" href="/contact" className="bg-white text-primary hover:bg-white/90">
              {tContact("contactUs")}
            </Button>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
