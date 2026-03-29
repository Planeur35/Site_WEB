import { forwardRef } from "react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "ghost" | "cta";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-accent text-accent hover:bg-accent hover:text-white",
  ghost: "text-muted hover:text-primary hover:bg-light-bg",
  cta: "bg-cta text-white hover:bg-cta-hover shadow-lg hover:shadow-xl",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = "primary", size = "md", href, loading, children, className, disabled, ...rest },
  ref
) {
  const isDisabled = disabled || loading;

  const classes = clsx(
    "rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "active:scale-[0.97]",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    isDisabled && "opacity-50 pointer-events-none",
    className
  );

  const content = loading ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {children}
    </>
  ) : children;

  if (href && !isDisabled) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href as never}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={isDisabled}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;
