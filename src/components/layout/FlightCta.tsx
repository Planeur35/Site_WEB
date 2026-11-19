import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface FlightCtaProps {
  className?: string;
}

/** Small orange button to the « Venez essayer » page, placed to the right of the menu button. */
export default function FlightCta({ className }: FlightCtaProps) {
  const t = useTranslations("header");

  return (
    <Link
      href="/decouvrir"
      className={clsx(
        "inline-flex min-h-11 max-w-[7.5rem] shrink-0 items-center justify-center rounded-md px-3 py-1.5 text-center text-xs font-semibold leading-tight text-sky-950 sm:max-w-none sm:whitespace-nowrap",
        "bg-orange-400 ring-1 ring-inset ring-orange-600/30",
        // Light relief: a darker edge below, pressed down on click
        "shadow-[0_2px_0_0_#c2410c] transition hover:bg-orange-300 active:translate-y-px active:shadow-none",
        className,
      )}
    >
      {t("bookCta")}
    </Link>
  );
}
