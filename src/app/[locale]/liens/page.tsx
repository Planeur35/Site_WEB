import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { LinkGroup, SiteSettings, UsefulLink } from '@/lib/sanity/types';

export const revalidate = 60;

const GROUPS: LinkGroup[] = ['institutions', 'flight-prep', 'weather', 'competitions', 'accommodation', 'community'];

/** "meteofrance.com": the address without protocol or "www.", shown under each link. */
function domain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.links' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/liens' });
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('links');
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);

  const links = settings?.usefulLinks ?? [];
  const groups: { key: string; items: UsefulLink[] }[] = GROUPS.map((key) => ({
    key,
    items: links.filter((l) => l.group === key),
  }));
  groups.push({ key: 'other', items: links.filter((l) => !l.group || !GROUPS.includes(l.group)) });
  const filled = groups.filter((g) => g.items.length > 0);

  return (
    <>
      <SitePageHero page="links" kicker={t('heroKicker')} title={t('heroTitle')} />
      <Section kicker={t('kicker')} title={t('title')}>
        {filled.length === 0 && <EmptyState seed="liens">{t('empty')}</EmptyState>}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {filled.map((group) => (
            <section key={group.key} className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-azur">{t(`groups.${group.key}`)}</h3>
              <ul className="mt-3 border-t border-horizon">
                {group.items.map((link) => (
                  <li key={link._key} className="border-b border-horizon">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-14 items-center justify-between gap-3 py-2"
                    >
                      <span className="min-w-0">
                        <span className="block leading-snug font-semibold text-azur decoration-2 underline-offset-4 group-hover:underline">
                          {localize(link.label, locale)}
                        </span>
                        <span className="block truncate text-sm text-brume">{domain(link.url)}</span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 text-altitude transition-transform duration-150 ease-planeur group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
