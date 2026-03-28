export function localize<T>(
  value: { fr: T; en: T } | undefined | null,
  locale: string,
): T | undefined {
  if (!value) return undefined;
  return locale === 'en' ? value.en : value.fr;
}
