import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionContainer from "@/components/ui/SectionContainer";

export default function NotFound() {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg">
      <SectionContainer className="text-center py-20">
        {/* Large 404 number */}
        <p className="text-8xl font-bold text-primary/20 select-none">404</p>

        {/* Glider silhouette */}
        <div className="mt-6 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 60"
            className="w-48 h-14 text-primary/15"
            fill="currentColor"
          >
            <path d="M10 30 Q20 28 60 26 L95 10 Q100 8 100 13 L100 25 Q130 24 170 26 L190 22 Q195 21 193 26 L170 28 Q130 29 100 29 L100 35 Q100 40 95 38 L60 28 Q20 32 10 30Z" />
            <path d="M95 38 L90 52 Q89 55 92 54 L100 50 Q103 55 100 54 L92 54 Q88 56 90 52" opacity="0.7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-3xl md:text-4xl font-bold text-primary">
          {t("notFound")}
        </h1>

        {/* Description */}
        <p className="mt-4 text-lg text-muted max-w-md mx-auto">
          {t("notFoundDescription")}
        </p>

        {/* Back to home button */}
        <div className="mt-8">
          <Button variant="primary" size="lg" href="/">
            {tCommon("backToHome")}
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
}
