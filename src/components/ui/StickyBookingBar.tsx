'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface StickyBookingBarProps {
  /** The price panel: the bar hides while it is on screen. */
  panelId: string;
  /** Price lines on the left; may be empty. */
  price?: React.ReactNode;
  /** The booking button. */
  children: React.ReactNode;
}

/**
 * Phones only: a booking bar fixed at the bottom of the screen.
 * It hides while the price panel or the footer is visible, so it never covers them.
 */
export default function StickyBookingBar({ panelId, price, children }: StickyBookingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById(panelId), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el !== null,
    );
    const onScreen = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting);
      setVisible(![...onScreen.values()].some(Boolean));
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [panelId]);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={clsx(
        'fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 bg-blanc/96 px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(11_26_42/0.22)] backdrop-blur-md transition-transform duration-200 ease-planeur md:hidden',
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+24px)]',
      )}
    >
      <div className="min-w-0 flex-1 text-sm leading-snug text-texte">{price}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
