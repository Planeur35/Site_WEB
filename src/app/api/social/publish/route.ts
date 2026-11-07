import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { composePost, publishPost, socialConfig } from '@/lib/social';
import { client as readClient } from '@/lib/sanity/client';
import { getWriteClient } from '@/lib/sanity/writeClient';
import type { Article } from '@/lib/sanity/types';

/*
 * Called by a Sanity webhook when an article is published with "Publier sur Facebook et Instagram" ticked
 * (setup in docs/MANUEL-TECHNIQUE.md). The article is claimed first, tied to its revision, so that a
 * retried or duplicated webhook can never post it twice; the post IDs or the error are then written back.
 */

export const dynamic = 'force-dynamic';

const reply = (status: number, message: string, extra?: object) => NextResponse.json({ message, ...extra }, { status });

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return reply(500, 'SANITY_WEBHOOK_SECRET is not set');

  const { isValidSignature, body } = await parseBody<{ _id?: string }>(request, secret);
  if (!isValidSignature) return reply(401, 'Invalid signature');
  const id = body?._id;
  if (!id || id.startsWith('drafts.')) return reply(200, 'Ignored: not a published document');

  const client = getWriteClient();
  const { dryRun } = socialConfig();
  if (!client && !dryRun) return reply(500, 'SANITY_WRITE_TOKEN is not set');

  // Fresh read (no CDN): the webhook fires right after publishing
  const reader = client ?? readClient.withConfig({ useCdn: false });
  const article = await reader.getDocument<Article & { _rev: string }>(id);
  if (!article || article._type !== 'article') return reply(200, 'Ignored: not an article');
  if (!article.socialShare) return reply(200, 'Ignored: sharing not requested');
  // A retry (box ticked after an error) resends only to the networks that failed
  const retry = Boolean(article.socialRetry && article.socialPosts?.error);
  if (article.socialPosts?.startedAt && !retry) return reply(200, 'Ignored: already shared');
  if (!article.slug?.current || !article.title?.fr) return reply(200, 'Ignored: no address or title yet');

  const post = composePost(article);
  if (dryRun || !client) return reply(200, 'Dry run: nothing sent', { post });

  // Claim: fails if the article changed since it was read, e.g. another call claimed it first
  const startedAt = new Date().toISOString();
  try {
    await client
      .patch(id)
      .ifRevisionId(article._rev)
      .set({ socialRetry: false, socialPosts: { ...article.socialPosts, startedAt } })
      .commit();
  } catch {
    return reply(409, 'Already being shared');
  }

  const result = await publishPost(post, retry ? article.socialPosts : {});
  const socialPosts = {
    startedAt,
    ...(result.facebookPostId && { facebookPostId: result.facebookPostId }),
    ...(result.instagramMediaId && { instagramMediaId: result.instagramMediaId }),
    ...(result.errors.length > 0 && { error: result.errors.join('\n') }),
  };
  // A draft opened meanwhile gets the record too, so publishing it later cannot trigger a second post
  await client
    .transaction()
    .patch(id, (patch) => patch.set({ socialPosts, socialRetry: false }))
    .patch(`drafts.${id}`, (patch) => patch.set({ socialPosts, socialRetry: false }))
    .commit()
    .catch(() => client.patch(id).set({ socialPosts, socialRetry: false }).commit());

  return reply(result.errors.length > 0 ? 502 : 200, result.errors.length > 0 ? 'Shared with errors' : 'Shared', socialPosts);
}
