import Image from 'next/image';
import clsx from 'clsx';
import FlightTrace from '@/components/ui/FlightTrace';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImage } from '@/lib/sanity/types';

interface SanityPhotoProps {
  image?: SanityImage;
  /** Seeds the flight trace shown when there is no photo (usually the item's title). */
  label?: string;
  /** Sets the frame's size: the photo fills it. Rounded 6 px unless overridden. */
  className?: string;
  /** Height / width, to crop around the hotspot chosen in Sanity (0.5625 for 16:9). */
  ratio?: number;
  sizes?: string;
  priority?: boolean;
  /** Small square frame: the trace is cropped so the spiral fills it. */
  thumbnail?: boolean;
}

/** A Sanity photo that fills its frame, or the flight trace placeholder without one. */
export default function SanityPhoto({
  image,
  label,
  className,
  ratio,
  sizes = '100vw',
  priority = false,
  thumbnail = false,
}: SanityPhotoProps) {
  const frame = clsx('rounded-md', className);

  if (!image?.asset) {
    return <FlightTrace seed={label ?? 'piv'} className={frame} thumbnail={thumbnail} />;
  }

  const base = urlFor(image).width(1600);
  const src = (ratio ? base.height(Math.round(1600 * ratio)).fit('crop') : base).url();

  return (
    <div className={clsx('relative overflow-hidden bg-ciel', frame)}>
      <Image src={src} alt={image.alt ?? ''} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
