import type { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

/** Message key in the `nav` namespace, and where it goes. */
export interface NavItem {
  key: string;
  href: LinkHref;
  /** Internal pathname, to highlight the current section. */
  pathname: string;
  children?: { key: string; href: LinkHref }[];
}

/** Anchors of the club page sections, shared by the page and the menus. */
export const CLUB_ANCHORS = {
  presentation: 'presentation',
  platform: 'plateforme',
  activities: 'activites',
  training: 'formation',
  campaign: 'ecole-campagne',
  competition: 'competition',
  history: 'histoire',
} as const;

/** The five entries of the top bar, with their drop-downs. */
export const HEADER_NAV: NavItem[] = [
  {
    key: 'club',
    href: '/club',
    pathname: '/club',
    children: Object.entries(CLUB_ANCHORS).map(([key, hash]) => ({ key, href: { pathname: '/club', hash } })),
  },
  { key: 'gliders', href: '/planeurs', pathname: '/planeurs' },
  { key: 'join', href: '/adherer', pathname: '/adherer' },
  { key: 'discover', href: '/decouvrir', pathname: '/decouvrir' },
  {
    key: 'news',
    href: '/actualites',
    pathname: '/actualites',
    children: [
      { key: 'newsList', href: { pathname: '/actualites', hash: 'news' } },
      { key: 'agenda', href: { pathname: '/actualites', hash: 'agenda' } },
    ],
  },
];

/** Full menu (burger button and footer). */
export const FULL_NAV: NavItem[] = [
  ...HEADER_NAV.map(({ key, href, pathname }) => ({ key, href, pathname })),
  { key: 'stories', href: '/recits', pathname: '/recits' },
  { key: 'gallery', href: '/galerie', pathname: '/galerie' },
  { key: 'webcam', href: '/webcam', pathname: '/webcam' },
  { key: 'links', href: '/liens', pathname: '/liens' },
  { key: 'contact', href: '/contact', pathname: '/contact' },
];
