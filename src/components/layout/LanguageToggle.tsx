"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("common");

  const otherLocale = locale === "fr" ? "en" : "fr";

  function handleSwitch() {
    // Keep dynamic segments such as the news slug
    router.replace({ pathname, params } as never, { locale: otherLocale });
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-xs font-medium uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-sky-950"
      aria-label={t("switchLanguageLabel")}
      lang={otherLocale}
    >
      {otherLocale.toUpperCase()}
    </button>
  );
}
