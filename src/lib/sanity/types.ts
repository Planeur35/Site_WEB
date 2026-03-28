import type { PortableTextBlock } from '@portabletext/react';

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface LocalizedRichText {
  fr: PortableTextBlock[];
  en: PortableTextBlock[];
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
}

export interface Aircraft {
  _id: string;
  _type: 'aircraft';
  name: string;
  type?: 'training' | 'performance' | 'tandem';
  photo?: SanityImage;
  specs?: AircraftSpecs;
  description?: LocalizedRichText;
}

export interface GalleryImage {
  _id: string;
  _type: 'galleryImage';
  image: SanityImage;
  caption?: LocalizedString;
  tags?: string[];
  date?: string;
}
