import 'server-only';
import { absoluteUrl } from '@/lib/metadata';
import { urlFor } from '@/lib/sanity/image';
import type { Article } from '@/lib/sanity/types';

/*
 * Shares a news article on the association's Facebook Page and, once it exists, its Instagram account.
 * Called by /api/social/publish. Settings (Vercel environment variables, never committed):
 *   META_PAGE_ID, META_PAGE_TOKEN   the Facebook Page and its long-lived Page access token
 *   META_IG_USER_ID                 the Instagram professional account linked to the Page (optional)
 *   META_GRAPH_VERSION              Graph API version, v27.0 by default
 *   SOCIAL_DRY_RUN=1                compose the posts without sending them
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? 'v27.0';
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

export interface SocialPost {
  /** Text of the Facebook post; the article link is attached as a preview card. */
  message: string;
  link: string;
  /** Instagram caption: links are not clickable there, so the address is spelled out. */
  caption: string;
  /** Square JPEG for Instagram, from the article photo; none means Facebook only. */
  imageUrl?: string;
}

export interface SocialResult {
  facebookPostId?: string;
  instagramMediaId?: string;
  errors: string[];
}

/** The post for an article: the editor's text, or the French title and summary. */
export function composePost(article: Article): SocialPost {
  const link = absoluteUrl({ pathname: '/actualites/[slug]', params: { slug: article.slug.current } }, 'fr');
  const text =
    article.socialText?.trim() || [article.title.fr, article.excerpt?.fr].filter((part) => part?.trim()).join('\n\n');
  const imageUrl = article.featuredImage?.asset
    ? urlFor(article.featuredImage).width(1080).height(1080).fit('crop').format('jpg').quality(85).url()
    : undefined;
  return { message: text, link, caption: `${text}\n\nL’article complet sur ${link.replace(/^https?:\/\//, '')}`, imageUrl };
}

export function socialConfig() {
  return {
    pageId: process.env.META_PAGE_ID,
    pageToken: process.env.META_PAGE_TOKEN,
    instagramId: process.env.META_IG_USER_ID,
    dryRun: process.env.SOCIAL_DRY_RUN === '1',
  };
}

async function graphPost(path: string, params: Record<string, string>, token: string): Promise<{ id: string }> {
  const response = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(params),
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => ({}))) as { id?: string; error?: { message?: string; code?: number } };
  if (!response.ok || !data.id) {
    // Meta's message only: never the token or the request
    throw new Error(`Meta ${path.split('/').pop()} ${response.status}: ${data.error?.message ?? 'réponse inattendue'}`);
  }
  return { id: data.id };
}

/** Sends the post. Each network is independent: a failure on one does not stop the other. */
export async function publishPost(post: SocialPost, done: Pick<SocialResult, 'facebookPostId' | 'instagramMediaId'> = {}): Promise<SocialResult> {
  const { pageId, pageToken, instagramId } = socialConfig();
  const result: SocialResult = { ...done, errors: [] };
  if (!pageId || !pageToken) {
    result.errors.push('META_PAGE_ID ou META_PAGE_TOKEN manquant');
    return result;
  }

  if (!result.facebookPostId) {
    try {
      result.facebookPostId = (await graphPost(`${pageId}/feed`, { message: post.message, link: post.link }, pageToken)).id;
    } catch (error) {
      result.errors.push(`Facebook : ${(error as Error).message}`);
    }
  }

  if (instagramId && post.imageUrl && !result.instagramMediaId) {
    try {
      // Two steps: a media container, then its publication
      const container = await graphPost(`${instagramId}/media`, { image_url: post.imageUrl, caption: post.caption }, pageToken);
      result.instagramMediaId = (await graphPost(`${instagramId}/media_publish`, { creation_id: container.id }, pageToken)).id;
    } catch (error) {
      result.errors.push(`Instagram : ${(error as Error).message}`);
    }
  }
  return result;
}
