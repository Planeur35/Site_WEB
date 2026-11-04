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
