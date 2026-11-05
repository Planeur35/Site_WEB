'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls to the #anchor of a link that came from another page (e.g. the menu's "Compétition" from
 * /planeurs). The page streams in after its loading screen, so the browser's own jump happens before
 * the section exists; this waits for it, up to two seconds. Same-page anchors are left to the browser.
 */
export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const jump = () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else if (tries++ < 20) timer = setTimeout(jump, 100);
    };
    const frame = requestAnimationFrame(jump);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
