'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tells once an element has entered the viewport (it then stays true).
 * `startedInView` is true when it was already visible on mount: callers skip their entrance animation then,
 * so content above the fold never flashes.
 */
export function useInView<T extends Element>(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null);
  const [state, setState] = useState<{ inView: boolean; startedInView: boolean | null }>({
    inView: false,
    startedInView: null,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setState({ inView: true, startedInView: true });
      return;
    }
    setState({ inView: false, startedInView: false });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState({ inView: true, startedInView: false });
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, ...state };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
