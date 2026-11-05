import type { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

/** A link of the menus: message key in the `nav` namespace, and where it goes. */
export interface NavLink {
  key: string;
  href: LinkHref;
  /** Internal pathname of a whole page, to mark it as current. Absent for anchors. */
  pathname?: string;
}

export interface NavItem extends NavLink {
  pathname: string;
  children?: NavLink[];
  /** The orange call to action, shown as a button rather than a text entry. */
  cta?: true;
}

/** Anchors of the club page sections, shared by the page and the menus. */
export const CLUB_ANCHORS = {
  presentation: 'presentation',
  platform: 'plateforme',
  activities: 'activites',
  training: 'formation',
  campaign: 'perfectionnement',
  competition: 'competition',
  history: 'histoire',
  partners: 'partenaires',
} as const;

/** The top bar: four text entries, with their drop-downs, and the call to action. */
export const HEADER_NAV: NavItem[] = [
  {
    key: 'club',
    href: '/association',
    pathname: '/association',
    children: Object.entries(CLUB_ANCHORS).map(([key, hash]) => ({ key, href: { pathname: '/association', hash } })),
  },
  { key: 'gliders', href: '/planeurs', pathname: '/planeurs' },
  { key: 'join', href: '/adherer', pathname: '/adherer' },
  { key: 'discover', href: '/decouvrir', pathname: '/decouvrir', cta: true },
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

/** Pages that are only in the full menu and the footer. */
const OTHER_PAGES: NavItem[] = [
  { key: 'pricing', href: '/tarifs', pathname: '/tarifs' },
  { key: 'stories', href: '/recits', pathname: '/recits' },
  { key: 'gallery', href: '/galerie', pathname: '/galerie' },
  { key: 'webcam', href: '/webcam', pathname: '/webcam' },
  { key: 'links', href: '/liens', pathname: '/liens' },
  { key: 'contact', href: '/contact', pathname: '/contact' },
];

/** Every page, and every drop-down entry, by key. */
const LINKS = new Map<string, NavLink>(
  [...HEADER_NAV, ...OTHER_PAGES].flatMap((item): [string, NavLink][] => [
    [item.key, { key: item.key, href: item.href, pathname: item.pathname }],
    ...(item.children ?? []).map((child): [string, NavLink] => [child.key, child]),
  ]),
);

function links(keys: string[]): NavLink[] {
  return keys.map((key) => {
    const link = LINKS.get(key);
    if (!link) throw new Error(`Unknown nav key: ${key}`);
    return link;
  });
}

export interface NavGroup {
  /** Message key in the `nav` namespace. */
  key: 'groupFly' | 'groupClub' | 'groupNews' | 'groupPractical';
  items: NavLink[];
}

/** The four groups of the full menu and the footer. */
export const NAV_GROUPS: NavGroup[] = [
  { key: 'groupFly', items: links(['discover', 'join', 'pricing', 'gliders']) },
  { key: 'groupClub', items: links(Object.keys(CLUB_ANCHORS)) },
  { key: 'groupNews', items: links(['newsList', 'agenda', 'stories', 'gallery']) },
  { key: 'groupPractical', items: links(['webcam', 'links', 'contact']) },
];

/** Whether `pathname` (internal, from `usePathname`) is `page` or one of its sub-pages. */
export function isCurrentPage(pathname: string, page: string | undefined): boolean {
  if (!page) return false;
  return pathname === page || pathname.startsWith(`${page}/`);
}

/** The header entries and the menu groups without the hidden keys (pages with no content yet). */
export function visibleNav(hidden: string[]): { header: NavItem[]; groups: NavGroup[] } {
  const keep = (link: NavLink) => !hidden.includes(link.key);
  return {
    header: HEADER_NAV.filter(keep).map((item) => (item.children ? { ...item, children: item.children.filter(keep) } : item)),
    groups: NAV_GROUPS.map((group) => ({ ...group, items: group.items.filter(keep) })).filter((group) => group.items.length > 0),
  };
}
