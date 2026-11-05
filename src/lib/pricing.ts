import { sanityFetch } from '@/lib/sanity/fetch';
import { trialTariffsQuery } from '@/lib/sanity/queries';
import { localize } from '@/lib/sanity/localize';
import type { LocalizedString, PricingSection, Tariff } from '@/lib/sanity/types';

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

/** "170", "1 137,69", "1 667,90": an amount for the price strings, which carry the € sign. Cents always have two digits. */
export function formatAmount(amount: number, locale: string): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: 2 }).format(amount);
}

/** Anchor of a price list section, from its French title (« J’apprends à piloter » → j-apprends-a-piloter). */
export function pricingSectionId(section: Pick<PricingSection, 'title'>, index: number): string {
  const slug = (section.title?.fr ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return slug || `grille-${index + 1}`;
}

/** Anchor of the section that lists a service whose French name starts with `name` (« Pack Formation »…). */
export function pricingAnchorFor(sections: PricingSection[] | undefined, name: string): string | undefined {
  const wanted = name.toLowerCase();
  const index = (sections ?? []).findIndex((section) =>
    section.items?.some((item) => item.name?.fr?.toLowerCase().startsWith(wanted)),
  );
  return index === -1 ? undefined : pricingSectionId(sections![index], index);
}
