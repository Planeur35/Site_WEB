import Image from 'next/image';
import clsx from 'clsx';
import { imageDimensions, urlFor } from '@/lib/sanity/image';
import type { Partner } from '@/lib/sanity/types';

interface PartnerLogoProps {
  partner: Partner;
  /** Height of a wide logo; square and tall ones get a third more so they read at the same weight. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the link, e.g. "Site de la FFVP". */
  linkLabel?: string;
  className?: string;
}

const HEIGHTS = {
  sm: { wide: 'h-12', square: 'h-16' },
  md: { wide: 'h-16', square: 'h-20' },
  lg: { wide: 'h-20', square: 'h-28' },
};

/** A partner's logo in its own colours, never cropped, linked to the partner's site when there is one. */
export default function PartnerLogo({ partner, size = 'sm', linkLabel, className }: PartnerLogoProps) {
  const { width, height } = imageDimensions(partner.logo.asset?._ref);
  const square = width / height < 1.4;
  const image = (
    <Image
      src={urlFor(partner.logo).url()}
      alt={partner.name}
      width={width}
      height={height}
      sizes="240px"
      className={clsx('w-auto max-w-[180px] object-contain', HEIGHTS[size][square ? 'square' : 'wide'])}
    />
  );
  if (!partner.url) return <span className={clsx('inline-flex', className)}>{image}</span>;
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={linkLabel}
      title={partner.name}
      className={clsx('inline-flex rounded-sm transition-opacity duration-150 hover:opacity-80', className)}
    >
      {image}
    </a>
  );
}
