import clsx from "clsx";
import Button from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  className?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  backgroundImage,
  className,
}: HeroProps) {
  return (
    <section
      className={clsx(
        "relative min-h-[60vh] flex items-center justify-center",
        !backgroundImage && "bg-primary",
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </>
      )}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl mt-4 text-white/80">{subtitle}</p>
        )}
        {ctaText && ctaHref && (
          <div className="mt-8">
            <Button variant="primary" size="lg" href={ctaHref}>
              {ctaText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
