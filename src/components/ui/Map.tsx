'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
}

function MapLoading() {
  const t = useTranslations('common');
  return (
    <div className="flex h-[400px] w-full items-center justify-center bg-horizon">
      <p className="text-sm text-slate-600">{t('loadingMap')}</p>
    </div>
  );
}

const MapInner = dynamic(() => import('@/components/ui/MapInner'), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function Map({ lat, lng, zoom, popupText }: MapProps) {
  return <MapInner lat={lat} lng={lng} zoom={zoom} popupText={popupText} />;
}
