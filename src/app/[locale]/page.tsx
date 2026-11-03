import type { Metadata } from 'next';
import clsx from 'clsx';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import { Link } from '@/i18n/navigation';
import HeroSlideshow, { type Slide } from '@/components/ui/HeroSlideshow';
import Kicker from '@/components/ui/Kicker';
import NewsRow from '@/components/ui/NewsRow';
import Section from '@/components/ui/Section';
import TextLink from '@/components/ui/TextLink';
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const [settings, articles] = await Promise.all([
    sanityFetch<SiteSettings | null>(siteSettingsQuery, null),
    sanityFetch<Article[]>(latestArticlesQuery, [], { limit: 3 }),
  ]);

  const slides: Slide[] = settings?.heroSlides?.length
    ? settings.heroSlides.map((s) => ({
        key: s._key,
        image: s.image,
        title: localize(s.title, locale) ?? tc('clubName'),
        subtitle: localize(s.subtitle, locale),
      }))
    : [{ key: 'default', title: t('heroTitle'), subtitle: localize(settings?.tagline, locale) ?? t('heroSubtitle') }];

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
    s.value == null ? [] : [{ label: s.label, display: s.plain ? String(s.value) : s.value.toLocaleString(locale) }],
  );
  // Columns on wider screens: one row, or 3 + 2 on tablets when there are five figures
  const statsColumns: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
  };

  const cards = [
    { href: '/decouvrir' as const, kicker: t('cardTryKicker'), title: t('cardTryTitle'), text: t('cardTryText') },
    { href: { pathname: '/club' as const, hash: 'formation' }, kicker: t('cardLearnKicker'), title: t('cardLearnTitle'), text: t('cardLearnText') },
    { href: '/adherer' as const, kicker: t('cardJoinKicker'), title: t('cardJoinTitle'), text: t('cardJoinText') },
  ];

  return (
    <>
      <HeroSlideshow slides={slides} kicker={tc('brandKicker')} />

      {stats.length > 0 && (
        <div className="border-y border-sky-900/10 bg-linear-to-b from-horizon to-ciel">
          <dl className={clsx('mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 md:px-8', statsColumns[stats.length])}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse lg:border-l lg:border-sky-900/10 lg:pl-6 lg:first:border-0 lg:first:pl-0">
                <dt className="mt-2 text-xs uppercase tracking-[0.18em] text-sky-800">{s.label}</dt>
                <dd className={clsx('font-serif text-sky-950', stats.length === 5 ? 'text-3xl' : 'text-4xl')}>{s.display}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="grid gap-px border border-sky-900/10 bg-sky-900/10 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-ciel p-8 transition-all hover:bg-white hover:shadow-[0_12px_40px_-20px_rgba(18,48,79,0.35)]"
            >
              <Kicker>{card.kicker}</Kicker>
              <h2 className="font-serif text-2xl leading-snug text-sky-950 group-hover:underline group-hover:decoration-sky-400 group-hover:underline-offset-4">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.text}</p>
              <span className="mt-6 inline-block text-xs uppercase tracking-[0.25em] text-sky-800">{tc('discover')}</span>
            </Link>
          ))}
        </div>
      </div>

      {articles.length > 0 && (
        <Section kicker={t('latestKicker')} title={t('latestTitle')}>
          <div className="border-t border-sky-900/15">
            {articles.map((article) => (
              <NewsRow key={article._id} article={article} />
            ))}
          </div>
          <p className="mt-8">
            <TextLink href="/actualites">{t('allNews')}</TextLink>
          </p>
        </Section>
      )}
    </>
  );
}
