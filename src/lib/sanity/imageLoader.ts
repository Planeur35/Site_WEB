import type { ImageLoaderProps } from 'next/image';

/**
 * next/image loader. Sanity's CDN resizes and converts images itself, so we only
 * swap the width (keeping the crop ratio) instead of going through the host's image
 * optimiser, which is metered on free plans.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/')) {
    // Files in /public are served as they are
    return `${src}?w=${width}`;
  }
  const url = new URL(src);
  const w = Number(url.searchParams.get('w'));
  const h = Number(url.searchParams.get('h'));
  url.searchParams.set('w', String(width));
  if (w && h) url.searchParams.set('h', String(Math.round((h * width) / w)));
  url.searchParams.set('q', String(quality ?? 80));
  if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format');
  return url.toString();
}
