import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FULL_NAV } from "@/components/layout/navItems";
import { sanityFetch } from "@/lib/sanity/fetch";
import { localize } from "@/lib/sanity/localize";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/lib/sanity/types";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "Twitter",
};

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tc = await getTranslations("common");
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery, null);
  const tagline = localize(settings?.tagline, locale);

  return (
    <footer className="mt-8 bg-nuit text-sky-100/80">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="" width={50} height={44} className="h-11 w-auto" />
            <span className="font-serif text-lg text-white">PIV, {tc("clubName")}</span>
          </div>
          {tagline && <p className="mt-4 text-sm leading-relaxed">{tagline}</p>}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-300">{t("navigation")}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {FULL_NAV.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="inline-flex min-h-9 items-center text-sm hover:text-white">
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-300">{t("contact")}</p>
          <div className="mt-4 space-y-2 text-sm leading-relaxed">
            {settings?.address && <p className="whitespace-pre-line">{settings.address}</p>}
            {settings?.contactEmail && (
              <p>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                  {settings.contactEmail}
                </a>
              </p>
            )}
            {settings?.contactPhone && (
              <p>
                <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`} className="hover:text-white">
                  {settings.contactPhone}
                </a>
              </p>
            )}
            <p>
              <Link href="/contact" className="text-sky-200 underline decoration-sky-300/50 underline-offset-4 hover:text-white">
                {t("writeToUs")}
              </Link>
            </p>
            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <p className="flex flex-wrap gap-4 pt-2">
                {settings.socialLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {SOCIAL_LABELS[link.platform] ?? link.platform}
                  </a>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs uppercase tracking-[0.25em] text-sky-300/80">
        © {new Date().getFullYear()} PIV · planeur35.org
      </div>
    </footer>
  );
}
