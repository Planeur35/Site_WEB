import { ChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import PriceCell from '@/components/ui/PriceCell';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import type { LocalizedText, PricingItem } from '@/lib/sanity/types';

interface PricingItemRowProps {
  item: PricingItem;
  locale: string;
  /** Captions of the two age columns, from the section (« Moins de 25 ans »…). */
  ages: [string, string];
  /** The section shows the two age columns: a single price is then centred across both, as it applies to every age. */
  ageColumns?: boolean;
}

/** Shared grid of the price list: the service, then the two age columns (lg: fixed widths so every row lines up). */
export const PRICING_GRID = 'lg:grid lg:grid-cols-[minmax(0,1fr)_12rem_12rem] lg:gap-x-10';

/** One service of the price list: name, description, what it includes, conditions, and its price(s). */
export default async function PricingItemRow({ item, locale, ages, ageColumns = false }: PricingItemRowProps) {
  const t = await getTranslations('pricingPage');
  const text = (field?: LocalizedText) => localize(field, locale);
  const lang = (field?: LocalizedText) => (isFrenchFallback(field, locale) ? 'fr' : undefined);
  const description = text(item.description);
  const includes = text(item.includes);
  const excludes = text(item.excludes);
  const conditions = text(item.conditions);

  return (
    <div className={`grid gap-4 border-t border-horizon py-6 first:border-t-0 lg:py-7 ${PRICING_GRID}`}>
      <div className="min-w-0">
        <h4 lang={lang(item.name)} className="font-display text-lg leading-snug font-semibold text-azur lg:text-xl">
          {text(item.name)}
        </h4>
        {description && (
          <p lang={lang(item.description)} className="mt-1.5 max-w-[640px] text-[0.9375rem] leading-[1.55] text-texte">
            {description}
          </p>
        )}
      </div>

      {item.mode === 'ages' && (
        // Phones: the two prices side by side, each captioned with its age
        <div className="grid grid-cols-2 gap-4 lg:contents">
          <PriceCell cell={item.under25} locale={locale} caption={ages[0]} className="lg:row-span-2 lg:items-end lg:text-right" />
          <PriceCell cell={item.over25} locale={locale} caption={ages[1]} className="lg:row-span-2 lg:items-end lg:text-right" />
        </div>
      )}
      {item.mode === 'single' && (
        <PriceCell
          cell={item.price}
          locale={locale}
          className={ageColumns ? 'lg:col-span-2 lg:row-span-2 lg:items-center lg:text-center' : 'lg:col-span-2 lg:row-span-2 lg:items-end lg:text-right'}
        />
      )}
      {item.mode === 'options' && (
        <ul className="flex flex-col divide-y divide-horizon rounded-sm bg-blanc px-4 lg:col-span-2 lg:row-span-2 lg:self-start">
          {item.options?.map((option) => (
            <li key={option._key} className="flex items-baseline justify-between gap-4 py-2.5">
              <span lang={lang(option.label)} className="text-sm text-texte">
                {text(option.label)}
              </span>
              <PriceCell cell={option.price} locale={locale} size="sm" className="items-end text-right" />
            </li>
          ))}
        </ul>
      )}
      {/* The small print, folded away so the name, description and price stand out.
          Phones: after the prices; wide screens: under the description, the prices spanning both rows */}
      {(includes || excludes || conditions) && (
        <details className="group order-last -mt-2 max-w-[640px] lg:order-none lg:col-start-1">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-altitude [&::-webkit-details-marker]:hidden">
            {t('details')}
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="shrink-0 transition-transform duration-150 ease-planeur group-open:rotate-180"
            />
          </summary>
          <dl className="flex flex-col gap-1.5 border-l-2 border-horizon pb-1 pl-4 text-sm leading-[1.5] text-texte">
            {includes && (
              <div lang={lang(item.includes)}>
                <dt className="inline font-semibold text-nuit">{t('includes')} </dt>
                <dd className="inline">{includes}</dd>
              </div>
            )}
            {excludes && (
              <div lang={lang(item.excludes)}>
                <dt className="inline font-semibold text-nuit">{t('excludes')} </dt>
                <dd className="inline">{excludes}</dd>
              </div>
            )}
            {conditions && (
              <div lang={lang(item.conditions)}>
                <dt className="sr-only">{t('conditions')}</dt>
                <dd className="text-[0.8125rem] leading-snug text-brume">{conditions}</dd>
              </div>
            )}
          </dl>
        </details>
      )}
    </div>
  );
}
