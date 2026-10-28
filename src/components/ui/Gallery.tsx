'use client';

import { useState } from 'react';
import Image from 'next/image';
import LightboxWrapper from '@/components/ui/Lightbox';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-px border border-sky-900/10 bg-sky-900/10 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden bg-sky-100"
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-sky-950/0 transition-colors duration-300 group-hover:bg-sky-950/15" />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-sky-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm text-left">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <LightboxWrapper
        slides={slides}
        open={selectedIndex >= 0}
        index={selectedIndex >= 0 ? selectedIndex : 0}
        onClose={() => setSelectedIndex(-1)}
      />
    </>
  );
}
