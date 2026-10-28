import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import Kicker from '@/components/ui/Kicker';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { localize } from '@/lib/sanity/localize';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { LinkGroup, SiteSettings, UsefulLink } from '@/lib/sanity/types';

export const revalidate = 60;

const GROUPS: LinkGroup[] = ['institutions', 'flight-prep', 'weather', 'community'];

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
      <PageHero kicker={t('heroKicker')} title={t('heroTitle')} variant={3} />
      <Section kicker={t('kicker')} title={t('title')}>
        {filled.length === 0 && <EmptyState>{t('empty')}</EmptyState>}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {filled.map((group) => (
            <div key={group.key} className="border-t border-sky-900/15 pt-6">
              <Kicker>{t(`groups.${group.key}`)}</Kicker>
              <ul className="mt-3 space-y-1">
                {group.items.map((link) => (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm leading-relaxed text-sky-900 underline decoration-sky-300 underline-offset-4 hover:text-sky-700 hover:decoration-sky-700"
                    >
                      {localize(link.label, locale)} <span aria-hidden="true">&nbsp;↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
