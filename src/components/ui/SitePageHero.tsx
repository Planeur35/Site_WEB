import PageHero from '@/components/ui/PageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { PageHeroKey, SiteSettings } from '@/lib/sanity/types';

interface SitePageHeroProps {
  /** Which page this is: the photo comes from Studio → Réglages du site → Photos d’en-tête. */
  page: PageHeroKey;
  kicker: string;
  title: string;
  /** Which sky gradient to draw when the page has no photo. */
  variant?: number;
}

/** PageHero with the page's header photo from Sanity. Without a photo, the sky drawing is shown. */
export default async function SitePageHero({ page, kicker, title, variant }: SitePageHeroProps) {
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  return <PageHero kicker={kicker} title={title} variant={variant} image={settings?.pageHeroes?.[page]} />;
}
