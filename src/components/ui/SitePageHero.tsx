import PageHero from '@/components/ui/PageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { PageHeroKey, SiteSettings } from '@/lib/sanity/types';

interface SitePageHeroProps {
  /** Which page this is: the photo comes from Studio → Réglages du site → Photos d’en-tête. */
  page: PageHeroKey;
  kicker: string;
  title: string;
  lead?: string;
}

/** PageHero with the page's header photo from Sanity. Without a photo, the header ends after the text. */
export default async function SitePageHero({ page, kicker, title, lead }: SitePageHeroProps) {
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  return <PageHero kicker={kicker} title={title} lead={lead} image={settings?.pageHeroes?.[page]} />;
}
