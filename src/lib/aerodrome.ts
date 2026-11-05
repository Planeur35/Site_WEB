import type { SiteSettings } from '@/lib/sanity/types';

export interface Coordinates {
  lat: number;
  lng: number;
}

/** "Aérodrome de Saint-Sulpice-des-Landes" on OpenStreetMap, used while the Studio has no coordinates. */
const FALLBACK: Coordinates = { lat: 47.7914, lng: -1.6383 };

export function aerodromeCoordinates(settings: SiteSettings | null): Coordinates {
  const c = settings?.aerodromeCoordinates;
  return c?.lat != null && c?.lng != null ? { lat: c.lat, lng: c.lng } : FALLBACK;
}

/** Route planner to the airfield; on phones it opens the maps app. */
export function directionsUrl({ lat, lng }: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
