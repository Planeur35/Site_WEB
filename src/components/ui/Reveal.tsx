'use client';

import clsx from 'clsx';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

interface RevealProps {
  /** Stagger between siblings in a row: 60 ms per step. */
  index?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Rises into place ("montée") the first time it scrolls into view.
 * Content visible at load, or under reduced motion, is shown as is.
 */
export default function Reveal({ index = 0, className, children }: RevealProps) {
  const { ref, inView, startedInView } = useInView<HTMLDivElement>();
  const animate = startedInView === false && !prefersReducedMotion();

  return (
    <div
      ref={ref}
      className={clsx(className, animate && (inView ? 'animate-montee' : 'opacity-0'))}
      style={animate && inView ? { animationDelay: `${index * 60}ms` } : undefined}
    >
      {children}
    </div>
  );
}
