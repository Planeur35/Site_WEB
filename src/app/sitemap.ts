import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { sanityFetch } from '@/lib/sanity/fetch';
import { allArticlesQuery } from '@/lib/sanity/queries';
import type { Article } from '@/lib/sanity/types';

export const revalidate = 60;

const BASE_URL = 'https://www.planeur35.org';

// Priority mapping based on page depth/importance
const priorityMap: Record<string, number> = {
  '/': 1.0,
  '/decouvrir': 0.9,
  '/club': 0.8,
  '/adherer': 0.8,
  '/actualites': 0.8,
  '/planeurs': 0.7,
  '/contact': 0.7,
  '/recits': 0.6,
  '/galerie': 0.6,
  '/webcam': 0.5,
  '/liens': 0.5,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for both locales
  for (const [key, value] of Object.entries(routing.pathnames)) {
    // Skip dynamic routes like /actualites/[slug]
    if (key.includes('[')) continue;

    const priority = priorityMap[key] ?? 0.5;
    const changeFrequency = priority >= 0.8 ? 'weekly' : 'monthly';

    for (const locale of routing.locales) {
      const localePath =
        typeof value === 'string'
          ? value
          : (value as Record<string, string>)[locale] || key;

      entries.push({
        url: `${BASE_URL}/${locale}${localePath === '/' ? '' : localePath}`,
        lastModified: new Date(),
        changeFrequency: changeFrequency as 'weekly' | 'monthly',
        priority,
      });
    }
  }

  // Dynamic article pages
  const articles = await sanityFetch<Article[]>(allArticlesQuery, []);

  for (const article of articles) {
    const slug = article.slug.current;

    for (const locale of routing.locales) {
      const pathConfig = routing.pathnames['/actualites/[slug]'];
      const basePath =
        typeof pathConfig === 'string'
          ? pathConfig
          : (pathConfig as Record<string, string>)[locale];
      const articlePath = basePath.replace('[slug]', slug);

      entries.push({
        url: `${BASE_URL}/${locale}${articlePath}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
