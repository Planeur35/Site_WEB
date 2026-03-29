"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/layout/LanguageToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import Button from "@/components/ui/Button";

interface DropdownItem {
  label: string;
  href: string;
}

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={openMenu}
      onBlur={closeMenu}
    >
      <button
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors rounded-md"
        aria-expanded={open}
        aria-haspopup="true"
        onKeyDown={handleKeyDown}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-0 w-56 rounded-lg bg-white shadow-lg border border-border py-2"
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="block px-4 py-2.5 text-sm text-muted hover:text-accent hover:bg-light-bg transition-colors"
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const navLinkClasses =
  "px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors rounded-md";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const discoverItems: DropdownItem[] = [
    { label: t("whatIsSoaring"), href: "/decouvrir" },
    { label: t("discoveryFlights"), href: "/decouvrir/vols-decouverte" },
    { label: t("becomeAPilot"), href: "/decouvrir/devenir-pilote" },
  ];

  const clubItems: DropdownItem[] = [
    { label: t("aboutUs"), href: "/le-club" },
    { label: t("fleet"), href: "/le-club/flotte" },
    { label: t("aerodrome"), href: "/le-club/aerodrome" },
    { label: t("pricing"), href: "/le-club/tarifs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary shrink-0 rounded-md"
          >
            PIV
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <DesktopDropdown label={t("discover")} items={discoverItems} />
            <DesktopDropdown label={t("theClub")} items={clubItems} />
            <Link href="/galerie" className={navLinkClasses}>
              {t("gallery")}
            </Link>
            <Link href="/actualites" className={navLinkClasses}>
              {t("news")}
            </Link>
            <Link href="/en-direct" className={navLinkClasses}>
              {t("live")}
            </Link>
            <Link href="/contact" className={navLinkClasses}>
              {t("contact")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="hidden lg:block">
              <Button variant="cta" size="sm" href="/decouvrir/vols-decouverte">
                {tc("discoveryFlightCTA")}
              </Button>
            </div>
            <button
              className="lg:hidden p-2 text-muted hover:text-primary transition-colors rounded-md"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
