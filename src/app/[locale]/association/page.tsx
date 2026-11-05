import type { Metadata } from 'next';
import clsx from 'clsx';
import { ArrowUp } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import { CLUB_ANCHORS } from '@/components/layout/navItems';
import PortableText from '@/components/sanity/PortableText';
import Anecdote from '@/components/ui/Anecdote';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import FrenchOnlyNote from '@/components/ui/FrenchOnlyNote';
import Kicker from '@/components/ui/Kicker';
import PartnerLogo from '@/components/ui/PartnerLogo';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Section from '@/components/ui/Section';
import SectionNav from '@/components/ui/SectionNav';
import SitePageHero from '@/components/ui/SitePageHero';
import TextLink from '@/components/ui/TextLink';
import TrainingPath from '@/components/ui/TrainingPath';
import { sanityFetch } from '@/lib/sanity/fetch';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import { allClubPagesQuery, allPartnersQuery, clubHistoryQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { ClubHistory, ClubPage, ClubSection, Partner, SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

const SECTION_ORDER: ClubSection[] = ['presentation', 'platform', 'activities', 'training', 'campaign', 'competition'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.club' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/association' });
}

const pad = (n: number) => String(n).padStart(2, '0');

interface Rendered {
  section: ClubSection;
  page: ClubPage;
  /** "01", "02"… over the sections that exist. */
  number: string;
  title: string;
}

interface SectionTextProps {
  item: Rendered;
  locale: string;
  /** Smaller title, for the two side-by-side sections. */
  small?: boolean;
}

/** Number, title, intro and body of a club section. */
function SectionText({ item, locale, small = false }: SectionTextProps) {
  const intro = localize(item.page.intro, locale);
  const french = [item.page.title, item.page.intro, item.page.body].some((field) => isFrenchFallback(field, locale));
  return (
    <div lang={french ? 'fr' : undefined}>
      <Kicker>{item.number}</Kicker>
      <h2
        className={clsx(
          'font-display font-semibold text-balance text-azur',
          small ? 'text-[1.75rem] leading-[1.15] lg:text-[2rem] lg:leading-[1.12]' : 'text-[1.875rem] leading-[1.12] lg:text-h2',
        )}
      >
        {item.title}
      </h2>
      {french && <FrenchOnlyNote className="mt-4" />}
      {intro && <p className="mt-5 text-[1.1875rem] leading-[1.55] text-texte lg:text-[1.3125rem]">{intro}</p>}
      <PortableText value={localize(item.page.body, locale)} className="mt-5" />
    </div>
  );
}

const sectionSpacing = 'scroll-mt-36 pt-16 lg:pt-32';

