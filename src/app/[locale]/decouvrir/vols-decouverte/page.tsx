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
      ? "Vol d\u2019initiation en planeur \u2014 Planeurs d\u2019Ille-et-Vilaine"
      : "Discovery flights \u2014 Planeurs d\u2019Ille-et-Vilaine",
    description: locale === 'fr'
      ? "D\u00e9couvrez les sensations du vol silencieux en planeur biplace. Vol d\u2019initiation d\u2019environ 20 minutes avec pilote confirm\u00e9, sur l\u2019a\u00e9rodrome de Saint-Sulpice-des-Landes."
      : "Discover the thrill of silent flight in a two-seat glider. Introductory flight of about 20 minutes with a qualified pilot at Saint-Sulpice-des-Landes aerodrome.",
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
  const tContact = useTranslations("contact");

  const pageBody = page?.body ? localize(page.body, locale) : null;

  const content =
    locale === "fr"
      ? {
          heroSubtitle: "Formule \u00ab Je d\u00e9couvre le vol en planeur \u00bb",
          introTitle: "Envie d\u2019essayer ?",
          introText:
            "Vous souhaitez d\u00e9couvrir les sensations du vol silencieux ? Vous recherchez un cadeau original pouvant d\u00e9clencher une passion ? Les Planeurs d\u2019Ille-et-Vilaine proposent une formule vol d\u2019initiation tout inclus.",
          flightTitle: "Le vol d\u2019initiation",
          flightSubtitle: "Votre premier vol en planeur accompagn\u00e9 par un pilote !",
          flightText:
            "Forfait tout compris : cotisation, licence-assurance et 1 vol en planeur biplace accompagn\u00e9. Dur\u00e9e du vol : 15 \u00e0 25 minutes.",
          flightPeriod: "P\u00e9riode de r\u00e9alisation : habituellement du 1er mars au 31 octobre.",
          pricingItems: [
            { label: "Vol d\u2019initiation", price: "170", unit: "\u20ac", note: "Tout public" },
            { label: "Sp\u00e9cial -18 ans", price: "130", unit: "\u20ac", note: "Scolaris\u00e9s en Ille-et-Vilaine" },
          ],
          formulaTitle: "La formule comprend",
          formulaItems: [
            "Cotisation et licence-assurance FFVP",
            "1 vol en planeur biplace accompagn\u00e9 d\u2019un pilote confirm\u00e9",
            "Dur\u00e9e du vol : 15 \u00e0 25 minutes",
            "Achat imm\u00e9diat et r\u00e9servation en ligne",
            "\u00ab Bon cadeau \u00bb valable 2 ans",
          ],
          packTitle: "Pack Formation",
          packItems: [
            "Valable du 1er octobre 2025 au 31 d\u00e9cembre 2026",
            "Moins de 25 ans : jusqu\u2019\u00e0 500\u20ac d\u2019aides f\u00e9d\u00e9rales octroy\u00e9es sur objectifs (sous r\u00e9serve de maintien de l\u2019aide FFVP)",
            "Paiement en plusieurs fois possible",
            "Suite \u00e0 un Vol d\u2019Initiation achet\u00e9, 50\u20ac rembours\u00e9s sur demande en cas de souscription d\u2019un Pack Formation dans l\u2019ann\u00e9e !",
          ],
          handicapTitle: "Handicap",
          handicapItems: [
            "\u00c9quipements adapt\u00e9s pour public \u00e0 mobilit\u00e9 r\u00e9duite",
            "Nous contacter pour plus d\u2019informations",
          ],
          conditionsTitle: "Conditions d\u2019acc\u00e8s",
          conditions: [
            { label: "\u00c2ge minimum", value: "12 ans (mineurs : autorisation parentale requise)" },
            { label: "\u00c2ge maximum", value: "Aucune limite" },
            { label: "Visite m\u00e9dicale", value: "Non requise" },
            { label: "Poids", value: "Entre 45 et 100 kg" },
            { label: "Taille", value: "Entre 155 et 200 cm" },
            { label: "Femmes enceintes", value: "Vols non autoris\u00e9s" },
            { label: "Handicaps physiques", value: "Contactez l\u2019association" },
          ],
          dressTitle: "Tenue requise",
          dressItems: [
            "V\u00eatements d\u00e9contract\u00e9s et chaussures ferm\u00e9es",
            "Lunettes de soleil recommand\u00e9es",
            "Casquette ou bob",
            "Appareil photo optionnel",
          ],
          dressForbidden: "Interdits : robes, jupes, kilts, tongs et chaussures \u00e0 talon.",
          voucherTitle: "Validit\u00e9 du bon",
          voucherItems: [
            "Valable 24 mois \u00e0 compter du paiement",
            "Nominatif et non cessible",
            "Ne pourra pas \u00eatre rembours\u00e9, ni prolong\u00e9",
            "Envoi imm\u00e9diat par email apr\u00e8s paiement en ligne",
          ],
          meteoTitle: "Conditions m\u00e9t\u00e9o",
          meteoText:
            "En cas de mauvais temps, annulation possible avec proposition d\u2019une autre date. Le bon reste valide m\u00eame apr\u00e8s expiration en cas d\u2019annulation par l\u2019association.",
          groupTitle: "\u00c9v\u00e9nements de groupe",
          groupText:
            "L\u2019association accueille les groupes professionnels et associations. Contactez-nous pour organiser votre \u00e9v\u00e9nement.",
          ctaText: "Pr\u00eat \u00e0 d\u00e9couvrir le vol en planeur ? Contactez-nous ou r\u00e9servez directement en ligne.",
          locationInfo: "Sur l\u2019a\u00e9rodrome de Saint-Sulpice-des-Landes (35), vols en semaine et week-end.",
          groupNote: "Formule groupe possible \u2013 Nous contacter",
        }
      : {
          heroSubtitle: "\u201cDiscover glider flying\u201d experience",
          introTitle: "Want to try?",
          introText:
            "Would you like to discover the thrill of silent flight? Looking for an original gift that could spark a lifelong passion? Planeurs d\u2019Ille-et-Vilaine offers an all-inclusive introductory flight package.",
          flightTitle: "The introductory flight",
          flightSubtitle: "Your first glider flight accompanied by a pilot!",
          flightText:
            "All-inclusive package: membership, licence-insurance and 1 accompanied flight in a two-seat glider. Flight duration: 15 to 25 minutes.",
          flightPeriod: "Flying season: usually from 1 March to 31 October.",
          pricingItems: [
            { label: "Introductory flight", price: "170", unit: "\u20ac", note: "General public" },
            { label: "Special under-18", price: "130", unit: "\u20ac", note: "Students in Ille-et-Vilaine" },
          ],
          formulaTitle: "The package includes",
          formulaItems: [
            "Membership and FFVP licence-insurance",
            "1 accompanied flight in a two-seat glider",
            "Flight duration: 15 to 25 minutes",
            "Immediate purchase and online booking",
            "Gift voucher valid for 2 years",
          ],
          packTitle: "Training Package",
          packItems: [
            "Valid from 1 October 2025 to 31 December 2026",
            "Under 25: up to \u20ac500 in federal grants awarded on objectives (subject to FFVP aid continuation)",
            "Payment in several instalments possible",
            "Following an Introductory Flight purchase, \u20ac50 refunded on request when subscribing to a Training Package within the year!",
          ],
          handicapTitle: "Accessibility",
          handicapItems: [
            "Equipment adapted for people with reduced mobility",
            "Contact us for more information",
          ],
          conditionsTitle: "Access conditions",
          conditions: [
            { label: "Minimum age", value: "12 years old (minors: parental authorisation required)" },
            { label: "Maximum age", value: "No limit" },
            { label: "Medical check", value: "Not required" },
            { label: "Weight", value: "Between 45 and 100 kg" },
            { label: "Height", value: "Between 155 and 200 cm" },
            { label: "Pregnant women", value: "Flights not permitted" },
            { label: "Physical disabilities", value: "Please contact the association" },
          ],
          dressTitle: "Dress code",
          dressItems: [
            "Casual clothing and closed-toe shoes",
            "Sunglasses recommended",
            "Cap or sun hat",
            "Camera optional",
          ],
          dressForbidden: "Not allowed: dresses, skirts, kilts, flip-flops and high heels.",
          voucherTitle: "Voucher validity",
          voucherItems: [
            "Valid for 24 months from date of payment",
            "Personal and non-transferable",
            "Cannot be refunded or extended",
            "Sent immediately by email after online payment",
          ],
          meteoTitle: "Weather conditions",
          meteoText:
            "In case of bad weather, the flight can be rescheduled to another date. The voucher remains valid even after expiry if the flight was cancelled by the association.",
          groupTitle: "Group events",
          groupText:
            "The association welcomes professional groups and organisations. Contact us to organise your event.",
          ctaText: "Ready to discover glider flying? Contact us or book directly online.",
          groupNote: "Group packages available \u2013 Contact us",
          locationInfo: "At Saint-Sulpice-des-Landes aerodrome (35), flights available weekdays and weekends.",
        };

  return (
    <>
      <Hero
        title={tNav("discoveryFlights")}
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
            <>
              {/* Introduction */}
              <div className="max-w-3xl mx-auto mb-16 text-center">
                <h2 className="text-3xl font-bold text-primary mb-6">
                  {content.introTitle}
                </h2>
                <p className="text-lg text-muted leading-relaxed">
                  {content.introText}
                </p>
              </div>

              {/* Flight Description + Pricing */}
              <div className="max-w-4xl mx-auto mb-16">
                <div className="bg-light-bg rounded-2xl p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    {content.flightTitle}
                  </h2>
                  <p className="text-accent font-medium mb-4">
                    {content.flightSubtitle}
                  </p>
                  <p className="text-muted leading-relaxed mb-6">
                    {content.flightText}
                  </p>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {content.pricingItems.map((item, i) => (
                      <div key={i} className="bg-white rounded-xl border border-border p-6 text-center">
                        <p className="font-semibold text-primary mb-1">{item.label}</p>
                        <p className="text-4xl font-bold text-accent mb-1">
                          {item.price}<span className="text-lg">{item.unit}</span>
                        </p>
                        <p className="text-sm text-muted">{item.note}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm font-medium text-accent">
                    {content.flightPeriod}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {content.locationInfo}
                  </p>
                  <p className="text-sm text-muted mt-1 font-medium">
                    {content.groupNote}
                  </p>
                </div>
              </div>

              {/* Formula Includes */}
              <div className="max-w-4xl mx-auto mb-16">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  {content.formulaTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.formulaItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white rounded-xl border border-border p-5"
                    >
                      <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-dark-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SectionContainer>
      </section>

      {/* Access Conditions */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              {content.conditionsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.conditions.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-border">
                  <h3 className="font-semibold text-primary text-sm mb-1">{item.label}</h3>
                  <p className="text-muted text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Dress Code & Voucher */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Dress Code */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                {content.dressTitle}
              </h2>
              <ul className="space-y-3 mb-4">
                {content.dressItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-red-600 font-medium bg-red-50 rounded-lg p-3">
                {content.dressForbidden}
              </p>
            </div>

            {/* Voucher Validity */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                {content.voucherTitle}
              </h2>
              <ul className="space-y-3">
                {content.voucherItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Weather & Groups */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                {content.meteoTitle}
              </h2>
              <p className="text-muted leading-relaxed">{content.meteoText}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                {content.groupTitle}
              </h2>
              <p className="text-muted leading-relaxed">{content.groupText}</p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Pack Formation + Handicap */}
      <section className="py-16">
        <SectionContainer>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Pack Formation */}
            <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                {content.packTitle}
              </h2>
              <ul className="space-y-3">
                {content.packItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-muted text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Handicap */}
            <div className="bg-light-bg rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold text-primary mb-4">
                {content.handicapTitle}
              </h2>
              <ul className="space-y-3">
                {content.handicapItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-muted text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button variant="secondary" size="sm" href="/contact">
                  {tCommon("sendMessage")}
                </Button>
              </div>
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
              {tCommon("sendMessage")}
            </Button>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
