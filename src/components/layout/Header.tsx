"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import FullMenu from "@/components/layout/FullMenu";
import LanguageToggle from "@/components/layout/LanguageToggle";
import NavDropdown from "@/components/layout/NavDropdown";
import { HEADER_NAV, isCurrentPage } from "@/components/layout/navItems";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

interface HeaderProps {
  /** Trial flight price line for the full menu, from the `vol-initiation` tariffs. */
  trialPrice: string | null;
}

const CTA = HEADER_NAV.find((item) => item.cta);

export default function Header({ trialPrice }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Navigation closes the menu
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // The bar floats (shadow) once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A page's own main action on screen (hero button, form submit…) takes the orange
  const [pageCtaVisible, setPageCtaVisible] = useState(false);
  useEffect(() => {
    const targets = document.querySelectorAll("[data-main-cta]");
    setPageCtaVisible(false);
    if (targets.length === 0) return;
    const onScreen = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting);
      setPageCtaVisible([...onScreen.values()].some(Boolean));
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const currentOf = (page: string) => (pathname === page ? "page" : isCurrentPage(pathname, page) ? "true" : undefined);
  const ctaCurrent = CTA ? currentOf(CTA.pathname) : undefined;

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 bg-blanc/92 backdrop-blur-md transition-shadow duration-150 ease-planeur",
        scrolled && "shadow-flottant",
      )}
    >
      <Container className="flex h-16 items-center gap-8 xl:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-sm">
          <Image src="/logo-icon.png" alt="" width={195} height={174} className="h-8 w-auto xl:h-[39px]" priority />
          <span className="flex flex-col leading-[1.1]">
            <span className="font-display text-[1.0625rem] font-bold text-azur xl:text-lg">PIV</span>
            <span className="hidden text-[0.8125rem] font-medium text-brume sm:block">{tc("clubName")}</span>
          </span>
        </Link>

        <nav aria-label={t("mainNav")} className="ml-3 hidden items-center gap-1 xl:flex">
          {HEADER_NAV.filter((item) => !item.cta).map((item) =>
            item.children ? (
              <NavDropdown key={item.key} item={item} current={currentOf(item.pathname)} numbered={item.key === "club"} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={currentOf(item.pathname)}
                className={clsx(
                  "inline-flex h-11 items-center rounded-sm px-3.5 text-base whitespace-nowrap decoration-balise decoration-2 underline-offset-[10px] transition-colors duration-150",
                  currentOf(item.pathname) ? "font-semibold text-azur underline" : "font-medium text-nuit hover:text-azur",
                )}
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:gap-3">
          <div className="hidden xl:block">
            <LanguageToggle />
          </div>
          {CTA &&
            (ctaCurrent || pageCtaVisible ? (
              // On the trial flight page, or while the page shows its own main action,
              // the button stays in place as an outline: one orange button at a time
              <Link
                href={CTA.href}
                aria-current={ctaCurrent}
                className="inline-flex h-11 items-center rounded-sm border-[1.5px] border-balise bg-blanc px-[18px] text-[0.9375rem] font-semibold whitespace-nowrap text-balise transition-colors duration-150 hover:bg-ciel"
              >
                <span className="xl:hidden">{t("discoverShort")}</span>
                <span className="hidden xl:inline">{t(CTA.key)}</span>
              </Link>
            ) : (
              <Button href={CTA.href} size="sm" className="whitespace-nowrap">
                <span className="xl:hidden">{t("discoverShort")}</span>
                <span className="hidden xl:inline">{t(CTA.key)}</span>
              </Button>
            ))}
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "full-menu" : undefined}
            aria-label={t("openMenu")}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-sm px-2 text-[0.9375rem] font-semibold text-azur hover:bg-ciel sm:px-3"
          >
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">{t("menu")}</span>
          </button>
        </div>
      </Container>

      {menuOpen && <FullMenu onClose={closeMenu} trialPrice={trialPrice} />}
    </header>
  );
}
