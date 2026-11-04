'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import SanityPhoto from '@/components/ui/SanityPhoto';
import FlightTrace from '@/components/ui/FlightTrace';
import type { SanityImage } from '@/lib/sanity/types';

export interface Slide {
  key: string;
  image?: SanityImage;
  title: string;
  subtitle?: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
  kicker: string;
}

const INTERVAL_MS = 6000;

/** Home page photos, cross-fading every 6 seconds (paused for reduced motion). */
export default function HeroSlideshow({ slides, kicker }: HeroSlideshowProps) {
  const t = useTranslations('home');
  const [current, setCurrent] = useState(0);
  const [cycle, setCycle] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(next, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [next, slides.length, cycle]);

  return (
    <section className="relative h-[82vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, i) => {
        const Title = i === 0 ? 'h1' : 'p';
        return (
          <div
            key={slide.key}
            className={clsx('absolute inset-0 transition-opacity duration-1000', i === current ? 'opacity-100' : 'opacity-0')}
            aria-hidden={i !== current}
          >
            {slide.image?.asset ? (
              <SanityPhoto image={slide.image} className="absolute! inset-0" priority={i === 0} />
            ) : (
              <FlightTrace seed={slide.key} className="absolute! inset-0" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-nuit/60 via-nuit/10 to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8 lg:px-10">
              <div className="max-w-2xl">
                <p className="mb-3 font-display text-base font-semibold text-white">{kicker}</p>
                <Title className="font-display text-[3rem] leading-[1.02] font-semibold tracking-titre text-white lg:text-display">{slide.title}</Title>
                {slide.subtitle && <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90">{slide.subtitle}</p>}
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20">
          <div className="mx-auto flex max-w-7xl gap-1 px-5 sm:px-8 lg:px-10">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                className="cursor-pointer px-1 py-5"
                aria-label={t('slideLabel', { n: i + 1 })}
                aria-current={i === current}
                onClick={() => {
                  setCurrent(i);
                  setCycle((c) => c + 1);
                }}
              >
                <span className={clsx('block h-px bg-white transition-all duration-500', i === current ? 'w-14' : 'w-7 opacity-50')} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
