import { getTranslations } from 'next-intl/server';
import PriceCell from '@/components/ui/PriceCell';
import PriceNote from '@/components/ui/PriceNote';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import type { LocalizedText, PricingItem } from '@/lib/sanity/types';

interface PricingItemRowProps {
  item: PricingItem;
  locale: string;
}

/** Shared grid of the price list: the service, then the two age columns (lg: fixed widths so every row lines up). */
export const PRICING_GRID = 'lg:grid lg:grid-cols-[minmax(0,1fr)_12rem_12rem] lg:gap-x-10';

/** One service of the price list: name, description, what it includes, conditions, and its price(s). */
export default async function PricingItemRow({ item, locale }: PricingItemRowProps) {
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
        {(includes || excludes) && (
          <dl className="mt-3 flex max-w-[640px] flex-col gap-1.5 text-sm leading-[1.5] text-texte">
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
          </dl>
        )}
        {conditions && <PriceNote lang={lang(item.conditions)} className="max-w-[640px]">{conditions}</PriceNote>}
      </div>

      {item.mode === 'ages' && (
        // Phones: the two prices side by side, each captioned with its age
        <div className="grid grid-cols-2 gap-4 lg:contents">
          <PriceCell cell={item.under25} locale={locale} caption={t('under25')} className="lg:items-end lg:text-right" />
          <PriceCell cell={item.over25} locale={locale} caption={t('over25')} className="lg:items-end lg:text-right" />
        </div>
      )}
      {item.mode === 'single' && (
        <PriceCell cell={item.price} locale={locale} className="lg:col-span-2 lg:items-end lg:text-right" />
      )}
      {item.mode === 'options' && (
        <ul className="flex flex-col divide-y divide-horizon rounded-sm bg-blanc px-4 lg:col-span-2 lg:self-start">
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
    </div>
  );
}
