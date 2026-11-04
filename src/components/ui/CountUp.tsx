'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

interface CountUpProps {
  value: number;
  /** Already formatted for the locale ("2 000"); rendered by the server and read by screen readers. */
  display: string;
  locale: string;
  /** A year: count without a thousands separator. */
  plain?: boolean;
  className?: string;
}

const DURATION_MS = 900;

// The `ease-planeur` curve, cubic-bezier(0.2, 0.7, 0.2, 1), approximated for a counter
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A key figure that counts up from 0 the first time it scrolls into view. */
export default function CountUp({ value, display, locale, plain = false, className }: CountUpProps) {
  const { ref, inView, startedInView } = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    // Figures already on screen at load, or reduced motion: keep the final value
    if (!inView || startedInView !== false || prefersReducedMotion()) return;
    const format = plain ? (n: number) => String(n) : (n: number) => n.toLocaleString(locale);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setShown(progress < 1 ? format(Math.round(value * ease(progress))) : null);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, startedInView, value, plain, locale]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{display}</span>
      <span aria-hidden="true">{shown ?? display}</span>
    </span>
  );
}
