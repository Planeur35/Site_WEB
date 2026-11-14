"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "@/components/layout/LanguageToggle";
import FlightCta, { type InitiationPrices } from "@/components/layout/FlightCta";
import { FULL_NAV, HEADER_NAV } from "@/components/layout/navItems";

interface HeaderProps {
  /** Trial flight prices, shown in the booking button. */
  initiation: InitiationPrices;
}

export default function Header({ initiation }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // The logo is large at the top of a page and shrinks once the visitor scrolls, to keep the sticky bar slim.
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  // Close the menu on navigation and with Escape
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled((was) => (was ? window.scrollY > 20 : window.scrollY > 60));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The name of the association on two lines next to the logo: « Planeurs » / « d’Ille-et-Vilaine »
  const [nameFirst, ...nameRest] = tc("clubName").split(" ");

  return (
    <header className="sticky top-0 z-40 border-b border-sky-900/15 bg-ciel/90 backdrop-blur">
      <div
        className={clsx(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-200 sm:px-6 md:px-8",
          scrolled ? "h-20" : "h-24 md:h-28",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo-icon.png"
            alt=""
            width={200}
            height={178}
            className={clsx("w-auto transition-[height] duration-200", scrolled ? "h-11" : "h-14 md:h-[88px]")}
            priority
          />
          <span className="hidden font-serif font-normal text-lg leading-tight text-sky-950 lg:block">
            <span className="block">{nameFirst}</span>
            <span className="block whitespace-nowrap">{nameRest.join(" ")}</span>
          </span>
          <span className="sr-only lg:hidden">{tc("clubName")}</span>
        </Link>

        {/* Main navigation: only when there is room for it next to the buttons (1400 px and up) */}
        <nav className="ml-auto hidden items-center gap-4 min-[1400px]:flex" aria-label={t("mainNav")}>
          {HEADER_NAV.map((item) => (
            <div key={item.key} className="group relative">
              <Link
                href={item.href}
                className={clsx(
                  "inline-flex items-center gap-1 whitespace-nowrap border-b-2 pb-1 text-xs font-medium uppercase tracking-[0.08em] transition",
                  isActive(item.pathname)
                    ? "border-sky-800 text-sky-950"
                    : "border-transparent text-slate-600 hover:border-sky-400 hover:text-sky-950",
                )}
              >
                {t(item.key)}
                {item.children && (
                  <span className="text-[8px] text-sky-700 transition-transform group-hover:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full z-50 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="min-w-52 border border-sky-900/15 bg-white py-2 shadow-[0_16px_40px_-16px_rgba(14,28,43,0.35)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className="block whitespace-nowrap px-4 py-2 text-xs uppercase tracking-[0.15em] text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-950"
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Language, menu, then the booking button on the far right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center text-sky-950"
            aria-expanded={menuOpen}
            aria-controls="full-menu"
            aria-label={t("menu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
          <FlightCta prices={initiation} className="ml-1 sm:ml-2" />
        </div>
      </div>

      <nav id="full-menu" hidden={!menuOpen} className="border-t border-sky-900/15 bg-ciel" aria-label={t("fullNav")}>
        <div className="mx-auto flex max-h-[calc(100vh-7rem)] max-w-5xl flex-col overflow-y-auto px-4 py-4 sm:px-6 md:px-8">
          {FULL_NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "border-b border-sky-900/10 py-3 text-xs font-medium uppercase tracking-[0.2em] last:border-0",
                isActive(item.pathname) ? "text-sky-950" : "text-slate-600 hover:text-sky-950",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
