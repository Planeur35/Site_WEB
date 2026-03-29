import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Club name and description */}
          <div>
            <h3 className="text-lg font-bold mb-3">{t("club")}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Club de vol à voile en Bretagne. Venez vivre l&apos;aventure du
              vol silencieux au-dessus des paysages bretons.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-3">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/decouvrir"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("discover")}
                </Link>
              </li>
              <li>
                <Link
                  href="/galerie"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("gallery")}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: The Club links */}
          <div>
            <h3 className="text-lg font-bold mb-3">{tn("theClub")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/le-club"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/le-club/flotte"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("fleet")}
                </Link>
              </li>
              <li>
                <Link
                  href="/le-club/aerodrome"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("aerodrome")}
                </Link>
              </li>
              <li>
                <Link
                  href="/le-club/tarifs"
                  className="text-white/70 hover:text-white hover:underline text-sm transition-colors rounded-sm"
                >
                  {tn("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div>
            <h3 className="text-lg font-bold mb-3">{tn("contact")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+33 2 99 00 00 00</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>contact@planeurs-iv.fr</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Aerodrome de Rennes - Saint-Jacques, 35000 Rennes</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">{t("followUs")}</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-white/50">
            &copy; {currentYear} {t("club")}. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
