'use client';

import { useState } from 'react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            className="rounded-lg overflow-hidden aspect-video relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
