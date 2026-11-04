'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import { prefersReducedMotion } from '@/lib/useInView';
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
  cta: string;
  /** Trial flight price line; hidden when the tariffs are not in the Studio. */
  price: React.ReactNode | null;
}

/** Time each photo stays on screen. */
const INTERVAL_MS = 7000;

const pad = (n: number) => String(n).padStart(2, '0');

// Display is set per button: the previous and next buttons are hidden on phones
const iconButton =
  'size-11 cursor-pointer items-center justify-center rounded-sm text-azur transition-colors duration-150 hover:bg-ciel';

/**
 * Home hero: title and call to action on white, then the photo below, cross-fading every 7 seconds.
 * The first slide's title is the page's h1; the others are stacked in the same place.
 */
export default function HeroSlideshow({ slides, kicker, cta, price }: HeroSlideshowProps) {
  const t = useTranslations('home');
  const [current, setCurrent] = useState(0);
  // Starts paused: autoplay is switched on after mount, unless the visitor prefers reduced motion
  const [playing, setPlaying] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count > 1 && !prefersReducedMotion()) setPlaying(true);
  }, [count]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setCurrent((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, current, count]);

  const go = (step: number) => setCurrent((i) => (i + step + count) % count);

  return (
    <section aria-roledescription="carrousel" aria-label={t('slidesLabel')} className="pt-10 lg:pt-14">
      <Container>
        <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
          <div className="min-w-0 flex-[999_1_560px]">
            <Kicker>{kicker}</Kicker>
            <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              {slides.map((slide, i) => {
                // Only the first title is a heading, and the one screen readers get
                const Title = i === 0 ? 'h1' : 'p';
                return (
                  <Title
                    key={slide.key}
                    aria-hidden={i === 0 ? undefined : true}
                    className={clsx(
                      'font-display text-[3rem] leading-[1.02] font-semibold tracking-titre text-balance text-azur transition-opacity duration-[1200ms] ease-planeur lg:text-display',
                      i === current ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {slide.title}
                  </Title>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-6 lg:pb-1.5">
            <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              {slides.map((slide, i) =>
                slide.subtitle ? (
                  <p
                    key={slide.key}
                    aria-hidden={i === 0 ? undefined : true}
                    className={clsx(
                      'text-[1.1875rem] leading-[1.55] text-texte transition-opacity duration-[1200ms] ease-planeur lg:text-lead',
                      i === current ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {slide.subtitle}
                  </p>
                ) : null,
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button href="/decouvrir" size="lg" className="w-full sm:w-auto">
                {cta}
              </Button>
              {price && <p className="w-full text-center text-[0.9375rem] text-texte sm:w-auto sm:text-left">{price}</p>}
            </div>
          </div>
        </div>

        <div className="relative mt-10 h-[420px] overflow-hidden rounded-md bg-horizon sm:h-[clamp(320px,44vw,600px)] lg:mt-12">
          {slides.map((slide, i) => (
            <div
              key={slide.key}
              aria-hidden={i === current ? undefined : true}
              className={clsx(
                'absolute inset-0 transition-[opacity,scale] ease-planeur',
                i === current ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
              )}
              // Cross-fade in 1.2 s; the incoming photo settles from 1.04 to 1 over the whole interval
              style={{ transitionDuration: `1200ms, ${INTERVAL_MS}ms` }}
            >
              <SanityPhoto
                image={slide.image}
                label={slide.key}
                className="size-full rounded-none"
                sizes="(max-width: 1280px) 100vw, 1200px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex min-w-0 items-center gap-4">
              <p className="font-display text-[0.9375rem] font-semibold text-azur tabular-nums">
                <span aria-hidden="true">
                  {pad(current + 1)} <span className="font-medium text-brume">/ {pad(count)}</span>
                </span>
                <span className="sr-only">{t('slideCounter', { n: current + 1, total: count })}</span>
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {slides.map((slide, i) => (
                  <span key={slide.key} className="block h-[3px] w-8 overflow-hidden rounded-xs bg-horizon sm:w-14">
                    {i === current && (
                      <span
                        // Restarts with each slide, and with play
                        key={`${current}-${playing}`}
                        className={clsx('block h-full origin-left bg-balise', playing && 'animate-jauge')}
                        style={playing ? { animationDuration: `${INTERVAL_MS}ms` } : undefined}
                      />
                    )}
                  </span>
                ))}
              </div>
              {slides[current].image?.alt && (
                <span className="hidden truncate text-[0.9375rem] text-brume md:inline" aria-hidden="true">
                  {slides[current].image?.alt}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className={clsx(iconButton, 'inline-flex')}
                onClick={() => setPlaying((was) => !was)}
                aria-label={playing ? t('slidePause') : t('slidePlay')}
              >
                {playing ? <Pause size={20} strokeWidth={2} aria-hidden="true" /> : <Play size={20} strokeWidth={2} aria-hidden="true" />}
              </button>
              <button type="button" className={clsx(iconButton, 'hidden sm:inline-flex')} onClick={() => go(-1)} aria-label={t('slidePrev')}>
                <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
              </button>
              <button type="button" className={clsx(iconButton, 'hidden sm:inline-flex')} onClick={() => go(1)} aria-label={t('slideNext')}>
                <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
