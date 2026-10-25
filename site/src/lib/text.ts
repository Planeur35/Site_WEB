import {toHTML} from '@portabletext/to-html'
import {imageUrl, type Block} from './sanity'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Transforme le texte Sanity en HTML (paragraphes, titres, listes, liens, photos). */
export function renderText(blocks: Block[] | undefined): string {
  return toHTML(blocks ?? [], {
    components: {
      types: {
        image: ({value}: {value: any}) =>
          `<figure><img src="${imageUrl(value, 1200)}" alt="${esc(value.alt ?? '')}" loading="lazy">` +
          (value.caption ? `<figcaption>${esc(value.caption)}</figcaption>` : '') +
          '</figure>',
      },
    },
  })
}

/** Début du texte, sans mise en forme, pour les listes d'actualités. */
export function excerpt(blocks: Block[] | undefined, max = 200): string {
  const text = (blocks ?? [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children ?? []).map((c: any) => c.text).join(''))
    .join(' ')
    .trim()
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text
}

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

/** Adresse d'une actualité : date + titre. Aucun champ à saisir par les membres. */
export const newsSlug = (n: {publishedAt: string; title: string}) =>
  `${n.publishedAt.slice(0, 10)}-${slugify(n.title)}`

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', {timeZone: 'Europe/Paris', dateStyle: 'long'}).format(new Date(iso))

/** Heure au format « 14 h 30 », ou chaîne vide pour un événement sans heure (minuit). */
export function formatTime(iso: string): string {
  const t = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))
  return t === '00:00' ? '' : t.replace(':', ' h ')
}

const paris = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', {timeZone: 'Europe/Paris', ...opts})
export const formatMonthYear = (iso: string) => paris({month: 'long', year: 'numeric'}).format(new Date(iso))
export const formatDayNumber = (iso: string) => paris({day: 'numeric'}).format(new Date(iso))
export const formatMonthShort = (iso: string) => paris({month: 'short'}).format(new Date(iso))
export const formatWeekday = (iso: string) => paris({weekday: 'long'}).format(new Date(iso))
