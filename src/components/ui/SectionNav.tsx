'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { prefersReducedMotion } from '@/lib/useInView';

export interface SectionNavLink {
  /** The section's `id` on the page. */
  id: string;
  label: string;
}

interface SectionNavProps {
  links: SectionNavLink[];
  /** Accessible name of the bar ("Sections de la page"). */
  label: string;
}

/**
 * Anchor bar of a long page, sticky under the header. It highlights the section in view:
 * underlined tabs on large screens, chips in a horizontal scroller on phones.
 */
export default function SectionNav({ links, label }: SectionNavProps) {
  const [active, setActive] = useState(links[0]?.id);
  const scroller = useRef<HTMLDivElement>(null);
  // A clicked link stays active while the page scrolls to it (two sections can sit side by side)
  const pinned = useRef(false);
  const ids = links.map((l) => l.id).join(' ');

  // The active section is the first one crossing a thin band just above the middle of the screen
  useEffect(() => {
    const order = ids.split(' ');
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        }
        const first = order.find((id) => crossing.has(id));
        if (first && !pinned.current) setActive(first);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const id of order) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  const select = (id: string) => {
    setActive(id);
    pinned.current = true;
    let timer = 0;
    const release = () => {
      pinned.current = false;
      window.clearTimeout(timer);
      window.removeEventListener('scrollend', release);
    };
    window.addEventListener('scrollend', release, { once: true });
    // Fallback where `scrollend` is not supported
    timer = window.setTimeout(release, 1500);
  };

  // Keep the active chip visible in the horizontal scroller
  useEffect(() => {
    const box = scroller.current;
    const link = box?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!box || !link) return;
    const start = link.offsetLeft;
    const end = start + link.offsetWidth;
    if (start < box.scrollLeft || end > box.scrollLeft + box.clientWidth) {
      box.scrollTo({ left: start - 20, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-16 z-30 mt-10 border-b border-horizon bg-blanc/94 backdrop-blur-md lg:mt-12 xl:top-20"
    >
      <div
        ref={scroller}
        className="relative mx-auto flex max-w-7xl snap-x snap-proximity scroll-px-5 gap-2 overflow-x-auto px-5 py-1.5 [scrollbar-width:none] sm:px-8 lg:gap-1 lg:px-10 lg:py-0"
      >
        {links.map((link) => {
          const current = link.id === active;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-section={link.id}
              aria-current={current ? 'location' : undefined}
              onClick={() => select(link.id)}
              // 44 px tap target around a 36 px chip on phones; 56 px tabs from lg
              className={clsx(
                'group flex h-11 shrink-0 snap-start items-center whitespace-nowrap lg:h-14 lg:px-3.5 lg:text-[0.9375rem] lg:transition-colors lg:duration-150',
                current
                  ? 'font-semibold lg:text-azur lg:shadow-[inset_0_-2px_0_var(--color-balise)]'
                  : 'font-medium lg:text-texte lg:hover:text-azur',
              )}
            >
              <span
                className={clsx(
                  'flex h-9 items-center rounded-xs px-3.5 text-sm transition-colors duration-150 lg:h-auto lg:rounded-none lg:bg-transparent lg:px-0 lg:text-[0.9375rem] lg:text-inherit',
                  current ? 'bg-azur text-white' : 'bg-ciel text-azur group-hover:bg-horizon lg:group-hover:bg-transparent',
                )}
              >
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
