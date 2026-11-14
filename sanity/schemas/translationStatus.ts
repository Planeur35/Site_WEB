/** Adds a warning to a Studio list entry when the French text exists but the English one is missing. */
export function withEnglishStatus(subtitle: string | undefined, french: unknown, english: unknown): string | undefined {
  if (!french || english) return subtitle;
  return ['⚠ Version anglaise à faire', subtitle].filter(Boolean).join(' · ');
}
