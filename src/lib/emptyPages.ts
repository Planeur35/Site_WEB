import { CLUB_ANCHORS } from '@/components/layout/navItems';
import { sanityFetch } from '@/lib/sanity/fetch';

/** What exists in the Studio for the pages that can be empty. */
const contentQuery = `{
  "webcam": defined(*[_type == "siteSettings"][0].webcamUrl),
  "gallery": count(*[_type == "galleryImage" && defined(image.asset)]) > 0,
  "stories": count(*[_type == "flightStory" && defined(slug.current)]) > 0,
  "history": count(*[_type == "clubHistory"]) > 0,
  "sections": *[_type == "clubPage"].section
}`;

interface Content {
  webcam: boolean;
  gallery: boolean;
  stories: boolean;
  history: boolean;
  sections: string[];
}

/**
 * Menu keys of the pages and club sections that have no content yet, so the menus
 * don't lead to a "Bientôt ici" page. The pages stay reachable by their address.
 * When Sanity is unreachable nothing is hidden.
 */
export async function getHiddenNavKeys(): Promise<string[]> {
  const content = await sanityFetch<Content | null>(contentQuery, null);
  if (!content) return [];
  const sections = Object.keys(CLUB_ANCHORS).filter((key) => key !== 'history');
  return [
    ...(content.webcam ? [] : ['webcam']),
    ...(content.gallery ? [] : ['gallery']),
    ...(content.stories ? [] : ['stories']),
    ...(content.history ? [] : ['history']),
    ...sections.filter((key) => !content.sections.includes(key)),
  ];
}
