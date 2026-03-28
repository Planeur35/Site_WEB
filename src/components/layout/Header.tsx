"use client";

import { useState } from "react";
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

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors">
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0 w-56 rounded-lg bg-white shadow-lg border border-border py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="block px-4 py-2.5 text-sm text-muted hover:text-accent hover:bg-light-bg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
          {/* Left: Logo / Club name */}
          <Link
            href="/"
            className="text-xl font-bold text-primary shrink-0"
          >
            PIV
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <DesktopDropdown label={t("discover")} items={discoverItems} />
            <DesktopDropdown label={t("theClub")} items={clubItems} />
            <Link
              href="/galerie"
              className="px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors"
            >
              {t("gallery")}
            </Link>
            <Link
              href="/actualites"
              className="px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors"
            >
              {t("news")}
            </Link>
            <Link
              href="/en-direct"
              className="px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors"
            >
              {t("live")}
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 text-sm font-medium text-dark-text hover:text-accent transition-colors"
            >
              {t("contact")}
            </Link>
          </nav>

          {/* Right: Language toggle + CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="hidden lg:block">
              <Button variant="primary" size="sm" href="/contact">
                {tc("discoveryFlightCTA")}
              </Button>
            </div>
            <button
              className="lg:hidden p-2 text-muted hover:text-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
