import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHiddenNavKeys } from "@/lib/emptyPages";
import { formatAmount, getTrialPrices } from "@/lib/pricing";

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Planeurs d’Ille-et-Vilaine",
    template: "%s – Planeurs d’Ille-et-Vilaine",
  },
  description: "Association de vol en planeur en Ille-et-Vilaine — Gliding association in Brittany",
  icons: { icon: "/favicon.png" },
};

// The header and footer read Sanity (prices, contact details)
export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const [trialPrice, hiddenNav] = await Promise.all([formatTrialPrice(locale), getHiddenNavKeys()]);

  return (
    <html lang={locale} className={`${interTight.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-blanc font-sans text-texte antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header trialPrice={trialPrice} hiddenNav={hiddenNav} />
          <main className="flex-1">{children}</main>
          <Footer hiddenNav={hiddenNav} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/** "170 € · 130 € moins de 18 ans", or null when the prices are not in the Studio yet. */
async function formatTrialPrice(locale: string): Promise<string | null> {
  const { adult, young } = await getTrialPrices();
  if (adult == null) return null;
  const t = await getTranslations({ locale, namespace: "nav" });
  const format = (amount: number) => formatAmount(amount, locale);
  return young == null
    ? t("trialPriceSingle", { amount: format(adult) })
    : t("trialPrice", { adult: format(adult), young: format(young) });
}
