import { client } from './client';

/**
 * Fetches from Sanity and returns `fallback` when Sanity is empty or unreachable,
 * so every page still renders.
 */
export async function sanityFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  try {
    const result = await client.fetch<T | null>(query, params);
    return result ?? fallback;
  } catch {
    return fallback;
  }
}
