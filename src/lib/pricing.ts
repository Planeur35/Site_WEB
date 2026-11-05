import { sanityFetch } from '@/lib/sanity/fetch';
import { trialTariffsQuery } from '@/lib/sanity/queries';
import { localize } from '@/lib/sanity/localize';
import type { LocalizedString, Tariff } from '@/lib/sanity/types';

/** Trial flight prices from the `vol-initiation` tariffs; absent when not entered in the Studio. */
export interface TrialPrices {
  adult?: number;
  young?: number;
  /** Condition of the reduced price, from the tariff's "details" (e.g. "si scolarisé en Ille-et-Vilaine"). */
  youngCondition?: LocalizedString;
}

export async function getTrialPrices(): Promise<TrialPrices> {
  const tariffs = await sanityFetch<Pick<Tariff, 'ageCategory' | 'amount' | 'details'>[]>(trialTariffsQuery, []);
  const young = tariffs.find((tariff) => tariff.ageCategory === 'under18');
  return {
    adult: tariffs.find((tariff) => tariff.ageCategory === 'adult' || !tariff.ageCategory)?.amount,
    young: young?.amount,
    youngCondition: young?.details,
  };
}

/** The condition of a price in the page's language ("si scolarisé en Ille-et-Vilaine"), or undefined. */
export function priceCondition(details: LocalizedString | undefined, locale: string): string | undefined {
  return localize(details, locale)?.trim() || undefined;
}

/** A trial price line with the condition of the reduced price, shown on its own line as a PriceNote. */
export interface TrialPriceLine {
  line: string;
  note?: string;
}

/** "170", "1 250": an amount for the price strings, which carry the € sign. */
export function formatAmount(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(amount);
}
