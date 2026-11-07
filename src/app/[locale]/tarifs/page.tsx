import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import BudgetCard from '@/components/ui/BudgetCard';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import FrenchOnlyNote from '@/components/ui/FrenchOnlyNote';
import Kicker from '@/components/ui/Kicker';
import PricingItemRow, { PRICING_GRID } from '@/components/ui/PricingItemRow';
import Section from '@/components/ui/Section';
import SectionNav from '@/components/ui/SectionNav';
import SitePageHero from '@/components/ui/SitePageHero';
import TextLink from '@/components/ui/TextLink';
import { formatDate } from '@/lib/format';
import { pricingSectionId } from '@/lib/pricing';
import { sanityFetch } from '@/lib/sanity/fetch';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import { pricingPageQuery } from '@/lib/sanity/queries';
import type { PricingItem, PricingPage } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.pricing' });
  const page = await sanityFetch<PricingPage | null>(pricingPageQuery, null);
  return buildMetadata({
    title: t('title', { season: page?.season ?? '' }).trim(),
    description: t('description'),
    locale,
    pathname: '/tarifs',
  });
}

/** Items in a row with the same group label ("Illimité", "À l'heure"…) are shown under one heading. */
function groupItems(items: PricingItem[], locale: string) {
  const groups: { label?: string; items: PricingItem[] }[] = [];
  for (const item of items) {
    const label = localize(item.group, locale);
    const last = groups.at(-1);
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export default async function PricingPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricingPage');
  const page = await sanityFetch<PricingPage | null>(pricingPageQuery, null);

  const season = page?.season;
  const title = season ? t('heroTitle', { season }) : t('heroTitleNoSeason');
  const sections = (page?.sections ?? []).filter((section) => (section.items?.length ?? 0) > 0);
  const budgets = page?.budgets ?? [];
  const conditions = page?.conditions ?? [];
  const intro = localize(page?.intro, locale);
  const ageRule = localize(page?.ageRule, locale);
  const budgetsIntro = localize(page?.budgetsIntro, locale);
  // On /en, the texts typed only in French are announced once at the top
  const frenchOnly = locale === 'en' && sections.some((s) => s.items?.some((i) => isFrenchFallback(i.name, locale) || isFrenchFallback(i.description, locale)));

  const navLinks = [
    ...sections.map((section, i) => ({ id: pricingSectionId(section, i), label: localize(section.title, locale) ?? '' })),
    ...(budgets.length > 0 ? [{ id: 'budgets', label: t('budgetsTitle') }] : []),
    ...(conditions.length > 0 ? [{ id: 'conditions', label: t('conditionsTitle') }] : []),
  ];

  return (
    <>
      <SitePageHero page="pricing" kicker={t('heroKicker')} title={title} lead={intro ?? t('heroLead')} />

      {sections.length === 0 ? (
        <Section title={t('heroTitleNoSeason')}>
          <EmptyState action={{ href: '/contact', label: t('contactCta') }}>{t('empty')}</EmptyState>
        </Section>
      ) : (
        <>
          {navLinks.length > 1 && <SectionNav links={navLinks} label={t('sectionNav')} />}

          {/* Edition, PDF and the age rule: what applies to the whole grid */}
          <Container className="pt-10 lg:pt-14">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="flex flex-col gap-2">
                {page?.editionDate && <p className="text-sm text-brume">{t('edition', { date: formatDate(page.editionDate, locale) })}</p>}
                {page?.documentUrl && (
                  <TextLink href={page.documentUrl} external>
                    <span className="inline-flex items-center gap-2">
                      <Download size={16} strokeWidth={2} aria-hidden="true" />
                      {t('download')}
                    </span>
                  </TextLink>
                )}
                {frenchOnly && <FrenchOnlyNote />}
              </div>
              {ageRule && (
                <p
                  lang={isFrenchFallback(page?.ageRule, locale) ? 'fr' : undefined}
                  className="max-w-[560px] rounded-md p-4 text-[0.9375rem] leading-[1.55] text-texte inset-ring inset-ring-horizon lg:p-5"
                >
                  <span className="font-semibold text-nuit">{t('ageRuleLabel')} </span>
                  {ageRule}
                </p>
              )}
            </div>
          </Container>

          {sections.map((section, i) => {
            const sectionIntro = localize(section.intro, locale);
            const hasAges = section.items?.some((item) => item.mode === 'ages');
            const ages: [string, string] = section.ageSplit === '18' ? [t('under18'), t('over18')] : [t('under25'), t('over25')];
            return (
              <section key={section._key} id={pricingSectionId(section, i)} className="scroll-mt-36 pt-14 lg:pt-20">
                <Container>
                  <Kicker>{String(i + 1).padStart(2, '0')}</Kicker>
                  <h2 className="font-display text-[1.875rem] leading-[1.12] font-semibold text-balance text-azur lg:text-h2">
                    {localize(section.title, locale)}
                  </h2>
                  {sectionIntro && <p className="mt-3 max-w-[640px] text-[1.0625rem] leading-[1.6] text-texte">{sectionIntro}</p>}

                  <div className="mt-7 rounded-md bg-ciel px-5 pb-2 lg:mt-9 lg:px-8">
                    {/* Column headers, on wide screens only (on phones each price carries its own caption).
                        They stick under the header (64 px, 80 px from xl) and the section menu (57 px) while
                        the table scrolls, and leave with it. */}
                    {hasAges && (
                      <div
                        className={`sticky top-[121px] z-20 hidden border-b border-horizon bg-ciel py-3.5 text-sm font-semibold text-brume xl:top-[137px] ${PRICING_GRID}`}
                      >
                        <span>{t('service')}</span>
                        <span className="text-right">{ages[0]}</span>
                        <span className="text-right">{ages[1]}</span>
                      </div>
                    )}
                    {groupItems(section.items ?? [], locale).map((group, g) => (
                      <div key={g} className={g > 0 ? 'border-t border-horizon' : undefined}>
                        {group.label && <p className="pt-6 font-display text-[0.9375rem] font-semibold text-balise">{group.label}</p>}
                        {group.items.map((item) => (
                          <PricingItemRow key={item._key} item={item} locale={locale} ages={ages} ageColumns={hasAges} />
                        ))}
                      </div>
                    ))}
                  </div>

                  {(section.conditions?.length ?? 0) > 0 && (
                    <ul className="mt-5 flex max-w-[760px] flex-col gap-1.5 text-[0.8125rem] leading-snug text-brume">
                      {section.conditions!.map((condition) => (
                        <li key={condition._key} lang={isFrenchFallback(condition.text, locale) ? 'fr' : undefined}>
                          {localize(condition.text, locale)}
                        </li>
                      ))}
                    </ul>
                  )}
                </Container>
              </section>
            );
          })}

          {budgets.length > 0 && (
            <div className="mt-16 lg:mt-28">
              <Section band id="budgets" kicker={t('budgetsKicker')} title={t('budgetsTitle')} sub={budgetsIntro}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                  {budgets.map((budget) => (
                    <BudgetCard key={budget._key} budget={budget} locale={locale} />
                  ))}
                </div>
              </Section>
            </div>
          )}

          {conditions.length > 0 && (
            <Section id="conditions" kicker={t('conditionsKicker')} title={t('conditionsTitle')}>
              <ul className="flex max-w-[760px] list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-[1.55] text-texte marker:text-horizon">
                {conditions.map((condition) => (
                  <li key={condition._key} lang={isFrenchFallback(condition.text, locale) ? 'fr' : undefined}>
                    {localize(condition.text, locale)}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-horizon pt-8">
                <p className="font-display text-xl font-semibold text-azur">{t('questions')}</p>
                <Button href="/contact" variant="secondary">
                  {t('contactCta')}
                </Button>
                <TextLink href="/adherer">{t('joinCta')}</TextLink>
              </div>
            </Section>
          )}
        </>
      )}
    </>
  );
}
