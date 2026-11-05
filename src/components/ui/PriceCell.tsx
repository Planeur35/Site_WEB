import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import PriceNote from '@/components/ui/PriceNote';
import { formatAmount } from '@/lib/pricing';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import type { PriceCellValue } from '@/lib/sanity/types';

interface PriceCellProps {
  cell?: PriceCellValue;
  locale: string;
  /** Age column shown under the price on phones, where the column headers are hidden. */
  caption?: string;
  /** Wide screens: right-aligned under the column headers. */
  className?: string;
  size?: 'md' | 'sm';
}

/**
 * One price of the price list: « à partir de », the amount and its unit, or a text such as « Non applicable »,
 * then its note. The amount always comes first, so notes and captions never shift the prices.
 */
export default async function PriceCell({ cell, locale, caption, className, size = 'md' }: PriceCellProps) {
  const t = await getTranslations('pricingPage');
  const tPricing = await getTranslations('pricing');
  const label = localize(cell?.label, locale);
  const unit = localize(cell?.unit, locale);
  const note = localize(cell?.note, locale);
  const hasAmount = cell?.amount != null;

  return (
    <div className={clsx('flex min-w-0 flex-col', className)}>
      {hasAmount && cell?.from && <span className="text-[0.8125rem] leading-snug text-brume">{t('from')}</span>}
      {hasAmount ? (
        <p className="font-display leading-none font-semibold whitespace-nowrap text-azur tabular-nums">
          <span className={size === 'md' ? 'text-2xl lg:text-[1.625rem]' : 'text-lg'}>
            {tPricing('amount', { amount: formatAmount(cell!.amount!, locale) })}
          </span>
        </p>
      ) : (
        <p className="text-[0.9375rem] font-medium text-brume">{label ?? '–'}</p>
      )}
      {/* Under the amount, so a unit never pushes its price out of line with the others */}
      {hasAmount && unit && <span className="mt-1 text-[0.8125rem] leading-snug text-brume">{unit}</span>}
      {caption && <span className="mt-1 text-sm text-texte lg:hidden">{caption}</span>}
      {note && <PriceNote lang={isFrenchFallback(cell?.note, locale) ? 'fr' : undefined}>{note}</PriceNote>}
    </div>
  );
}
