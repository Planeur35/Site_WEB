// next/link rather than @/i18n/navigation: this page sits outside the locale tree.
import Link from "next/link";

// Last-resort 404 for requests outside a locale (e.g. a missing file such as
// /favicon.ico). The root layout renders no <html>, so this page provides it.
// No translations here either: both languages are shown.
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-blanc p-6 font-sans text-texte antialiased">
        <main className="max-w-md text-center">
          <h1 className="font-display text-h3 font-semibold text-azur">Page introuvable</h1>
          <p lang="en" className="mt-2 text-brume">Page not found</p>
          <p className="mt-6 flex justify-center gap-6 font-semibold">
            <Link href="/fr" className="inline-flex min-h-11 items-center text-altitude underline decoration-horizon decoration-2 underline-offset-4 hover:decoration-altitude">
              Accueil
            </Link>
            <Link href="/en" lang="en" className="inline-flex min-h-11 items-center text-altitude underline decoration-horizon decoration-2 underline-offset-4 hover:decoration-altitude">
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
