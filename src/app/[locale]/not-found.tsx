import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import GliderSilhouette from "@/components/ui/GliderSilhouette";
import Kicker from "@/components/ui/Kicker";

export default function NotFound() {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 md:px-8">
      <GliderSilhouette className="w-48 text-azur/20" />
      <Kicker>404</Kicker>
      <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-sky-950 md:text-5xl">{t("notFound")}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-slate-600">{t("notFoundDescription")}</p>
      <div className="mt-8">
        <Button href="/">{tCommon("backToHome")}</Button>
      </div>
    </div>
  );
}
