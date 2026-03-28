"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const otherLocale = locale === "fr" ? "en" : "fr";
  const label = locale === "fr" ? "EN" : "FR";

  function handleSwitch() {
    router.replace(pathname as never, { locale: otherLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      className="text-sm font-medium text-muted hover:text-primary transition-colors"
      aria-label={`Switch to ${otherLocale === "fr" ? "French" : "English"}`}
    >
      {label}
    </button>
  );
}
