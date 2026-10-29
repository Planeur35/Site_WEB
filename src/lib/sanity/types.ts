import type { PortableTextBlock } from '@portabletext/react';

// English is optional in the Studio: read these with localize(), which falls back to French.
export interface LocalizedString {
  fr?: string;
  en?: string;
}

export type LocalizedText = LocalizedString;

export interface LocalizedRichText {
  fr?: PortableTextBlock[];
  en?: PortableTextBlock[];
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SeoFields {
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'youtube' | 'twitter';
  url: string;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  clubName: string;
  tagline?: LocalizedString;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: SocialLink[];
  webcamUrl?: string;
  weglideUrl?: string;
  aerodromeCoordinates?: {
    lat: number;
    lng: number;
  };
  heroSlides?: HeroSlide[];
  statsYear?: number;
  membersCount?: number;
  flightHours?: number;
  glidersCount?: number;
  foundedYear?: number;
  joinText?: LocalizedText;
  discoveryText?: LocalizedText;
  bookingText?: LocalizedText;
  pageHeroes?: Partial<Record<PageHeroKey, SanityImage>>;
  paymentUrl?: string;
  usefulLinks?: UsefulLink[];
  legalName?: string;
  legalAddress?: string;
  legalId?: string;
  publicationDirector?: string;
}

/** Pages whose header photo can be set in Studio → Réglages du site → Photos d’en-tête. */
export type PageHeroKey =
  | 'club'
  | 'gliders'
  | 'join'
  | 'discover'
  | 'news'
  | 'stories'
  | 'gallery'
  | 'webcam'
  | 'links'
  | 'contact'
  | 'legal';

export interface HeroSlide {
  _key: string;
  image?: SanityImage;
  title?: LocalizedString;
  subtitle?: LocalizedString;
}

export type LinkGroup = 'institutions' | 'flight-prep' | 'weather' | 'community';

export interface UsefulLink {
  _key: string;
  label?: LocalizedString;
  url: string;
  group?: LinkGroup;
}

export interface Page {
  _id: string;
  _type: 'page';
  title: LocalizedString;
  slug: SanitySlug;
  hero?: SanityImage;
  body?: LocalizedRichText;
  seo?: SeoFields;
}

export interface Category {
  _id: string;
  _type: 'category';
  title: LocalizedString;
  slug: SanitySlug;
}

export interface Article {
  _id: string;
  _type: 'article';
  title: LocalizedString;
  slug: SanitySlug;
  publishedAt: string;
  author?: string;
  category?: Category;
  featuredImage?: SanityImage;
  excerpt?: LocalizedText;
  body?: LocalizedRichText;
  seo?: SeoFields;
}

export interface AircraftSpecs {
  wingspan?: string;
  glideRatio?: string;
  seats?: number;
  year?: number;
  maxWeight?: string;
}

export type AircraftCategory = 'biplace-ecole' | 'biplace-perf' | 'handiplaneur' | 'monoplace-debut' | 'monoplace-perf' | 'remorqueur';

export interface Aircraft {
  _id: string;
  _type: 'aircraft';
  name: string;
  registration?: string;
  callsign?: string;
  category?: AircraftCategory;
  manufacturer?: string;
  photo?: SanityImage;
  specs?: AircraftSpecs;
  instrumentation?: string;
  description?: LocalizedText;
  sortOrder?: number;
}

export interface GalleryImage {
  _id: string;
  _type: 'galleryImage';
  image: SanityImage;
  caption?: LocalizedString;
  tags?: string[];
  date?: string;
}

export interface ClubEvent {
  _id: string;
  _type: 'event';
  title?: LocalizedString;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: LocalizedText;
  image?: SanityImage;
}

export type TariffOffer =
  | 'forfait-20h'
  | 'forfait-illimite'
  | 'pack-formation'
  | 'pack-complement-formation'
  | 'vol-initiation';

export type AgeCategory = 'under25' | 'over25' | 'under18' | 'adult';

export interface Tariff {
  _id: string;
  _type: 'tariff';
  offer: TariffOffer;
  ageCategory?: AgeCategory;
  amount: number;
  details?: LocalizedString;
}

export type ClubSection = 'presentation' | 'platform' | 'activities' | 'training' | 'campaign' | 'competition';

export interface ClubPage {
  _id: string;
  _type: 'clubPage';
  section: ClubSection;
  title?: LocalizedString;
  intro?: LocalizedText;
  mainImage?: SanityImage;
  body?: LocalizedRichText;
  diagram?: SanityImage;
}

export interface Anecdote {
  _key: string;
  title?: LocalizedString;
  text?: LocalizedText;
}

export interface ClubHistory {
  _id: string;
  _type: 'clubHistory';
  title?: LocalizedString;
  intro?: LocalizedText;
  body?: LocalizedRichText;
  anecdotes?: Anecdote[];
}

export interface FlightStory {
  _id: string;
  _type: 'flightStory';
  title?: LocalizedString;
  flightDate?: string;
  weglideUrl?: string;
  aircraft?: string;
  image?: SanityImage;
  excerpt?: LocalizedText;
  body?: LocalizedRichText;
}
