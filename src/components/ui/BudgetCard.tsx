import { getTranslations } from 'next-intl/server';
import { formatAmount } from '@/lib/pricing';
import { localize } from '@/lib/sanity/localize';
import type { PricingBudget } from '@/lib/sanity/types';

interface BudgetCardProps {
  budget: PricingBudget;
  locale: string;
}

/** A sample yearly budget: its lines and their total, added up here so it always matches the lines. */
export default async function BudgetCard({ budget, locale }: BudgetCardProps) {
  const t = await getTranslations('pricingPage');
  const tPricing = await getTranslations('pricing');
  const lines = budget.lines ?? [];
  // In cents, to avoid floating-point drift (0.1 + 0.2)
  const total = lines.reduce((sum, line) => sum + Math.round(line.amount * 100), 0) / 100;
  const euros = (amount: number) => tPricing('amount', { amount: formatAmount(amount, locale) });
  const age = localize(budget.age, locale);

  return (
    <article className="flex flex-col rounded-md bg-blanc p-5 lg:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-display text-lg font-semibold text-azur">{localize(budget.title, locale)}</h3>
        {age && <span className="rounded-xs bg-ciel px-2 py-0.5 text-[0.8125rem] font-medium text-texte">{age}</span>}
      </header>
      <dl className="mt-4 flex flex-col text-[0.9375rem]">
        {lines.map((line) => (
          <div key={line._key} className="flex justify-between gap-4 border-b border-horizon py-2">
            <dt className="text-texte">{localize(line.label, locale)}</dt>
            <dd className="text-nuit tabular-nums">{euros(line.amount)}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 pt-3">
          <dt className="font-semibold text-nuit">{t('total')}</dt>
          <dd className="font-display text-xl font-semibold text-azur tabular-nums">{euros(total)}</dd>
        </div>
      </dl>
    </article>
  );
}
