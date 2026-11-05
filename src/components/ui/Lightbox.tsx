'use client';

import { useTranslations } from 'next-intl';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface LightboxWrapperProps {
  slides: Array<{ src: string; alt?: string; width?: number; height?: number }>;
  open: boolean;
  index: number;
  onClose: () => void;
}

/** Full-screen photo viewer on a night-blue background; Escape and the arrow keys work. */
export default function LightboxWrapper({ slides, open, index, onClose }: LightboxWrapperProps) {
  const t = useTranslations('gallery');
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      labels={{
        Previous: t('previous'),
        Next: t('next'),
        Close: t('close'),
        Lightbox: t('viewer'),
        'Photo gallery': t('title'),
        Slide: t('photo'),
        Carousel: t('viewer'),
      }}
      styles={{
        container: { backgroundColor: 'color-mix(in srgb, var(--color-nuit) 94%, transparent)' },
        // 44 px tap targets: 24 px icon + 10 px padding
        button: { padding: 10, filter: 'none' },
        icon: { width: 24, height: 24 },
      }}
    />
  );
}
