import type { Metadata } from 'next';
import { ArrowRight, CalendarDays, Link2, Route, Webcam } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import CountUp from '@/components/ui/CountUp';
import HeroSlideshow, { type Slide } from '@/components/ui/HeroSlideshow';
import Kicker from '@/components/ui/Kicker';
import NewsCard from '@/components/ui/NewsCard';
import NewsRow from '@/components/ui/NewsRow';
import Reveal from '@/components/ui/Reveal';
import SanityPhoto from '@/components/ui/SanityPhoto';
import Section from '@/components/ui/Section';
import TextLink from '@/components/ui/TextLink';
import { formatAmount, getTrialPrices } from '@/lib/pricing';
import { sanityFetch } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';
import { latestArticlesQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import type { Article, SiteSettings } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  const firstImage = settings?.heroSlides?.[0]?.image;
  return {
    ...buildMetadata({
      title: t('title'),
      description: t('description'),
      locale,
      pathname: '/',
      image: firstImage?.asset ? urlFor(firstImage).width(1200).height(630).fit('crop').url() : undefined,
    }),
    title: { absolute: t('title') },
  };
}

const sectionTitle = 'font-display text-[1.875rem] leading-[1.12] font-semibold text-azur lg:text-h2';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');

  const [settings, articles, prices] = await Promise.all([
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<Article[]>(latestArticlesQuery, [], { limit: 3 }),
    getTrialPrices(),
  ]);

  // Slides without a title or subtitle fall back to the club's name and tagline
  const defaultSubtitle = localize(settings?.tagline, locale) ?? t('heroSubtitle');
  const slides: Slide[] = settings?.heroSlides?.length
    ? settings.heroSlides.map((s) => ({
        key: s._key,
        image: s.image,
        title: localize(s.title, locale) ?? t('heroTitle'),
        subtitle: localize(s.subtitle, locale) ?? defaultSubtitle,
      }))
    : [{ key: 'default', title: t('heroTitle'), subtitle: defaultSubtitle }];

  // Trial flight prices, from the `vol-initiation` tariffs: the lines are hidden without them
  const adult = prices.adult != null ? formatAmount(prices.adult, locale) : null;
  const young = prices.young != null ? formatAmount(prices.young, locale) : null;
  const bold = (chunks: React.ReactNode) => <b className="font-semibold text-nuit">{chunks}</b>;
  const heroPrice = adult
    ? young
      ? t.rich('heroPrice', { adult, young, b: bold })
      : t.rich('heroPriceSingle', { adult, b: bold })
    : null;
  const cardPrice = adult ? (young ? t('cardTryPrice', { adult, young }) : t('cardTryPriceSingle', { adult })) : null;

  const stats = [
    { value: settings?.licensedPilots, label: t('statsPilots') },
    {
      value: settings?.flightHours,
      label: settings?.statsYear ? t('statsHoursYear', { year: settings.statsYear }) : t('statsHours'),
    },
    { value: settings?.kmFlown, label: t('statsKm') },
    { value: settings?.glidersCount, label: t('statsGliders') },
    // A year: no thousands separator
    { value: settings?.foundedYear, label: t('statsFounded'), plain: true },
  ].flatMap((s) =>
    s.value == null
      ? []
      : [{ ...s, value: s.value, display: s.plain ? String(s.value) : s.value.toLocaleString(locale) }],
  );

  const cardImages = settings?.homeCardImages;
  const cards = [
    {
      href: '/decouvrir' as const,
      image: cardImages?.try,
      kicker: t('cardTryKicker'),
      title: t('cardTryTitle'),
      text: cardPrice ? `${t('cardTryText')} ${cardPrice}` : t('cardTryText'),
      cta: t('cardTryCta'),
    },
    {
      href: { pathname: '/club' as const, hash: 'formation' },
      image: cardImages?.learn,
      kicker: t('cardLearnKicker'),
      title: t('cardLearnTitle'),
      text: t('cardLearnText'),
      cta: t('cardLearnCta'),
    },
    {
      href: '/adherer' as const,
      image: cardImages?.join,
      kicker: t('cardJoinKicker'),
      title: t('cardJoinTitle'),
      text: t('cardJoinText'),
      cta: t('cardJoinCta'),
    },
  ];

  const memberTiles = [
    // The webcam page is empty until its address is set in the Studio
    ...(settings?.webcamUrl ? [{ key: 'webcam', href: '/webcam' as const, Icon: Webcam, live: true }] : []),
    { key: 'agenda', href: { pathname: '/actualites' as const, hash: 'agenda' }, Icon: CalendarDays },
    { key: 'stories', href: '/recits' as const, Icon: Route },
    { key: 'links', href: '/liens' as const, Icon: Link2 },
  ];

  return (
    <>
      <HeroSlideshow slides={slides} kicker={t('heroKicker')} cta={t('heroCta')} price={heroPrice} />

      {stats.length > 0 && (
        <section aria-label={t('statsLabel')}>
          <Container className="pt-14 lg:pt-24">
            <dl className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-x-6 lg:gap-y-10">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-1.5 lg:gap-2">
                  <dt className="text-[0.9375rem] leading-[1.35] text-texte lg:text-[1.0625rem]">{s.label}</dt>
                  <dd>
                    <CountUp
                      value={s.value}
                      display={s.display}
                      locale={locale}
                      plain={s.plain}
                      className="font-display text-[2.75rem] leading-none font-semibold tracking-titre text-azur tabular-nums lg:text-[4rem]"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <Section kicker={t('startKicker')} title={t('startTitle')}>
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-3 lg:gap-y-12">
          {cards.map((card, i) => (
            <Reveal key={card.title} index={i}>
              <Link href={card.href} className="group flex flex-col gap-4 rounded-md lg:gap-5">
                <div className="overflow-hidden rounded-md">
                  <SanityPhoto
                    image={card.image}
                    label={card.title}
                    className="aspect-[4/3] transition-transform duration-150 ease-planeur group-hover:scale-[1.03]"
                    ratio={0.75}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="flex flex-col gap-2 lg:gap-2.5">
                  <p className="font-display text-[0.9375rem] font-semibold text-balise">{card.kicker}</p>
                  <h3 className="font-display text-2xl leading-[1.2] font-semibold text-azur lg:text-[1.75rem] lg:leading-[1.15]">
                    {card.title}
                  </h3>
                  <p className="text-[1.0625rem] leading-[1.55] text-texte">{card.text}</p>
                  <span className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-altitude decoration-2 underline-offset-4 group-hover:underline">
                    {card.cta}
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-150 ease-planeur group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {articles.length > 0 && (
        <Section band kicker={t('latestKicker')} title={t('latestTitle')} action={{ href: '/actualites', label: t('allNews') }}>
          <div className="hidden gap-x-6 gap-y-12 md:grid md:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article._id} index={i}>
                <NewsCard article={article} />
              </Reveal>
            ))}
          </div>
          <div className="flex flex-col gap-3 md:hidden">
            {articles.map((article) => (
              <NewsRow key={article._id} article={article} />
            ))}
          </div>
        </Section>
      )}

      <Container className="py-16 lg:py-32">
        <div className="flex flex-wrap items-center gap-x-[72px] gap-y-6 lg:gap-y-10">
          <SanityPhoto
            image={settings?.giftImage}
            label="bons-de-vol"
            className="aspect-[3/2] min-w-0 flex-[1_1_480px]"
            ratio={2 / 3}
            sizes="(max-width: 1024px) 100vw, 600px"
          />
          <div className="flex min-w-0 flex-[1_1_380px] flex-col items-start">
            <Kicker>{t('giftKicker')}</Kicker>
            <h2 className={sectionTitle}>{t('giftTitle')}</h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.6] text-texte lg:text-lg lg:leading-[1.65]">{t('giftText')}</p>
            <div className="mt-6 flex w-full flex-wrap items-center gap-3">
              <Button href={{ pathname: '/decouvrir', hash: 'bons' }} variant="secondary" className="w-full sm:w-auto">
                {t('giftCta')}
              </Button>
              <TextLink href="/contact" className="px-2">
                {t('giftCompanyCta')}
              </TextLink>
            </div>
          </div>
        </div>
      </Container>

      <Container className="pb-16 lg:pb-28">
        <section className="flex flex-col gap-4 rounded-md bg-ciel px-4 py-6 lg:gap-6 lg:p-10">
          <h2 className="font-display text-[1.3125rem] font-semibold text-azur lg:text-2xl">{t('membersTitle')}</h2>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] lg:gap-3">
            {memberTiles.map(({ key, href, Icon, live }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex h-full flex-col items-start gap-2 rounded-sm bg-blanc p-4 font-semibold text-azur transition-colors duration-150 hover:text-altitude sm:min-h-16 sm:flex-row sm:items-center sm:gap-3.5 sm:px-[18px] sm:py-0"
                >
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-altitude" />
                  <span>{tNav(key)}</span>
                  {live && <span className="text-sm font-medium text-brume sm:ml-auto">{t('webcamLive')}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
