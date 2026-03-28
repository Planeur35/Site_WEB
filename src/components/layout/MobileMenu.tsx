"use client";

import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/layout/LanguageToggle";
import Button from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-6 pb-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* Home */}
          <Link
            href="/"
            onClick={onClose}
            className="py-3 text-dark-text font-medium hover:text-accent transition-colors border-b border-border"
          >
            {t("home")}
          </Link>

          {/* Discover section */}
          <div className="py-3 border-b border-border">
            <span className="font-semibold text-primary">{t("discover")}</span>
            <div className="mt-2 flex flex-col gap-1 pl-4">
              <Link
                href="/decouvrir"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("whatIsSoaring")}
              </Link>
              <Link
                href="/decouvrir/vols-decouverte"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("discoveryFlights")}
              </Link>
              <Link
                href="/decouvrir/devenir-pilote"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("becomeAPilot")}
              </Link>
            </div>
          </div>

          {/* The Club section */}
          <div className="py-3 border-b border-border">
            <span className="font-semibold text-primary">{t("theClub")}</span>
            <div className="mt-2 flex flex-col gap-1 pl-4">
              <Link
                href="/le-club"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("aboutUs")}
              </Link>
              <Link
                href="/le-club/flotte"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("fleet")}
              </Link>
              <Link
                href="/le-club/aerodrome"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("aerodrome")}
              </Link>
              <Link
                href="/le-club/tarifs"
                onClick={onClose}
                className="py-2 text-muted hover:text-accent transition-colors"
              >
                {t("pricing")}
              </Link>
            </div>
          </div>

          {/* Direct links */}
          <Link
            href="/galerie"
            onClick={onClose}
            className="py-3 text-dark-text font-medium hover:text-accent transition-colors border-b border-border"
          >
            {t("gallery")}
          </Link>
          <Link
            href="/actualites"
            onClick={onClose}
            className="py-3 text-dark-text font-medium hover:text-accent transition-colors border-b border-border"
          >
            {t("news")}
          </Link>
          <Link
            href="/en-direct"
            onClick={onClose}
            className="py-3 text-dark-text font-medium hover:text-accent transition-colors border-b border-border"
          >
            {t("live")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="py-3 text-dark-text font-medium hover:text-accent transition-colors border-b border-border"
          >
            {t("contact")}
          </Link>

          {/* Bottom section */}
          <div className="mt-auto pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <LanguageToggle />
            </div>
            <Button
              variant="primary"
              size="md"
              href="/contact"
              className="w-full justify-center"
            >
              {tc("discoveryFlightCTA")}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
