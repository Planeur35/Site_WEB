import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
if (!projectId) {
  throw new Error('PUBLIC_SANITY_PROJECT_ID est manquant : copiez .env.example en .env et remplissez-le.')
}

export const client = createClient({
  projectId,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Le site est reconstruit à chaque publication : on veut toujours les données à jour.
  useCdn: false,
})

const builder = imageUrlBuilder(client)

// ---------- Types ----------
export type Photo = {asset: {_ref: string}; alt?: string; hotspot?: unknown; crop?: unknown}
export type Block = Record<string, any>

export type Settings = {
  heroSlides?: {image?: Photo; title?: string; subtitle?: string}[]
  tagline?: string
  foundedYear?: number
  joinText?: string
  discoveryText?: string
  usefulLinks?: {label: string; url: string; group?: string}[]
  statsYear?: number
  membersCount?: number
  flightHours?: number
  glidersCount?: number
  contactEmail?: string
  phone?: string
  address?: string
  paymentUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  webcamUrl?: string
}
export type NewsItem = {_id: string; title: string; publishedAt: string; tag?: string; image: Photo; body: Block[]}
export type EventItem = {
  _id: string
  title: string
  startDate: string
  endDate?: string
  location?: string
  description?: string
}
export type Glider = {
  _id: string
  name: string
  category: string
  role?: string
  year?: number
  shortDescription: string
  mainImage: Photo
  specs?: {label?: string; value?: string}[]
}
export type Tariff = {_id: string; offer: string; ageCategory?: string; amount: number; details?: string}
export type ClubPage = {
  _id: string
  section: string
  title: string
  intro?: string
  mainImage: Photo
  body?: Block[]
  diagram?: Photo
}

// ---------- Images ----------
/** Adresse d'une image redimensionnée. Avec `height`, le recadrage suit le point d'intérêt choisi dans Sanity. */
export function imageUrl(image: Photo, width: number, height?: number): string {
  let b = builder.image(image as any).width(width).auto('format').quality(80)
  if (height) b = b.height(height).fit('crop')
  return b.url()
}

/** Liste `srcset` : `ratio` = hauteur / largeur (0.5625 pour du 16:9, 1.3333 pour du portrait 3:4). */
export function imageSrcset(image: Photo, widths: number[], ratio?: number): string {
  return widths
    .map((w) => `${imageUrl(image, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ')
}

// ---------- Requêtes (seuls les documents publiés sont renvoyés) ----------
export const getSettings = () => client.fetch<Settings | null>('*[_id == "siteSettings"][0]')

export const getNews = (limit = 200) =>
  client.fetch<NewsItem[]>('*[_type == "news"] | order(publishedAt desc)[0...$limit]', {limit})

export function getUpcomingEvents() {
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  return client.fetch<EventItem[]>(
    '*[_type == "event" && coalesce(endDate, startDate) >= $since] | order(startDate asc)',
    {since: since.toISOString()},
  )
}

export const getGliders = () =>
  client.fetch<Glider[]>('*[_type == "glider"] | order(order asc, name asc)')

export const getTariffs = () => client.fetch<Tariff[]>('*[_type == "tariff"]')

export const getClubPages = () => client.fetch<ClubPage[]>('*[_type == "clubPage"]')

export type FlightStory = {
  _id: string
  title: string
  flightDate?: string
  weglideUrl?: string
  aircraft?: string
  image?: Photo
  excerpt: string
  body?: Block[]
}
export type ClubHistory = {
  title?: string
  intro?: string
  body?: Block[]
  anecdotes?: {title: string; text: string}[]
}

export const getFlightStories = () =>
  client.fetch<FlightStory[]>('*[_type == "flightStory"] | order(flightDate desc)')

export const getClubHistory = () => client.fetch<ClubHistory | null>('*[_id == "clubHistory"][0]')
