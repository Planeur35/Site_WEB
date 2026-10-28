'use client';

import { useEffect, useState } from 'react';
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
    <div className="border border-sky-900/15 bg-white">
      <div className="relative aspect-video bg-sky-100">
        {failed ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-600">{t('unavailable')}</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- external image reloaded every minute, not optimisable
          <img src={src} alt={t('alt')} className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sky-900/15 px-4 py-3 text-xs text-slate-600 sm:px-6">
        <span>
          {t('refresh')} · {updatedAt ? t('lastUpdate', { time: updatedAt }) : t('justNow')}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center uppercase tracking-[0.2em] text-sky-800 underline decoration-sky-300 underline-offset-4"
        >
          {t('open')} <span aria-hidden="true">&nbsp;↗</span>
        </a>
      </div>
    </div>
  );
}
