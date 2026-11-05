"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { isCurrentPage, type NavGroup, type NavLink } from "@/components/layout/navItems";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

interface FullMenuProps {
  onClose: () => void;
  /** Trial flight price line, from the `vol-initiation` tariffs; hidden when null. */
  trialPrice: string | null;
  /** The four groups, without the pages that have no content yet. */
  groups: NavGroup[];
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-screen menu opened by the Menu button: four groups, accordions on mobile. */
export default function FullMenu({ onClose, trialPrice, groups }: FullMenuProps) {
  const t = useTranslations("nav");
  const tPricing = useTranslations("pricing");
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Mobile accordions: "Voler" starts open
  const [openGroup, setOpenGroup] = useState<NavGroup["key"] | null>("groupFly");

  // Lock the page behind, and start on the close button
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    // Trap focus: cycle through the visible controls only (each layout hides the other)
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // A link to an anchor of the current page does not change the pathname: close on any link
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) onClose();
  };

  const linkProps = (link: NavLink) => ({
    href: link.href,
    "aria-current": link.pathname && pathname === link.pathname ? ("page" as const) : undefined,
  });

  return createPortal(
    <div
      ref={dialogRef}
      id="full-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("fullNav")}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className="fixed inset-0 z-50 overflow-y-auto bg-blanc"
    >
      <div className="flex min-h-full flex-col">
        <Container className="flex h-16 shrink-0 items-center gap-3 xl:h-20">
          <Link href="/" className="flex items-center gap-3 rounded-sm">
            <Image src="/logo-icon.png" alt="" width={195} height={174} className="h-8 w-auto lg:h-9" />
            <span className="font-display text-[1.0625rem] font-bold text-azur">PIV</span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("closeMenu")}
            className="ml-auto inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-sm px-3 text-[0.9375rem] font-semibold text-azur hover:bg-ciel"
          >
            <span className="hidden lg:inline">{t("close")}</span>
            <X size={22} strokeWidth={2} aria-hidden="true" />
          </button>
        </Container>

        {/* Desktop: four columns */}
        <Container className="hidden flex-1 flex-col pt-9 pb-10 lg:flex">
          <nav aria-label={t("fullNav")} className="grid grid-cols-4 gap-6">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-0.5">
                <h2 className="mb-2.5 font-display text-sm font-semibold text-balise">{t(group.key)}</h2>
                {group.items.map((link) =>
                  group.key === "groupFly" ? (
                    <Link
                      key={link.key}
                      {...linkProps(link)}
                      className="flex min-h-10 items-center font-display text-xl font-semibold text-azur decoration-balise decoration-2 underline-offset-[6px] hover:underline aria-[current=page]:underline"
                    >
                      {t(link.key)}
                    </Link>
                  ) : (
                    <Link
                      key={link.key}
                      {...linkProps(link)}
                      // 34 px rows, with a 44 px hit area
                      className="relative flex min-h-[34px] items-center text-base text-nuit before:absolute before:inset-x-0 before:-inset-y-[5px] before:content-[''] hover:text-altitude aria-[current=page]:font-semibold aria-[current=page]:text-azur"
                    >
                      {t(link.key)}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-5 rounded-md bg-ciel px-6 py-5">
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-semibold text-azur">{tPricing("offers.vol-initiation")}</span>
              {trialPrice && <span className="text-sm text-texte">{trialPrice}</span>}
            </div>
            <Button href="/decouvrir" className="ml-auto">
              {t("book")}
            </Button>
            <LanguageToggle />
          </div>
        </Container>

        {/* Mobile and tablet: accordions */}
        <div className="flex flex-1 flex-col lg:hidden">
          <nav aria-label={t("fullNav")} className="px-5 pt-2 sm:px-8">
            {groups.map((group, i) => {
              const expanded = openGroup === group.key;
              const panelId = `full-menu-${group.key}`;
              return (
                <div key={group.key} className={clsx("border-t border-horizon", i === groups.length - 1 && "border-b")}>
                  <h2>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpenGroup(expanded ? null : group.key)}
                      className="flex min-h-14 w-full cursor-pointer items-center justify-between text-left font-display text-2xl font-semibold text-azur"
                    >
                      {t(group.key)}
                      <ChevronDown
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                        className={clsx("transition-transform duration-150 ease-planeur", expanded && "rotate-180")}
                      />
                    </button>
                  </h2>
                  <ul id={panelId} hidden={!expanded} className="pb-2">
                    {group.items.map((link) => (
                      <li key={link.key}>
                        <Link
                          {...linkProps(link)}
                          className="flex min-h-11 items-center pl-1 text-[1.0625rem] text-nuit aria-[current=page]:font-semibold aria-[current=page]:text-azur"
                        >
                          {t(link.key)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3.5 bg-ciel px-5 py-5 sm:px-8">
            <Button href="/decouvrir" size="lg" fullWidth>
              {t("bookTrial")}
            </Button>
            {trialPrice && <p className="text-center text-sm text-texte">{trialPrice}</p>}
            <div className="flex items-center justify-between text-[0.9375rem]">
              <LanguageToggle variant="names" />
              <Link
                href="/contact"
                className={clsx(
                  "inline-flex min-h-11 items-center font-semibold text-altitude",
                  isCurrentPage(pathname, "/contact") && "underline underline-offset-4",
                )}
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
