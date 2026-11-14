import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface InitiationPrices {
  adult?: number;
  reduced?: number;
}

interface FlightCtaProps {
  prices: InitiationPrices;
  className?: string;
}

/**
 * Small orange button to the « Venez essayer » page, placed to the right of the menu button.
 * The trial flight prices sit in the button itself (second line, from the `sm` breakpoint up).
 */
export default function FlightCta({ prices, className }: FlightCtaProps) {
  const t = useTranslations("header");
  const tp = useTranslations("pricing");
  const adult = prices.adult != null ? tp("amount", { amount: prices.adult }) : null;
  const reduced = prices.reduced != null ? tp("amount", { amount: prices.reduced }) : null;

  // Second line: « 170 € · 130 € moins de 18 ans »
  const priceLine = [adult, reduced ? t("priceReducedShort", { price: reduced }) : null].filter(Boolean).join(" · ");
  // Full wording for screen readers and the tooltip, including the condition for the reduced price
  const fullLabel = [t("bookCta"), adult, reduced ? t("priceReduced", { price: reduced }) : null].filter(Boolean).join(" – ");

  return (
    <Link
      href="/decouvrir"
      aria-label={fullLabel}
      title={fullLabel}
      className={clsx(
        "inline-flex min-h-11 max-w-[7.5rem] shrink-0 flex-col items-center justify-center rounded-md px-3 py-1.5 text-center leading-tight text-sky-950 sm:max-w-none",
        "bg-orange-400 ring-1 ring-inset ring-orange-600/30",
        // Light relief: a darker edge below, pressed down on click
        "shadow-[0_2px_0_0_#c2410c] transition hover:bg-orange-300 active:translate-y-px active:shadow-none",
        className,
      )}
    >
      <span className="text-xs font-semibold sm:whitespace-nowrap">{t("bookCta")}</span>
      {priceLine && <span className="hidden text-[11px] font-medium sm:block">{priceLine}</span>}
    </Link>
  );
}
