import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import AgendaItem from '@/components/ui/AgendaItem';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import Kicker from '@/components/ui/Kicker';
import NewsRow from '@/components/ui/NewsRow';
import SitePageHero from '@/components/ui/SitePageHero';
import { startOfToday } from '@/lib/format';
import { sanityFetch } from '@/lib/sanity/fetch';
import { allArticlesQuery, upcomingEventsQuery } from '@/lib/sanity/queries';
import type { Article, ClubEvent } from '@/lib/sanity/types';

// Also drops past events from the agenda without a rebuild
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.news' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/actualites' });
}

const columnTitle = 'font-display text-[1.875rem] leading-[1.12] font-semibold text-azur';

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
      <SitePageHero page="news" kicker={t('heroKicker')} title={t('heroTitle')} />

      {/* News on the left (8 columns), the agenda beside it from lg; stacked on phones, agenda after */}
      <Container className="py-16 lg:py-28">
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          <section id="news" className="min-w-0 scroll-mt-36 lg:col-span-8">
            <Kicker>{t('listKicker')}</Kicker>
            <h2 className={`${columnTitle} lg:text-h2`}>{t('listTitle')}</h2>
            <div className="mt-7 lg:mt-10">
              {articles.length === 0 ? (
                <EmptyState seed="actualites">{t('empty')}</EmptyState>
              ) : (
                // Phones: white cards on a pale sky band; from sm, rows divided by hairlines
                <div className="-mx-5 flex flex-col gap-3 bg-ciel px-5 py-5 sm:mx-0 sm:gap-0 sm:bg-transparent sm:p-0">
                  {articles.map((article) => (
                    <NewsRow key={article._id} article={article} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section id="agenda" className="min-w-0 scroll-mt-36 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Kicker>{t('agendaKicker')}</Kicker>
              <h2 className={`${columnTitle} lg:text-[2rem]`}>{t('agendaTitle')}</h2>
              {events.length === 0 ? (
                <p className="mt-7 rounded-md bg-blanc p-5 text-texte inset-ring inset-ring-horizon lg:mt-10">
                  {t('agendaEmpty')}
                </p>
              ) : (
                <ul className="mt-7 flex flex-col gap-3 lg:mt-10">
                  {events.map((event) => (
                    <AgendaItem key={event._id} event={event} locale={locale} />
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
