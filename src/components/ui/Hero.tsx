import clsx from "clsx";
import Button from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: "primary" | "cta";
  backgroundImage?: string;
  className?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  ctaVariant = "primary",
  backgroundImage,
  className,
}: HeroProps) {
  return (
    <section
      className={clsx(
        "relative min-h-[60vh] flex items-center justify-center overflow-hidden",
        !backgroundImage && "bg-primary",
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </>
      )}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl mt-6 text-white/90 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaText && ctaHref && (
          <div className="mt-10">
            <Button variant={ctaVariant} size="lg" href={ctaHref}>
              {ctaText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
