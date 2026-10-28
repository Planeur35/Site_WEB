'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import SkyVisual from '@/components/ui/SkyVisual';
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
              <SkyVisual variant={i} />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-sky-950/60 via-sky-950/10 to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-4 sm:px-6 md:px-8">
              <div className="max-w-2xl">
                <Kicker light>{kicker}</Kicker>
                <Title className="font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">{slide.title}</Title>
                {slide.subtitle && <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90">{slide.subtitle}</p>}
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20">
          <div className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6 md:px-8">
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
