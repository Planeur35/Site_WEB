import type { Metadata } from 'next';

const SITE_NAME = "Planeurs d'Ille-et-Vilaine";
const BASE_URL = 'https://www.planeur35.org';

export function buildMetadata({
  title,
  description,
  locale,
  pathname,
}: {
  title: string;
  description: string;
  locale: string;
  pathname: string;
}): Metadata {
  const url = `${BASE_URL}/${locale}${pathname}`;
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        fr: `${BASE_URL}/fr${pathname}`,
        en: `${BASE_URL}/en${pathname}`,
      },
    },
  };
}
