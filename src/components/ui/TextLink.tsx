import clsx from 'clsx';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

interface TextLinkProps {
  href: LinkHref | string;
  /** External links open in a new tab and take a plain string. */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

const style =
  'group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-altitude decoration-2 underline-offset-4 hover:underline';
const arrow = 'shrink-0 transition-transform duration-150 ease-planeur group-hover:translate-x-1';

/** Link with an arrow ("Toutes les actualités →"). */
export default function TextLink({ href, external = false, className, children }: TextLinkProps) {
  if (external) {
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={clsx(style, className)}>
        {children}
        <ArrowUpRight size={18} strokeWidth={2} className={arrow} aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={href as LinkHref} className={clsx(style, className)}>
      {children}
      <ArrowRight size={18} strokeWidth={2} className={arrow} aria-hidden="true" />
    </Link>
  );
}
