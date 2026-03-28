'use client';

import dynamic from 'next/dynamic';

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
}

const MapInner = dynamic(() => import('@/components/ui/MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading map...</p>
    </div>
  ),
});

export default function Map({ lat, lng, zoom, popupText }: MapProps) {
  return <MapInner lat={lat} lng={lng} zoom={zoom} popupText={popupText} />;
}
