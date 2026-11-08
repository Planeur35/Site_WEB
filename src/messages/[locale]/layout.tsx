import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { initiationTariffsQuery } from "@/lib/sanity/queries";
import type { Tariff } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: {
    default: "Planeurs d'Ille-et-Vilaine",
    template: "%s – Planeurs d'Ille-et-Vilaine",
  },
  description: "Association de vol à voile en Ille-et-Vilaine — Gliding association in Brittany",
  icons: { icon: "/favicon.png" },
};

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

  // Trial flight prices, shown next to the booking button in the header
  const tariffs = await sanityFetch<Tariff[]>(initiationTariffsQuery, []);
  const initiation = {
    adult: tariffs.find((tariff) => tariff.ageCategory === "adult")?.amount,
    reduced: tariffs.find((tariff) => tariff.ageCategory === "under18")?.amount,
  };

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-ciel text-slate-700 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header initiation={initiation} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