export default async function ClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('club');
  const tNav = await getTranslations('nav');
  const tHome = await getTranslations('home');
  const tStories = await getTranslations('stories');
  const tCommon = await getTranslations('common');
  const tPartners = await getTranslations('partners');

  const [pages, history, settings, partners] = await Promise.all([
    sanityFetch<ClubPage[]>(allClubPagesQuery, []),
    sanityFetch<ClubHistory | null>(clubHistoryQuery, null),
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<Partner[]>(allPartnersQuery, []),
  ]);

  const rendered: Rendered[] = SECTION_ORDER.flatMap((section) => {
    const page = pages.find((p) => p.section === section);
    return page ? [{ section, page, title: localize(page.title, locale) ?? tNav(section) }] : [];
  }).map((item, i) => ({ ...item, number: pad(i + 1) }));

  const presentation = rendered.find((r) => r.section === 'presentation');
  // Perfectionnement and Compétition sit side by side
  const pair = rendered.filter((r) => r.section === 'campaign' || r.section === 'competition');

  const navLinks = [
    ...rendered.map((r) => ({ id: CLUB_ANCHORS[r.section], label: tNav(r.section) })),
    ...(history ? [{ id: CLUB_ANCHORS.history, label: tNav('history') }] : []),
    ...(partners.length > 0 ? [{ id: CLUB_ANCHORS.partners, label: tNav('partners') }] : []),
  ];

  // "Le club en bref": rows without data are left out
  const field = settings?.address?.split('\n')[0]?.trim();
  const gliders = settings?.glidersCount;
  const pilots = settings?.licensedPilots;
  const factRows = [
    ...(field ? [{ label: t('factsField'), value: field }] : []),
    ...(gliders != null ? [{ label: t('factsFleet'), value: t('factsFleetText', { count: gliders }) }] : []),
    ...(pilots != null ? [{ label: t('factsPilots'), value: t('factsPilotsText', { count: pilots }) }] : []),
  ];
  const factFigures = [
    ...(gliders != null ? [{ label: tHome('statsGliders'), value: gliders }] : []),
    ...(pilots != null ? [{ label: tHome('statsPilots'), value: pilots }] : []),
  ];

  const historyTitle = localize(history?.title, locale) ?? tNav('history');
  const historyIntro = localize(history?.intro, locale);
  const historyFrench = [history?.title, history?.intro, history?.body].some((field) => isFrenchFallback(field, locale));
  const historyLang = historyFrench ? 'fr' : undefined;

  return (
    <>
      <SitePageHero
        page="club"
        kicker={t('heroKicker')}
        title={t('heroTitle')}
        lead={localize(settings?.tagline, locale) ?? t('heroLead')}
        fallbackImage={presentation?.page.mainImage}
      />

      {navLinks.length > 1 && <SectionNav links={navLinks} label={t('sectionNav')} />}

      {rendered.length === 0 && !history && (
        <Section title={t('emptyTitle')}>
          <EmptyState>{t('empty')}</EmptyState>
        </Section>
      )}

      {rendered.map((item) => {
        const id = CLUB_ANCHORS[item.section];

        if (item.section === 'presentation') {
          return (
            <section key={id} id={id} className={clsx(sectionSpacing, 'lg:pt-28')}>
              <Container>
                <div className="flex flex-wrap gap-x-[72px] gap-y-10">
                  <div className="min-w-0 flex-[999_1_560px]">
                    <SectionText item={item} locale={locale} />
                  </div>
                  {factRows.length > 0 && (
                    <aside
                      aria-label={t('factsTitle')}
                      className="flex min-w-0 flex-[1_1_320px] flex-col items-start gap-4 self-start rounded-md bg-ciel p-5 lg:gap-5 lg:p-8"
                    >
                      <dl className="hidden flex-col gap-[18px] lg:flex">
                        {factRows.map((row) => (
                          <div key={row.label} className="flex flex-col gap-1">
                            <dt className="text-sm font-semibold text-brume">{row.label}</dt>
                            <dd className="text-[1.0625rem] leading-[1.45] text-nuit">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                      {factFigures.length > 0 && (
                        <dl className="grid w-full grid-cols-2 gap-4 lg:hidden">
                          {factFigures.map((fig) => (
                            <div key={fig.label} className="flex flex-col-reverse gap-0.5">
                              <dt className="text-sm leading-[1.35] text-texte">{fig.label}</dt>
                              <dd className="font-display text-[1.875rem] leading-none font-semibold text-azur tabular-nums">
                                {fig.value.toLocaleString(locale)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <TextLink href="/planeurs">{t('factsSeeFleet')}</TextLink>
                    </aside>
                  )}
                </div>
              </Container>
            </section>
          );
        }

        if (item.section === 'platform' || item.section === 'activities') {
          // Text and photo side by side; the photo stays in view along the long texts
          return (
            <section key={id} id={id} className={sectionSpacing}>
              <Container>
                <div className="grid gap-x-[72px] gap-y-8 lg:grid-cols-2 lg:items-start">
                  <div className="min-w-0">
                    <SectionText item={item} locale={locale} />
                  </div>
                  <div
                    className={clsx(
                      'min-w-0 lg:sticky lg:top-40',
                      // La plateforme: photo on the left; Activité: on the right, and first on phones
                      item.section === 'platform' ? 'lg:order-first' : 'order-first lg:order-last',
                    )}
                  >
                    <SanityPhoto
                      image={item.page.mainImage}
                      label={item.title}
                      className="aspect-[4/3]"
                      ratio={0.75}
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                  </div>
                </div>
              </Container>
            </section>
          );
        }

        if (item.section === 'training') {
          return (
            <section key={id} id={id} className="mt-16 scroll-mt-36 bg-ciel py-14 lg:mt-32 lg:py-28">
              <Container>
                <div className="max-w-[680px]">
                  <SectionText item={item} locale={locale} />
                  <Button href="/decouvrir" variant="secondary" className="mt-8 w-full sm:w-auto">
                    {t('trainingCta')}
                  </Button>
                </div>
                <div className="mt-10 lg:mt-14">
                  <TrainingPath diagram={item.page.diagram} />
                </div>
              </Container>
            </section>
          );
        }

        // Perfectionnement and Compétition: rendered once, together
        if (item !== pair[0]) return null;
        return (
          <section key="pair" className="pt-16 lg:pt-32">
            <Container>
              <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
                {pair.map((p) => (
                  <article key={p.section} id={CLUB_ANCHORS[p.section]} className="min-w-0 scroll-mt-36">
                    <SanityPhoto
                      image={p.page.mainImage}
                      label={p.title}
                      className="mb-6 aspect-[3/2]"
                      ratio={2 / 3}
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                    <SectionText item={p} locale={locale} small />
                    {p.section === 'competition' && settings?.weglideUrl && (
                      <TextLink href={settings.weglideUrl} external className="mt-4">
                        {tStories('clubOnWeglide')}
                      </TextLink>
                    )}
                  </article>
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      {history ? (
        <article id={CLUB_ANCHORS.history} className="scroll-mt-36 pt-24 pb-20 lg:pt-40 lg:pb-32">
          <Container>
            <header className="mx-auto flex max-w-[760px] flex-col lg:items-center lg:text-center">
              <Kicker>{`${pad(rendered.length + 1)} · ${tNav('history')}`}</Kicker>
              <h2 lang={historyLang} className="font-display text-[2.375rem] leading-[1.05] font-semibold tracking-titre text-balance text-azur lg:text-[4rem] lg:leading-[1.02]">
                {historyTitle}
              </h2>
              {historyFrench && <FrenchOnlyNote className="mt-5" />}
              {historyIntro && (
                <p lang={historyLang} className="mt-5 text-[1.1875rem] leading-[1.55] text-texte lg:text-[1.375rem]">
                  {historyIntro}
                </p>
              )}
            </header>
            <PortableText
              value={localize(history.body, locale)}
              className="prose-piv-longread mx-auto mt-8 max-w-[680px] lg:mt-16"
              lang={historyLang}
            />
            <div className="mx-auto mt-10 flex max-w-[680px] flex-col items-start gap-6">
              {history.anecdotes?.map((a) => (
                <Anecdote
                  key={a._key}
                  title={localize(a.title, locale)}
                  text={localize(a.text, locale)}
                  lang={isFrenchFallback(a.text, locale) ? 'fr' : undefined}
                />
              ))}
              <a
                href="#"
                className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-altitude decoration-2 underline-offset-4 hover:underline"
              >
                <ArrowUp
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-planeur group-hover:-translate-y-0.5"
                />
                {tCommon('backToTop')}
              </a>
            </div>
          </Container>
        </article>
      ) : (
        rendered.length > 0 && partners.length === 0 && <div aria-hidden="true" className="h-16 lg:h-32" />
      )}

      {/* Partners in full here: the band above the footer is left out on this page */}
      {partners.length > 0 && (
        <Section band id={CLUB_ANCHORS.partners} kicker={tPartners('sectionKicker')} title={tPartners('sectionTitle')} sub={tPartners('sectionSub')}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {partners.map((partner) => {
              const role = localize(partner.role, locale);
              return (
                <li key={partner._id} className="flex flex-col gap-4 rounded-md bg-blanc p-5 lg:p-6">
                  <div className="flex h-28 items-center">
                    <PartnerLogo partner={partner} size="lg" linkLabel={tPartners('visit', { name: partner.name })} />
                  </div>
                  <div>
                    <p className="font-semibold text-azur">{partner.name}</p>
                    {role && (
                      <p lang={isFrenchFallback(partner.role, locale) ? 'fr' : undefined} className="mt-1 text-[0.9375rem] leading-[1.5] text-texte">
                        {role}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </>
  );
}
