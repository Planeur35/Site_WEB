import PageHero from '@/components/ui/PageHero';
import { sanityFetch } from '@/lib/sanity/fetch';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { PageHeroKey, SanityImage, SiteSettings } from '@/lib/sanity/types';

type PageHeroProps = React.ComponentProps<typeof PageHero>;

interface SitePageHeroProps extends Omit<PageHeroProps, 'image'> {
  /** Which page this is: the photo comes from Studio → Réglages du site → Photos d’en-tête. */
  page: PageHeroKey;
  /** Photo to show when none is set for this page in the Studio. */
  fallbackImage?: SanityImage;
}

/** PageHero with the page's header photo from Sanity. Without a photo, the header ends after the text. */
export default async function SitePageHero({ page, fallbackImage, ...props }: SitePageHeroProps) {
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  return <PageHero {...props} image={settings?.pageHeroes?.[page] ?? fallbackImage} />;
}
