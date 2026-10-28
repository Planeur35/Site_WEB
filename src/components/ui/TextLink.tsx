import clsx from 'clsx';
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
  'inline-block text-xs uppercase tracking-[0.25em] text-sky-800 underline decoration-sky-300 underline-offset-4 hover:decoration-sky-800';

/** Small capitals link ("All news", "Open on WeGlide"). */
export default function TextLink({ href, external = false, className, children }: TextLinkProps) {
  if (external) {
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={clsx(style, className)}>
        {children} <span aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <Link href={href as LinkHref} className={clsx(style, className)}>
      {children}
    </Link>
  );
}
