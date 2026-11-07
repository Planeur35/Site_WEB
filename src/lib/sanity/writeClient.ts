import 'server-only';
import { createClient } from '@sanity/client';

/**
 * Server-side client with write access (SANITY_WRITE_TOKEN, Editor role), for the routes that record
 * what they did, such as /api/social/publish. Never import it from a page or a client component.
 */
export function getWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });
}
