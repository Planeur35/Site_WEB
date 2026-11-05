"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FlightTrace from "@/components/ui/FlightTrace";
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

  // Same frame as the 404 and the empty states: a sky with a flight trace
  return (
    <Container className="py-16 lg:py-28">
      <div className="relative flex min-h-[360px] items-center overflow-hidden rounded-md px-6 py-10 lg:px-12">
        <FlightTrace seed="erreur" align="right" className="absolute! inset-0" />
        <div className="relative max-w-[440px]">
          <Kicker>{t("kicker")}</Kicker>
          <h1 className="font-display text-[2.75rem] leading-[1.03] font-semibold tracking-titre text-azur lg:text-h2">
            {t("title")}
          </h1>
          <p className="mt-4 text-texte">{t("description")}</p>
          {error.digest && <p className="mt-2 font-mono text-sm text-brume">{error.digest}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={reset}>{t("tryAgain")}</Button>
            <Button href="/" variant="secondary">
              {tCommon("backToHome")}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
