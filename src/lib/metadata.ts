import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';

const SITE_NAME = "PIV, Planeurs d'Ille-et-Vilaine";
const BASE_URL = 'https://www.planeur35.org';

type Href = Parameters<typeof getPathname>[0]['href'];

/** Full address of a page, from its French pathname. */
export function absoluteUrl(href: Href, locale: string): string {
  return `${BASE_URL}${getPathname({ href, locale })}`;
}

/** Title, Open Graph, canonical and hreflang links of a page, from its French pathname. */
export function buildMetadata({
  title,
  description,
  locale,
  pathname,
  image,
}: {
  title: string;
  description: string;
  locale: string;
  pathname: Href;
  /** Full address of the image shown when the link is shared. */
  image?: string;
}): Metadata {
  const url = absoluteUrl(pathname, locale);
  const images = [image ?? `${BASE_URL}/logo.png`];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    alternates: {
      canonical: url,
      languages: {
        fr: absoluteUrl(pathname, 'fr'),
        en: absoluteUrl(pathname, 'en'),
      },
    },
  };
}
