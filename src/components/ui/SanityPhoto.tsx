import Image from 'next/image';
import clsx from 'clsx';
import GliderSilhouette from '@/components/ui/GliderSilhouette';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImage } from '@/lib/sanity/types';

interface SanityPhotoProps {
  image?: SanityImage;
  /** Shown on the placeholder when there is no photo. */
  label?: string;
  /** Sets the frame's size: the photo fills it. */
  className?: string;
  /** Height / width, to crop around the hotspot chosen in Sanity (0.5625 for 16:9). */
  ratio?: number;
  sizes?: string;
  priority?: boolean;
}

/** A Sanity photo that fills its frame, or a placeholder frame without one. */
export default function SanityPhoto({ image, label, className, ratio, sizes = '100vw', priority = false }: SanityPhotoProps) {
  if (!image?.asset) {
    return (
      <div className={clsx('relative overflow-hidden bg-linear-to-br from-sky-100 via-white to-sky-200', className)}>
        <GliderSilhouette className="absolute bottom-3 right-3 w-1/2 text-azur/20" />
        {label && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border border-azur/15 bg-white/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-azur/70 backdrop-blur">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }

  const base = urlFor(image).width(1600);
  const src = (ratio ? base.height(Math.round(1600 * ratio)).fit('crop') : base).url();

  return (
    <div className={clsx('relative overflow-hidden bg-sky-100', className)}>
      <Image src={src} alt={image.alt ?? ''} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
