import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface InitiationPrices {
  adult?: number;
  reduced?: number;
}

interface FlightCtaProps {
  prices: InitiationPrices;
  /** Phone layout: full-width button, price inside, smaller note. */
  compact?: boolean;
  /** Hide the secondary note (used once the page is scrolled on phones). */
  hideNote?: boolean;
  className?: string;
}

/** Orange button to the « Venez essayer » page, with the trial flight prices next to it. */
export default function FlightCta({ prices, compact = false, hideNote = false, className }: FlightCtaProps) {
  const t = useTranslations("header");
  const tp = useTranslations("pricing");
  const adult = prices.adult != null ? tp("amount", { amount: prices.adult }) : null;
  const reduced = prices.reduced != null ? tp("amount", { amount: prices.reduced }) : null;

  const button = (
    <Link
      href="/decouvrir"
      className={clsx(
        "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-semibold text-white",
        "bg-linear-to-b from-orange-700 to-red-700 ring-1 ring-inset ring-white/25",
        // Raised look: a darker edge below, pressed down on click
        "shadow-[0_4px_0_0_#7f1d1d,0_10px_18px_-8px_rgba(127,29,29,0.7)]",
        "transition hover:-translate-y-px hover:brightness-110 active:translate-y-[3px] active:shadow-[0_1px_0_0_#7f1d1d]",
        compact && "w-full",
      )}
    >
      {t("bookCta")}
      {compact && adult && <span className="ml-2 border-l border-white/40 pl-2">{adult}</span>}
    </Link>
  );

  if (compact) {
    return (
      <div className={className}>
        {button}
        {reduced && !hideNote && <p className="mt-2 text-xs leading-snug text-slate-700">{t("priceReduced", { price: reduced })}</p>}
      </div>
    );
  }

  return (
    <div className={clsx("items-center gap-4", className)}>
      {button}
      {(adult || reduced) && (
        <div className="leading-tight">
          {adult && <p className="font-serif font-normal text-2xl text-sky-950">{adult}</p>}
          {reduced && <p className="mt-0.5 max-w-[15rem] text-xs leading-snug text-slate-700">{t("priceReduced", { price: reduced })}</p>}
        </div>
      )}
    </div>
  );
}
