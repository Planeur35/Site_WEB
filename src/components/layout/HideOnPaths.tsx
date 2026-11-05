'use client';

import { usePathname } from '@/i18n/navigation';

interface HideOnPathsProps {
  /** Internal (French) pathnames where the children are not shown. */
  paths: string[];
  children: React.ReactNode;
}

/** Leaves out server-rendered content on some pages, e.g. a band the page already shows in full. */
export default function HideOnPaths({ paths, children }: HideOnPathsProps) {
  const pathname = usePathname();
  return paths.includes(pathname) ? null : children;
}
