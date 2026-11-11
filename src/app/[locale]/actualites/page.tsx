import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import Kicker from '@/components/ui/Kicker';
import NewsRow from '@/components/ui/NewsRow';
import PartnersPanel from '@/components/ui/PartnersPanel';
import SitePageHero from '@/components/ui/SitePageHero';
import { formatDayNumber, formatMonthShort, formatTime, formatWeekday, startOfToday } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { allArticlesQuery, allPartnersQuery, upcomingEventsQuery } from '@/lib/sanity/queries';
import type { Article, ClubEvent, Partner } from '@/lib/sanity/types';

// Also drops past events from the agenda without a rebuild
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.news' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/actualites' });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const [articles, events, partners] = await Promise.all([
    sanityFetch<Article[]>(allArticlesQuery, []),
    sanityFetch<ClubEvent[]>(upcomingEventsQuery, [], { since: startOfToday() }),
    sanityFetch<Partner[]>(allPartnersQuery, []),
  ]);

  return (
    <>
      <SitePageHero page="news" kicker={t('heroKicker')} title={t('heroTitle')} variant={0} />

      {/* News feed on the left; agenda and partners in a side band on the right (below the feed on phones) */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <section id="news" aria-labelledby="news-title" className="scroll-mt-40">
          <Kicker>{t('listKicker')}</Kicker>
          <h2 id="news-title" className="font-serif text-3xl leading-[1.1] tracking-tight text-sky-950 md:text-[2.6rem]">
            {t('listTitle')}
          </h2>
          <div className="mt-10">
            {articles.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
            <div className="border-t border-sky-900/15">
              {articles.map((article) => (
                <NewsRow key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-10">
          <section id="agenda" aria-labelledby="agenda-title" className="scroll-mt-40 border border-sky-900/10 bg-white p-6">
            <Kicker>{t('agendaKicker')}</Kicker>
            <h2 id="agenda-title" className="font-serif text-2xl leading-tight text-sky-950">
              {t('agendaTitle')}
            </h2>
            {events.length === 0 && (
              <div className="mt-5">
                <EmptyState>{t('agendaEmpty')}</EmptyState>
              </div>
            )}
            <ul className="mt-5 divide-y divide-sky-900/10 border-t border-sky-900/10">
              {events.map((event) => {
                const time = formatTime(event.startDate, locale);
                const description = localize(event.description, locale);
                return (
                  <li key={event._id} className="flex items-start gap-4 py-4">
                    <time dateTime={event.startDate} className="w-12 shrink-0 text-center">
                      <span className="block font-serif text-2xl leading-none text-sky-950">{formatDayNumber(event.startDate, locale)}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-sky-800">{formatMonthShort(event.startDate, locale)}</span>
                    </time>
                    <div className="min-w-0">
                      <h3 className="font-serif font-normal text-base leading-snug text-sky-950">{localize(event.title, locale)}</h3>
                      <p className="mt-1 text-xs leading-snug text-slate-600">
                        {formatWeekday(event.startDate, locale)}
                        {time && ` · ${t('at', { time })}`}
                        {event.location && ` · ${event.location}`}
                      </p>
                      {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <PartnersPanel partners={partners} kicker={t('partnersKicker')} title={t('partnersTitle')} />
        </aside>
      </div>
    </>
  );
}
