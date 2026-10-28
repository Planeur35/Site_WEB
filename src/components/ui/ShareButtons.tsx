'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const buttonStyle =
  'inline-flex min-h-11 cursor-pointer items-center border border-sky-500/40 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-sky-900 transition-colors hover:border-sky-800 hover:text-sky-950';

/** Share a news item on social networks, or copy its link. */
export default function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const t = useTranslations('share');
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: nothing to do, the link is still in the address bar
    }
  }

  return (
    <div className={clsx('flex flex-wrap items-center gap-3', className)}>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-600">{t('label')}</span>
      <a className={buttonStyle} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">
        Facebook <span aria-hidden="true">&nbsp;↗</span>
      </a>
      <a className={buttonStyle} href={`https://wa.me/?text=${text}%20${u}`} target="_blank" rel="noopener noreferrer">
        WhatsApp <span aria-hidden="true">&nbsp;↗</span>
      </a>
      <a className={buttonStyle} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        LinkedIn <span aria-hidden="true">&nbsp;↗</span>
      </a>
      <button type="button" className={buttonStyle} onClick={copy} aria-live="polite">
        {copied ? t('copied') : t('copy')}
      </button>
    </div>
  );
}
