import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import Button from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Tarifs et cotisations \u2014 Planeurs d'Ille-et-Vilaine"
      : "Pricing and membership \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Tarifs d'adh\u00e9sion, co\u00fbt des vols et cotisations du club de vol \u00e0 voile Planeurs d'Ille-et-Vilaine."
      : "Membership fees, flight costs, and pricing for the Planeurs d'Ille-et-Vilaine soaring club.",
    locale,
    pathname: '/le-club/tarifs',
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingPageContent />;
}

function PricingPageContent() {
  const tNav = useTranslations('nav');
  const tPricing = useTranslations('pricing');
  const tCommon = useTranslations('common');

  const membershipTiers = [
    {
      label: tPricing('juniorLabel'),
      price: tPricing('juniorPrice'),
      highlight: false,
    },
    {
      label: tPricing('adultLabel'),
      price: tPricing('adultPrice'),
      highlight: true,
    },
    {
      label: tPricing('familyLabel'),
      price: tPricing('familyPrice'),
      highlight: false,
    },
  ];

  const includes = [
    tPricing('membershipIncludes1'),
    tPricing('membershipIncludes2'),
    tPricing('membershipIncludes3'),
    tPricing('membershipIncludes4'),
  ];

  return (
    <div>
      <Hero
        title={tNav('pricing')}
        subtitle={tPricing('heroSubtitle')}
      />

      {/* Membership section */}
      <section className="py-16 bg-white">
        <SectionContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {tPricing('membershipTitle')}
            </h2>
            <p className="text-muted text-lg">
              {tPricing('membershipSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {membershipTiers.map((tier) => (
              <div
                key={tier.label}
                className={`rounded-xl border-2 p-8 text-center transition-shadow hover:shadow-md ${
                  tier.highlight
                    ? 'border-accent bg-accent/5 shadow-md'
                    : 'border-border bg-white'
                }`}
              >
                <h3 className="font-semibold text-lg text-primary mb-4">
                  {tier.label}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-accent">
                    {tier.price}&euro;
                  </span>
                  <span className="text-muted text-sm">
                    {tPricing('perYear')}
                  </span>
                </div>
                <ul className="space-y-3 text-left">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <svg
                        className="w-5 h-5 text-accent shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Flight costs section */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {tPricing('flightCostsTitle')}
            </h2>
            <p className="text-muted text-lg">
              {tPricing('flightCostsSubtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-primary">
                      Type
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-primary">
                      Tarif
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 text-muted">
                      {tPricing('discoveryFlight')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-primary">
                      {tPricing('discoveryFlightPrice')}&euro;
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 text-muted">
                      {tPricing('towCost')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-primary">
                      {tPricing('towCostPrice')}&euro;
                      <span className="text-muted text-sm font-normal">
                        {tPricing('perTow')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-muted">
                      {tPricing('flightTime')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-primary">
                      {tPricing('flightTimePrice')}&euro;
                      <span className="text-muted text-sm font-normal">
                        {tPricing('perMinute')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <SectionContainer className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {tPricing('ctaTitle')}
          </h2>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
            {tPricing('ctaText')}
          </p>
          <Button variant="primary" size="lg" href="/contact">
            {tCommon('sendMessage')}
          </Button>
        </SectionContainer>
      </section>
    </div>
  );
}
