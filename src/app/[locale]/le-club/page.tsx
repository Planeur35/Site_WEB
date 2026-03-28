import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Le club \u2014 Planeurs d'Ille-et-Vilaine"
      : "The club \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "D\u00e9couvrez le club Planeurs d'Ille-et-Vilaine : histoire, valeurs, vie associative et passion du vol \u00e0 voile en Bretagne."
      : "Discover the Planeurs d'Ille-et-Vilaine club: history, values, community life and passion for soaring in Brittany.",
    locale,
    pathname: '/le-club',
  });
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ClubPageContent />;
}

function ClubPageContent() {
  const tNav = useTranslations('nav');
  const tClub = useTranslations('club');
  const tCommon = useTranslations('common');

  return (
    <div>
      <Hero
        title={tNav('aboutUs')}
        subtitle={tClub('heroSubtitle')}
      />

      {/* Club history */}
      <section className="py-16 bg-white">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-8">
            {tClub('historyTitle')}
          </h2>
          <div className="max-w-3xl space-y-6">
            <p className="text-muted leading-relaxed text-lg">
              {tClub('historyText1')}
            </p>
            <p className="text-muted leading-relaxed text-lg">
              {tClub('historyText2')}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Values */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            {tClub('valuesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card title={tClub('passionTitle')}>
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4 mt-2">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                {tClub('passionText')}
              </p>
            </Card>

            <Card title={tClub('safetyTitle')}>
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4 mt-2">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                {tClub('safetyText')}
              </p>
            </Card>

            <Card title={tClub('communityTitle')}>
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4 mt-2">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                {tClub('communityText')}
              </p>
            </Card>
          </div>
        </SectionContainer>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <SectionContainer className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {tClub('ctaTitle')}
          </h2>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
            {tClub('ctaText')}
          </p>
          <Button variant="primary" size="lg" href="/contact">
            {tCommon('sendMessage')}
          </Button>
        </SectionContainer>
      </section>
    </div>
  );
}
