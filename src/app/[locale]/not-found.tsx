import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FlightTrace from "@/components/ui/FlightTrace";
import Kicker from "@/components/ui/Kicker";

export default function NotFound() {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <Container className="py-16 lg:py-28">
      <div className="relative flex min-h-[360px] items-center overflow-hidden rounded-md px-6 lg:px-12">
        <FlightTrace seed="404" align="right" className="absolute! inset-0" />
        <div className="relative max-w-[440px]">
          <Kicker>404</Kicker>
          <h1 className="font-display text-[2.75rem] leading-[1.03] font-semibold tracking-titre text-azur lg:text-h2">
            {t("notFound")}
          </h1>
          <p className="mt-4 text-texte">{t("notFoundDescription")}</p>
          <div className="mt-8">
            <Button href="/">{tCommon("backToHome")}</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
