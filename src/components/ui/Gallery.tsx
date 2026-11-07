'use client';

import { useState } from 'react';
import Image from 'next/image';
import LightboxWrapper from '@/components/ui/Lightbox';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images: GalleryImage[];
  /** Accessible label of each photo button ("Agrandir la photo"). */
  openLabel: string;
}

/** Photos in masonry columns, each in its own proportions; a click opens the viewer. */
export default function Gallery({ images, openLabel }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {images.map((image, index) => (
          <li key={image.src} className="mb-3 break-inside-avoid sm:mb-4">
            <figure>
              <button
                type="button"
                className="group block w-full cursor-zoom-in overflow-hidden rounded-md bg-ciel"
                onClick={() => setSelectedIndex(index)}
                aria-label={image.alt ? `${openLabel} : ${image.alt}` : openLabel}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 1024px) 50vw, 400px"
                  className="h-auto w-full transition-transform duration-150 ease-planeur group-hover:scale-[1.03]"
                />
              </button>
              {image.caption && <figcaption className="mt-2 text-sm text-brume">{image.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <LightboxWrapper
        slides={images.map(({ src, alt, width, height }) => ({ src, alt, width, height }))}
        open={selectedIndex >= 0}
        index={selectedIndex >= 0 ? selectedIndex : 0}
        onClose={() => setSelectedIndex(-1)}
      />
    </>
  );
}
