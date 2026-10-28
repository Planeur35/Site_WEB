"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 md:px-8">
      <Kicker>{t("kicker")}</Kicker>
      <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-sky-950 md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-slate-600">{t("description")}</p>
      {error.digest && <p className="mt-2 font-mono text-sm text-slate-500">{error.digest}</p>}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={reset}>{t("tryAgain")}</Button>
        <Button href="/" variant="outline">
          {tCommon("backToHome")}
        </Button>
      </div>
    </div>
  );
}
