import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { visibleNav } from "@/components/layout/navItems";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/lib/sanity/types";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "Twitter",
};

const linkClass = "inline-flex min-h-9 items-center text-[0.9375rem] text-nuage transition-colors duration-150 hover:text-white";

interface FooterProps {
  /** Menu keys of the pages with no content yet. */
  hiddenNav: string[];
}

export default async function Footer({ hiddenNav }: FooterProps) {
  const { groups } = visibleNav(hiddenNav);
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tc = await getTranslations("common");
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);

  // Social networks and WeGlide close the Pratique column
  const external = [
    ...(settings?.socialLinks ?? []).map((link) => ({ url: link.url, label: SOCIAL_LABELS[link.platform] ?? link.platform })),
    ...(settings?.weglideUrl ? [{ url: settings.weglideUrl, label: "WeGlide" }] : []),
  ];

  return (
    <footer className="bg-nuit text-nuage">
      <Container className="pt-20 pb-10">
        <div className="flex flex-wrap gap-x-16 gap-y-12">
          <div className="flex flex-[1_1_300px] flex-col items-start gap-5">
            <Link href="/" className="flex items-center gap-3.5 rounded-sm focus-visible:outline-white">
              <Image src="/logo-icon.png" alt="" width={195} height={174} className="h-12 w-auto" />
              <span className="max-w-[11rem] font-display text-xl leading-tight font-semibold text-white">{tc("clubName")}</span>
            </Link>
            {settings?.address && <p className="leading-relaxed whitespace-pre-line">{settings.address}</p>}
            {(settings?.contactEmail || settings?.contactPhone) && (
              <p className="flex flex-col leading-relaxed">
                {settings.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="text-white underline-offset-4 hover:underline">
                    {settings.contactEmail}
                  </a>
                )}
                {settings.contactPhone && (
                  <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                    {settings.contactPhone}
                  </a>
                )}
              </p>
            )}
            <Button href="/contact" variant="onDark" size="sm" className="mt-1">
              {t("writeToUs")}
            </Button>
          </div>

          <nav
            aria-label={t("navigation")}
            className="grid flex-[2_1_560px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-10"
          >
            {groups.map((group) => (
              <div key={group.key}>
                <h2 className="mb-3 font-display font-semibold text-white">{tNav(group.key)}</h2>
                <ul>
                  {group.items.map((link) => (
                    <li key={link.key}>
                      <Link href={link.href} className={linkClass}>
                        {tNav(link.key)}
                      </Link>
                    </li>
                  ))}
                  {group.key === "groupPractical" &&
                    external.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-nuage/18 pt-6 text-sm text-givre">
          <span>© {tc("clubName")}</span>
          <span className="flex flex-wrap gap-x-6">
            <Link href="/mentions-legales" className="inline-flex min-h-11 items-center hover:text-white">
              {t("legal")}
            </Link>
            <LanguageToggle variant="other" className="inline-flex min-h-11 items-center hover:text-white" />
          </span>
        </div>
      </Container>
    </footer>
  );
}
