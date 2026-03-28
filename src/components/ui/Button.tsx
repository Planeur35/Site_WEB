import { forwardRef } from "react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-accent text-accent hover:bg-accent hover:text-white",
  ghost: "text-muted hover:text-primary hover:bg-light-bg",
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
  { variant = "primary", size = "md", href, children, className, ...rest },
  ref
) {
  const classes = clsx(
    "rounded-lg font-medium transition-colors inline-flex items-center justify-center",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href as never}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
