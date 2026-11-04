import { sanityFetch } from '@/lib/sanity/fetch';
import { trialTariffsQuery } from '@/lib/sanity/queries';
import type { Tariff } from '@/lib/sanity/types';

/** Trial flight prices from the `vol-initiation` tariffs; absent when not entered in the Studio. */
export interface TrialPrices {
  adult?: number;
  young?: number;
}

export async function getTrialPrices(): Promise<TrialPrices> {
  const tariffs = await sanityFetch<Pick<Tariff, 'ageCategory' | 'amount'>[]>(trialTariffsQuery, []);
  return {
    adult: tariffs.find((tariff) => tariff.ageCategory === 'adult' || !tariff.ageCategory)?.amount,
    young: tariffs.find((tariff) => tariff.ageCategory === 'under18')?.amount,
  };
}
