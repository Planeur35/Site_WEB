'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Check, Link2, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string;
  title: string;
  /** A single 44 px share button (news list) instead of the full row. */
  compact?: boolean;
  className?: string;
}

const networkStyle =
  'inline-flex h-11 items-center rounded-sm border border-horizon px-3.5 text-[0.9375rem] font-medium text-azur transition-colors duration-150 ease-planeur hover:bg-ciel';

/** Share a news item on social networks, or copy its link. */
export default function ShareButtons({ url, title, compact = false, className }: ShareButtonsProps) {
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

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Share sheet dismissed
      }
      return;
    }
    await copy();
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={share}
        className={clsx(
          'inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-altitude transition-colors duration-150 ease-planeur hover:bg-ciel',
          className,
        )}
        aria-label={copied ? t('copied') : t('label')}
        aria-live="polite"
      >
        {copied ? <Check size={20} aria-hidden="true" /> : <Share2 size={20} strokeWidth={1.8} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <div className={clsx('flex flex-wrap items-center gap-3', className)}>
      <span className="text-[0.9375rem] font-semibold text-nuit">{t('label')}</span>
      <a className={networkStyle} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      <a className={networkStyle} href={`https://wa.me/?text=${text}%20${u}`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a className={networkStyle} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <button
        type="button"
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm border-[1.5px] border-azur px-3.5 text-[0.9375rem] font-semibold text-azur transition-colors duration-150 ease-planeur hover:bg-ciel"
        onClick={copy}
        aria-live="polite"
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
        {copied ? t('copied') : t('copy')}
      </button>
    </div>
  );
}
