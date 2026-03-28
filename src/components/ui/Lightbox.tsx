'use client';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface LightboxWrapperProps {
  slides: Array<{ src: string; alt?: string }>;
  open: boolean;
  index: number;
  onClose: () => void;
}

export default function LightboxWrapper({
  slides,
  open,
  index,
  onClose,
}: LightboxWrapperProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
    />
  );
}
