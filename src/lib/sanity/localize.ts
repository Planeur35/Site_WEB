/**
 * Picks the visitor's language from a bilingual { fr, en } field.
 * English falls back to French, so content entered only in French still shows on /en.
 */
export function localize<T>(
  value: { fr?: T; en?: T } | undefined | null,
  locale: string,
): T | undefined {
  if (!value) return undefined;
  if (locale === 'en') {
    const en = value.en;
    const isEmpty = en == null || (typeof en === 'string' && en.trim() === '') || (Array.isArray(en) && en.length === 0);
    return isEmpty ? value.fr : en;
  }
  return value.fr;
}

/** The value if it holds something (text or at least one block), otherwise undefined. */
export function nonEmpty<T extends { length: number }>(value: T | undefined | null): T | undefined {
  return value && value.length > 0 ? value : undefined;
}

/**
 * True on /en when a field has no English and shows its French instead:
 * the caller marks that block `lang="fr"` and shows `FrenchOnlyNote`.
 */
export function isFrenchFallback(value: { fr?: unknown; en?: unknown } | undefined | null, locale: string): boolean {
  if (locale !== 'en' || !value) return false;
  const filled = (v: unknown) =>
    v != null && !(typeof v === 'string' && v.trim() === '') && !(Array.isArray(v) && v.length === 0);
  return !filled(value.en) && filled(value.fr);
}
