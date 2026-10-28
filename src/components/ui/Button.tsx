import clsx from 'clsx';
import { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

type ButtonVariant = 'solid' | 'outline';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  /** Internal page, or a full address with `external`. */
  href?: LinkHref | string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid: 'bg-sky-950 text-white hover:bg-sky-800',
  outline: 'border border-sky-950 text-sky-950 hover:bg-sky-950 hover:text-white',
};

export default function Button({ variant = 'solid', href, external = false, className, children, ...rest }: ButtonProps) {
  const classes = clsx(
    'inline-flex min-h-11 cursor-pointer items-center justify-center px-8 py-3.5 text-xs font-medium uppercase tracking-[0.3em] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    variantStyles[variant],
    className,
  );

  if (href && external) {
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href as LinkHref} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
