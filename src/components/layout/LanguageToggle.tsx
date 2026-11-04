"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type LanguageToggleVariant = "codes" | "names" | "other";

interface LanguageToggleProps {
  /**
   * `codes`: "FR EN", 44 px each (header, full menu on desktop).
   * `names`: "Français · English" (full menu on mobile).
   * `other`: one link to the other language, "English version" (footer).
   */
  variant?: LanguageToggleVariant;
  className?: string;
}

const NAME_KEYS: Record<Locale, "languageFr" | "languageEn"> = { fr: "languageFr", en: "languageEn" };

export default function LanguageToggle({ variant = "codes", className }: LanguageToggleProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  // Keep dynamic segments such as the news slug
  const href = { pathname, params } as never;
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  if (variant === "other") {
    return (
      <Link href={href} locale={otherLocale} lang={otherLocale} className={className}>
        {tFooter("otherLanguage")}
      </Link>
    );
  }

  if (variant === "names") {
    return (
      <span role="group" aria-label={tNav("language")} className={clsx("inline-flex items-center gap-2", className)}>
        {routing.locales.map((l, i) => (
          <span key={l} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
            {l === locale ? (
              <span className="font-semibold text-azur">{t(NAME_KEYS[l])}</span>
            ) : (
              <Link
                href={href}
                locale={l}
                lang={l}
                className="inline-flex min-h-11 items-center font-medium text-brume underline-offset-4 hover:text-azur hover:underline"
              >
                {t(NAME_KEYS[l])}
              </Link>
            )}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span role="group" aria-label={tNav("language")} className={clsx("inline-flex items-center text-sm font-semibold", className)}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={href}
          locale={l}
          lang={l}
          aria-label={t(NAME_KEYS[l])}
          aria-current={l === locale ? "true" : undefined}
          className={clsx(
            "inline-flex size-11 items-center justify-center decoration-2 underline-offset-[6px]",
            l === locale ? "text-azur underline decoration-balise" : "text-brume hover:text-azur",
          )}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </span>
  );
}
