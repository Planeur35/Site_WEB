import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import NewsRow from '@/components/ui/NewsRow';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import { formatDayNumber, formatMonthShort, formatTime, formatWeekday, startOfToday } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { allArticlesQuery, upcomingEventsQuery } from '@/lib/sanity/queries';
import type { Article, ClubEvent } from '@/lib/sanity/types';

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

  const [articles, events] = await Promise.all([
    sanityFetch<Article[]>(allArticlesQuery, []),
    sanityFetch<ClubEvent[]>(upcomingEventsQuery, [], { since: startOfToday() }),
  ]);

  return (
    <>
      <PageHero kicker={t('heroKicker')} title={t('heroTitle')} variant={0} />

      <Section id="news" kicker={t('listKicker')} title={t('listTitle')}>
        {articles.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
        <div className="border-t border-sky-900/15">
          {articles.map((article) => (
            <NewsRow key={article._id} article={article} />
          ))}
        </div>
      </Section>

      <Section id="agenda" kicker={t('agendaKicker')} title={t('agendaTitle')}>
        {events.length === 0 && <EmptyState>{t('agendaEmpty')}</EmptyState>}
        <ul className="border-t border-sky-900/15">
          {events.map((event) => {
            const time = formatTime(event.startDate, locale);
            const description = localize(event.description, locale);
            return (
              <li key={event._id} className="flex items-start gap-6 border-b border-sky-900/15 px-2 py-6 sm:gap-8">
                <time dateTime={event.startDate} className="w-14 shrink-0 text-center">
                  <span className="block font-serif text-2xl leading-none text-sky-950">{formatDayNumber(event.startDate, locale)}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-sky-800">{formatMonthShort(event.startDate, locale)}</span>
                </time>
                <div>
                  <h3 className="font-serif text-lg leading-snug text-sky-950">{localize(event.title, locale)}</h3>
                  <p className="mt-1 text-xs tracking-wide text-slate-600">
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
      </Section>
    </>
  );
}
