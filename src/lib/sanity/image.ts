import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** Original size of a Sanity image, read from its asset id (image-<hash>-1200x800-jpg). */
export function imageDimensions(ref: string | undefined): { width: number; height: number } {
  const match = /-(\d+)x(\d+)-/.exec(ref ?? '');
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1200, height: 800 };
}
