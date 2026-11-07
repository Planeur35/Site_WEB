'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface WebcamImageProps {
  url: string;
}

const REFRESH_MS = 60_000;

/** The webcam's still image, reloaded every minute. */
export default function WebcamImage({ url }: WebcamImageProps) {
  const t = useTranslations('webcam');
  const locale = useLocale();
  const [src, setSrc] = useState(url);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSrc(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`);
      setUpdatedAt(new Date().toLocaleTimeString(locale === 'en' ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setFailed(false);
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [url, locale]);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-md bg-ciel">
        {failed ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-texte">{t('unavailable')}</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- external image reloaded every minute, not optimisable
          <img src={src} alt={t('alt')} className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.9375rem] text-brume">
        <span>
          {t('refresh')} · {updatedAt ? t('lastUpdate', { time: updatedAt }) : t('justNow')}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-sm border-[1.5px] border-azur px-[22px] font-semibold text-azur transition-colors duration-150 ease-planeur hover:bg-ciel"
        >
          {t('open')}
          <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
