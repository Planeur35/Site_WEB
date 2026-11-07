import Image from 'next/image';
import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import { imageDimensions, urlFor } from '@/lib/sanity/image';
import type { SanityImage } from '@/lib/sanity/types';

interface TrainingPathProps {
  /** The training section's `diagram`: when an editor has uploaded one, it replaces the drawn path. */
  diagram?: SanityImage;
}

const STEPS = [1, 2, 3, 4, 5] as const;

// Dots on the rising line of the 200 px track (centres at 10 %, 30 %… and 180, 140… px)
const DOTS = [
  'left-[calc(10%-9px)] top-[171px]',
  'left-[calc(30%-9px)] top-[131px]',
  'left-[calc(50%-9px)] top-[91px]',
  'left-[calc(70%-9px)] top-[51px]',
  'left-[calc(90%-11px)] top-[9px]',
];

const stepTitle = 'font-display text-lg leading-[1.25] font-semibold text-azur lg:text-[1.1875rem]';
const stepText = 'text-[0.9375rem] leading-[1.5] text-texte';

/** Le club, training: the path from the trial flight to the badges, drawn as a climb. */
export default async function TrainingPath({ diagram }: TrainingPathProps) {
  const t = await getTranslations('club');

  if (diagram?.asset) {
    return (
      <figure className="rounded-md bg-blanc p-4 lg:p-8">
        <Image
          src={urlFor(diagram).width(1600).url()}
          alt={diagram.alt ?? t('pathTitle')}
          {...imageDimensions(diagram.asset._ref)}
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="h-auto w-full"
        />
      </figure>
    );
  }

  const last = STEPS.length - 1;

  return (
    <>
      {/* Large screens: a line climbing left to right, one dot per step */}
      <figure className="hidden rounded-md bg-blanc px-8 pt-10 pb-8 lg:block">
        <figcaption className="mb-2 font-display text-lg font-semibold text-azur">{t('pathTitle')}</figcaption>
        <div className="relative h-[200px]" aria-hidden="true">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <path
              d="M0 196 L100 180"
              className="fill-none stroke-altitude"
              strokeOpacity={0.4}
              strokeWidth={1.5}
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M100 180 L300 140 L500 100 L700 60 L900 20"
              className="fill-none stroke-altitude"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M900 20 L1000 6"
              className="fill-none stroke-balise"
              strokeWidth={2}
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {DOTS.map((position, i) => (
            <span
              key={position}
              className={clsx(
                'absolute rounded-full',
                position,
                i === last ? 'size-[22px] bg-balise ring-6 ring-balise/15' : 'size-[18px] bg-blanc inset-ring-3 inset-ring-altitude',
              )}
            />
          ))}
        </div>
        <ol className="mt-6 grid grid-cols-5 gap-x-4">
          {STEPS.map((n, i) => (
            <li key={n} className="flex flex-col items-center gap-2 text-center">
              <span className={clsx('font-display text-sm font-semibold', i === last ? 'text-balise' : 'text-brume')}>
                {i === last ? t('pathNext') : t('pathStepLabel', { n })}
              </span>
              <h3 className={stepTitle}>{t(`pathStep${n}Title`)}</h3>
              <p className={stepText}>{t(`pathStep${n}Text`)}</p>
            </li>
          ))}
        </ol>
      </figure>

      {/* Phones: read bottom to top, like a climb in a thermal; the DOM order stays step 1 → 5 */}
      <ol aria-label={t('pathTitle')} className="flex flex-col-reverse rounded-md bg-blanc px-5 py-6 lg:hidden">
        {STEPS.map((n, i) => (
          <li key={n} className="grid grid-cols-[28px_1fr] gap-x-3.5">
            <span className="flex flex-col items-center" aria-hidden="true">
              <span
                className={clsx(
                  'shrink-0 rounded-full',
                  i === last ? 'mt-px size-5 bg-balise ring-5 ring-balise/15' : 'mt-[3px] size-4 bg-blanc inset-ring-3 inset-ring-altitude',
                )}
              />
              {/* The line runs down to the step below */}
              {i > 0 && <span className="min-h-5 w-0.5 flex-1 bg-altitude" />}
            </span>
            <div className={clsx('flex flex-col gap-1', i > 0 && 'pb-[22px]')}>
              <h3 className={stepTitle}>{t(`pathStep${n}Title`)}</h3>
              <p className={stepText}>{t(`pathStep${n}Text`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
