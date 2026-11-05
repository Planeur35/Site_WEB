import { getTranslations } from 'next-intl/server';
import PriceNote from '@/components/ui/PriceNote';
import { formatAmount } from '@/lib/pricing';

export interface PriceRow {
  key: string;
  name: string;
  /** What the offer includes or requires, under its name, as a PriceNote like every price condition. */
  details?: string;
  /** One price per column; a missing one reads "Sur demande". */
  prices: (number | undefined)[];
}

interface PriceTableProps {
  caption: string;
  /** Header of the first column ("Forfait"). */
  offerLabel: string;
  /** One per price column, e.g. the age categories. */
  columns: string[];
  rows: PriceRow[];
  locale: string;
}

const priceStyle = 'font-display font-semibold text-azur tabular-nums';

/** Prices from the `tariff` documents: a table from md, one block per offer on phones. */
export default async function PriceTable({ caption, offerLabel, columns, rows, locale }: PriceTableProps) {
  const t = await getTranslations('pricing');
  const price = (amount?: number) => (amount == null ? t('onRequest') : t('amount', { amount: formatAmount(amount, locale) }));

  return (
    <div className="rounded-md bg-ciel px-5 pt-2 pb-5 md:px-8 md:pt-3 md:pb-7">
      <table className="hidden w-full border-collapse md:table">
        <caption className="pt-5 pb-2 text-left font-display text-[1.375rem] font-semibold text-azur">{caption}</caption>
        <thead>
          <tr className="border-b border-horizon text-sm font-semibold text-brume">
            <th scope="col" className="py-3.5 text-left font-semibold">
              {offerLabel}
            </th>
            {columns.map((col) => (
              <th key={col} scope="col" className="py-3.5 pl-6 text-right font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-horizon last:border-b-0">
              <th scope="row" className="py-[22px] text-left font-normal">
                <span className="block font-display text-xl font-semibold text-azur">{row.name}</span>
                {row.details && <PriceNote>{row.details}</PriceNote>}
              </th>
              {row.prices.map((amount, i) => (
                <td
                  key={columns[i]}
                  className={`py-[22px] pl-6 text-right ${amount == null ? 'text-base font-medium text-brume' : `text-[1.75rem] ${priceStyle}`}`}
                >
                  {price(amount)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phones: one block per offer, the prices side by side */}
      <div className="md:hidden">
        <h3 className="pt-4 pb-1 font-display text-xl font-semibold text-azur">{caption}</h3>
        {rows.map((row) => (
          <div key={row.key} className="border-b border-horizon py-5 last:border-b-0">
            <p className="font-display text-lg font-semibold text-azur">{row.name}</p>
            {row.details && <PriceNote>{row.details}</PriceNote>}
            <dl className="mt-3 grid grid-cols-2 gap-4">
              {columns.map((col, i) => (
                <div key={col} className="flex flex-col-reverse gap-0.5">
                  <dt className="text-sm text-texte">{col}</dt>
                  <dd className={row.prices[i] == null ? 'font-medium text-brume' : `text-2xl ${priceStyle}`}>
                    {price(row.prices[i])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
