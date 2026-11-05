import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

type ButtonVariant = 'primary' | 'secondary' | 'onDark';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** `primary` (orange) is for the one main action on a screen. */
  variant?: ButtonVariant;
  /** `sm` 44 px (header), `md` 48 px, `lg` 52 px (hero and price panel). */
  size?: ButtonSize;
  /** Internal page, or a full address with `external`. */
  href?: LinkHref | string;
  external?: boolean;
  fullWidth?: boolean;
  /**
   * The page's own main action. While it is on screen, the header's orange
   * "Venez essayer" turns to an outline, so there is one orange button at a time.
   */
  mainCta?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-balise text-white hover:bg-balise-fonce',
  secondary: 'border-[1.5px] border-azur bg-blanc text-azur hover:bg-ciel',
  onDark: 'bg-white text-nuit hover:bg-nuage focus-visible:outline-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-11',
  md: 'h-12',
  lg: 'h-13',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  fullWidth = false,
  mainCta = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = clsx(
    'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-sm px-[22px] text-base font-semibold transition-colors duration-150 ease-planeur disabled:cursor-not-allowed disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className,
  );
  const marker = mainCta ? { 'data-main-cta': '' } : {};

  if (href && external) {
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={classes} {...marker}>
        {children}
        <ExternalLink size={18} strokeWidth={2} aria-hidden="true" />
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href as LinkHref} className={classes} {...marker}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...marker} {...rest}>
      {children}
    </button>
  );
}
